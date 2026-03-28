"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TypewriterText from "./TypewriterText";
import type { VerdictResult } from "../types/verdict";

interface VerdictPanelProps {
  verdict: VerdictResult;
  onGeneratePoster: () => void;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
      {children}
    </div>
  );
}

export default function VerdictPanel({
  verdict,
  onGeneratePoster,
}: VerdictPanelProps) {
  const [showPosterButton, setShowPosterButton] = useState(false);

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto w-full max-w-3xl rounded-[28px] border border-white/8 bg-[var(--bg-card)]/92 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">
              Verdict
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              结果详情
            </h2>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-muted)]">
            结构化输出
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/8 p-4">
              <SectionTitle>关键句</SectionTitle>
              <p className="mt-3 text-sm italic leading-7 text-white/88">
                “{verdict.guiltiest_sentence}”
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <SectionTitle>关键争议点</SectionTitle>
              <div className="mt-3 space-y-3">
                {verdict.key_points.map((point) => (
                  <div
                    key={point}
                    className="rounded-xl border border-white/8 bg-[#0b1320] px-3 py-3 text-sm leading-6 text-[var(--text-secondary)]"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <SectionTitle>双方代号</SectionTitle>
              <div className="mt-3 grid gap-3">
                <div className="rounded-2xl border border-[var(--red)]/20 bg-[var(--red)]/8 p-4">
                  <div className="text-xs text-[#ffb8be]">甲方</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {verdict.player_A}
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">
                    {verdict.score_A}%
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--blue-light)]/20 bg-[var(--blue-light)]/8 p-4">
                  <div className="text-xs text-[#bfdfff]">乙方</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {verdict.player_B}
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">
                    {verdict.score_B}%
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <SectionTitle>逻辑与沟通问题</SectionTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                {verdict.logic_flaws.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-[#0b1320] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 p-4">
          <SectionTitle>AI 判词</SectionTitle>
          <div className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            <TypewriterText
              key={verdict.verdict}
              text={verdict.verdict}
              speed={18}
              onComplete={() => setShowPosterButton(true)}
            />
          </div>
        </div>

        {showPosterButton ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onGeneratePoster}
            className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#1c2f4d_0%,#345f8e_100%)] px-4 py-3 text-sm font-semibold text-white"
          >
            生成分享海报
          </motion.button>
        ) : null}
      </motion.section>
    </AnimatePresence>
  );
}
