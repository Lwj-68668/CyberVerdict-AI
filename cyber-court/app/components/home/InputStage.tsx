import Link from "next/link";
import type { VerdictHistoryItem } from "@/app/types/verdict";
import RecentHistory from "./RecentHistory";

interface InputStageProps {
  chatLog: string;
  error: string;
  historyItems: VerdictHistoryItem[];
  onChange: (value: string) => void;
  onLoadExample: (value: string) => void;
  onSelectHistory: (item: VerdictHistoryItem) => void;
  onSubmit: () => void;
}

const EXAMPLE_CHAT = `A：你为什么又没有提前说？
B：我只是忘了，又不是故意的。
A：每次都是这样，你根本没把这件事当回事。
B：你一上来就定性，我根本没法和你聊。`;

const TEMPLATES = [
  {
    label: "情侣争执",
    value: EXAMPLE_CHAT,
  },
  {
    label: "朋友误会",
    value: `A：我上次找你帮忙你根本没回。
B：我那天在忙，不是故意不理你。
A：可你后来还有空发朋友圈。
B：发个朋友圈不代表我有精力处理你的事。`,
  },
  {
    label: "同事协作",
    value: `A：这个需求延期是因为你没有按时给我数据。
B：我没按时给是因为你最开始就没讲清楚格式。
A：你完全可以先问，而不是拖到最后。
B：每次都要我来兜底，本身就说明流程有问题。`,
  },
];

export default function InputStage({
  chatLog,
  error,
  historyItems,
  onChange,
  onLoadExample,
  onSelectHistory,
  onSubmit,
}: InputStageProps) {
  const charCount = chatLog.trim().length;

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/8 px-3 py-1 text-xs text-[var(--gold)]">
              Beta / 分析聊天冲突的结构化工具
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              这不是“谁更会吵”，而是“谁的论证更站得住”。
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              粘贴一段聊天记录，系统会提取双方立场、识别关键逻辑漏洞，并给出一份更像产品而不是玩具的结构化结果。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <div className="text-sm font-medium text-white">结构化结果</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                输出摘要、责任比例、关键证据、逻辑标签和后续建议。
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <div className="text-sm font-medium text-white">适合长对话</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                支持微信、QQ、IM 等多段聊天记录直接粘贴。
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <div className="text-sm font-medium text-white">本地回看</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                会保存最近分析记录，便于快速重看结果。
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/8 bg-white/4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-white">快速模板</div>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  用示例数据快速体验结果结构。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.label}
                    type="button"
                    onClick={() => onLoadExample(template.value)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[var(--text-secondary)] transition hover:border-[var(--gold)]/25 hover:text-white"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-[var(--bg-card)]/92 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">提交聊天记录</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                建议至少包含 4 轮对话，并保留原始表达。
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-muted)]">
              {charCount} 字
            </span>
          </div>

          <label className="mb-3 block text-sm font-medium text-white" htmlFor="chat-log">
            聊天内容
          </label>
          <textarea
            id="chat-log"
            value={chatLog}
            onChange={(event) => onChange(event.target.value)}
            placeholder={EXAMPLE_CHAT}
            className="min-h-[300px] w-full rounded-2xl border border-white/8 bg-[#09111e] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-[#60708d] focus:border-[var(--gold)]/40"
          />

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="text-xs leading-6 text-[var(--text-muted)]">
              默认推荐使用服务端环境变量配置模型。
              “开发模式 API 设置”仅用于本地调试，不建议作为正式用户路径。
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
              {charCount < 20 ? "内容过短" : "可以开始分析"}
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-[var(--red)]/30 bg-[var(--red)]/10 px-4 py-3 text-sm text-[#ffb1b8]">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#e63946_0%,#c1121f_45%,#203657_100%)] px-4 py-4 text-sm font-semibold tracking-[0.18em] text-white transition hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(230,57,70,0.35)]"
          >
            开始分析
          </button>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
            <Link href="/guide" className="transition hover:text-white">
              使用说明
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              隐私说明
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <RecentHistory items={historyItems} onSelect={onSelectHistory} />

        <div className="rounded-[28px] border border-white/8 bg-white/4 p-5">
          <div className="text-sm font-medium text-white">当前版本已补齐的产品能力</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-[#0b1320] p-4">
              <div className="text-sm text-white">更稳的结果结构</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                不再只返回一段文案，而是返回摘要、争议点、标签和建议。
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#0b1320] p-4">
              <div className="text-sm text-white">更清晰的产品定位</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                明确把本地 API Key 输入降级成开发模式，而不是默认用户路径。
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#0b1320] p-4">
              <div className="text-sm text-white">更完整的落地页</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                增加模板、帮助入口和最近分析，首页不再只是一个大文本框。
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#0b1320] p-4">
              <div className="text-sm text-white">继续待做</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                鉴权、数据库、限流、监控等仍然属于下一阶段的后端工作。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
