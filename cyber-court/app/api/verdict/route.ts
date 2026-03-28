import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { VerdictResult } from "@/app/types/verdict";

const SYSTEM_PROMPT = `
你是一个克制、犀利、但不低俗的“赛博法官”。
你的任务是分析用户提供的聊天记录，判断双方在论证、沟通方式和责任上的相对问题。

请重点完成以下事情：
1. 识别双方主要立场。
2. 找出对话中的逻辑漏洞、情绪操控或偷换概念。
3. 给双方各取一个简短代号。
4. 提取一句最能代表问题核心的原话。
5. 生成一段 40-80 字的摘要。
6. 列出 3 条关键争议点。
7. 列出 2-4 个逻辑或沟通问题标签。
8. 给出 1 条具体的下一步建议。
9. 输出一段 80 字以上的判词，要求具体、可读、不过度辱骂。

只允许输出 JSON，不要输出任何额外文字。格式必须是：
{
  "player_A": "甲方代号",
  "player_B": "乙方代号",
  "score_A": 45,
  "score_B": 55,
  "summary": "摘要",
  "guiltiest_sentence": "一句原话",
  "key_points": ["争议点1", "争议点2", "争议点3"],
  "logic_flaws": ["标签1", "标签2"],
  "suggested_next_step": "下一步建议",
  "verdict": "完整判词"
}
`;

const REQUEST_TIMEOUT_MS = 30_000;

interface VerdictRequestBody {
  chatLog?: unknown;
  apiKey?: unknown;
  apiBase?: unknown;
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function internalError(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateRequestBody(body: VerdictRequestBody) {
  const chatLog = normalizeText(body.chatLog);
  const apiKey = normalizeText(body.apiKey);
  const apiBase = normalizeText(body.apiBase);

  if (chatLog.length < 20) {
    return {
      ok: false as const,
      error: "聊天记录过短，至少提供一段完整对话再提交。",
    };
  }

  if (chatLog.length > 12_000) {
    return {
      ok: false as const,
      error: "聊天记录过长，请先精简到 12000 字以内。",
    };
  }

  return {
    ok: true as const,
    value: {
      chatLog,
      apiKey,
      apiBase,
    },
  };
}

function isVerdictResult(value: unknown): value is VerdictResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.player_A === "string" &&
    typeof candidate.player_B === "string" &&
    typeof candidate.score_A === "number" &&
    typeof candidate.score_B === "number" &&
    typeof candidate.summary === "string" &&
    typeof candidate.guiltiest_sentence === "string" &&
    Array.isArray(candidate.key_points) &&
    Array.isArray(candidate.logic_flaws) &&
    typeof candidate.suggested_next_step === "string" &&
    typeof candidate.verdict === "string"
  );
}

function normalizeVerdict(result: VerdictResult): VerdictResult {
  const scoreA = Number.isFinite(result.score_A) ? result.score_A : 50;
  const scoreB = Number.isFinite(result.score_B) ? result.score_B : 50;
  const total = scoreA + scoreB;

  let normalizedA = Math.max(0, Math.min(100, Math.round(scoreA)));
  let normalizedB = Math.max(0, Math.min(100, Math.round(scoreB)));

  if (total > 0 && total !== 100) {
    normalizedA = Math.round((scoreA / total) * 100);
    normalizedB = 100 - normalizedA;
  }

  if (total <= 0) {
    normalizedA = 50;
    normalizedB = 50;
  }

  const keyPoints = result.key_points
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
  const logicFlaws = result.logic_flaws
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    player_A: result.player_A.trim() || "甲方",
    player_B: result.player_B.trim() || "乙方",
    score_A: normalizedA,
    score_B: normalizedB,
    summary: result.summary.trim() || "系统已完成本次聊天争议分析。",
    guiltiest_sentence: result.guiltiest_sentence.trim() || "未提取到关键句。",
    key_points:
      keyPoints.length > 0 ? keyPoints : ["当前模型未提取到足够清晰的争议点。"],
    logic_flaws:
      logicFlaws.length > 0 ? logicFlaws : ["缺少稳定标签，请结合原始对话人工复核。"],
    suggested_next_step:
      result.suggested_next_step.trim() || "建议双方先复述事实，再分别回应具体诉求。",
    verdict: result.verdict.trim() || "模型未返回有效判词。",
  };
}

async function createVerdict(
  chatLog: string,
  apiKeyOverride: string,
  apiBaseOverride: string,
) {
  const apiKey = apiKeyOverride || process.env.OPENAI_API_KEY || "";
  const baseURL = apiBaseOverride || process.env.OPENAI_BASE_URL || "";
  const model = process.env.AI_MODEL || "deepseek-chat";

  if (!apiKey) {
    throw new Error("未配置模型 API Key。请在服务端环境变量中设置，或仅在开发模式下临时填写。");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: baseURL || undefined,
  });

  const completion = await Promise.race([
    client.chat.completions.create({
      model,
      temperature: 0.6,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `请分析以下聊天记录，并返回 JSON：\n\n${chatLog}`,
        },
      ],
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("模型响应超时，请稍后重试。"));
      }, REQUEST_TIMEOUT_MS);
    }),
  ]);

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("模型没有返回可解析内容。");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("模型返回格式错误，无法解析为 JSON。");
  }

  if (!isVerdictResult(parsed)) {
    throw new Error("模型返回缺少必要字段。");
  }

  return normalizeVerdict(parsed);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VerdictRequestBody;
    const validated = validateRequestBody(body);

    if (!validated.ok) {
      return badRequest(validated.error);
    }

    const result = await createVerdict(
      validated.value.chatLog,
      validated.value.apiKey,
      validated.value.apiBase,
    );

    return NextResponse.json({ ok: true, result });
  } catch (error: unknown) {
    console.error("Verdict API Error:", error);

    if (error instanceof Error) {
      return internalError(error.message);
    }

    return internalError("服务暂时不可用，请稍后重试。");
  }
}
