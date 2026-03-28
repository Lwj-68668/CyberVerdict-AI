import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-16 sm:px-6">
      <div className="rounded-[32px] border border-white/8 bg-[var(--bg-card)]/92 p-8">
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
          Privacy
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-white">隐私说明</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
          <p>
            当前版本不会自动创建账号体系，也不会把“最近分析记录”同步到服务器。
            最近分析记录只保存在当前浏览器的本地存储中。
          </p>
          <p>
            如果你在开发模式里手动填写第三方模型 API Key，这些信息同样只会存放在当前浏览器本地，
            但这仍然不适合作为正式产品方案。
          </p>
          <p>
            粘贴到分析器中的聊天文本会发送到你配置的模型服务端进行处理，因此不建议输入敏感个人信息、
            账号密码、身份证号或其他高风险内容。
          </p>
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
