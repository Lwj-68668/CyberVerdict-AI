import type { VerdictHistoryItem } from "@/app/types/verdict";

interface RecentHistoryProps {
  items: VerdictHistoryItem[];
  onSelect: (item: VerdictHistoryItem) => void;
}

export default function RecentHistory({
  items,
  onSelect,
}: RecentHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/8 bg-white/4 p-5">
        <div className="text-sm font-medium text-white">最近分析记录</div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          这里会展示最近 5 次本地分析结果，方便你快速回看。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-white/4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">最近分析记录</div>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            仅保存在当前浏览器本地，不会自动同步。
          </p>
        </div>
        <div className="text-xs text-[var(--text-muted)]">{items.length} 条</div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full rounded-2xl border border-white/8 bg-[#0b1320] p-4 text-left transition hover:border-[var(--gold)]/20 hover:bg-[#101a2a]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {item.result.player_A} vs {item.result.player_B}
                </div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">
                  {item.chatPreview}
                </div>
              </div>
              <div className="shrink-0 text-xs text-[var(--text-muted)]">
                {new Date(item.createdAt).toLocaleDateString("zh-CN")}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="truncate text-xs text-[var(--gold)]">
                {item.result.summary}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {item.result.score_A}% / {item.result.score_B}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
