import Link from "next/link";

const STEPS = [
  "粘贴尽量完整的聊天记录，保留双方原始表达。",
  "确保至少有 4 轮往返，避免只贴单句情绪发言。",
  "点击“开始分析”，等待系统输出结构化判决结果。",
  "阅读摘要、关键争议点、逻辑标签和下一步建议。",
];

export default function GuidePage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-16 sm:px-6">
      <div className="rounded-[32px] border border-white/8 bg-[var(--bg-card)]/92 p-8">
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
          Guide
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-white">使用说明</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          Cyber Court 当前适合做聊天争议的结构化参考，不适合作为法律意见、心理诊断或事实裁定依据。
        </p>

        <div className="mt-8 space-y-4">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-white/8 bg-white/4 p-4"
            >
              <div className="text-sm font-medium text-white">
                {index + 1}. {step}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--gold)]/15 bg-[var(--gold)]/8 p-4 text-sm leading-7 text-[var(--text-secondary)]">
          建议把它当作“对话复盘工具”，重点看系统提取出来的关键句、争议点和沟通风险，而不是只盯着分数。
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/20"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
