import type { ReactNode } from "react";

interface AnalysisStageProps {
  children: ReactNode;
}

const ANALYSIS_STEPS = [
  "正在清洗聊天文本并识别角色",
  "正在提取争议点与关键句",
  "正在评估双方论证强度",
];

export default function AnalysisStage({ children }: AnalysisStageProps) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-3 py-1 text-xs text-[var(--gold)]">
          分析中
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          系统正在拆解对话结构，而不只是拼接情绪标签。
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          当前展示的是过渡态。后续阶段会把它升级为真实的多步骤任务流和更可信的进度反馈。
        </p>
      </div>

      <div className="w-full max-w-2xl">{children}</div>

      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {ANALYSIS_STEPS.map((step) => (
          <div
            key={step}
            className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-[var(--text-secondary)]"
          >
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}
