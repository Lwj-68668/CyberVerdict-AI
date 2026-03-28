import type { ReactNode } from "react";
import type { VerdictResult } from "@/app/types/verdict";

interface ResultStageProps {
  verdict: VerdictResult;
  children: ReactNode;
}

export default function ResultStage({
  verdict,
  children,
}: ResultStageProps) {
  const winner = verdict.score_B >= verdict.score_A ? verdict.player_B : verdict.player_A;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[28px] border border-white/8 bg-white/4 p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
            Analysis Summary
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            {winner} 略占上风
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            {verdict.summary}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--red)]/20 bg-[var(--red)]/8 p-4">
              <div className="text-sm text-[#ffb8be]">{verdict.player_A}</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {verdict.score_A}%
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--blue-light)]/20 bg-[var(--blue-light)]/8 p-4">
              <div className="text-sm text-[#bfdfff]">{verdict.player_B}</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {verdict.score_B}%
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--gold)]/15 bg-[var(--gold)]/8 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
              建议下一步
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {verdict.suggested_next_step}
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-[var(--bg-card)]/92 p-4 sm:p-6">
          {children}
        </div>
      </div>
    </section>
  );
}
