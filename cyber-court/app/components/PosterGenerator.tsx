"use client";

import { useRef } from "react";
import type { VerdictResult } from "../types/verdict";

interface PosterGeneratorProps {
  verdict: VerdictResult;
  onClose: () => void;
}

export default function PosterGenerator({
  verdict,
  onClose,
}: PosterGeneratorProps) {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!posterRef.current) {
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#050912",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `cyber-court-${verdict.player_A}-vs-${verdict.player_B}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Poster generation failed:", error);
      alert("海报生成失败，请稍后重试。");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={posterRef}
          className="rounded-[28px] border border-[var(--gold)]/25 bg-[linear-gradient(180deg,#09111d_0%,#111d2d_100%)] p-8"
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
              Cyber Court
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              聊天争议判决
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              结构化摘要海报
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--red)]/20 bg-[var(--red)]/8 p-4 text-center">
              <div className="text-sm text-[#ffb8be]">{verdict.player_A}</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {verdict.score_A}%
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--blue-light)]/20 bg-[var(--blue-light)]/8 p-4 text-center">
              <div className="text-sm text-[#bfdfff]">{verdict.player_B}</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {verdict.score_B}%
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
              关键句
            </div>
            <p className="mt-3 text-sm italic leading-7 text-white/88">
              “{verdict.guiltiest_sentence}”
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
              摘要
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {verdict.summary}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]">
              判词摘要
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {verdict.verdict.slice(0, 120)}
              {verdict.verdict.length > 120 ? "..." : ""}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 rounded-2xl bg-[linear-gradient(135deg,#e63946_0%,#c1121f_100%)] px-4 py-3 text-sm font-semibold text-white"
          >
            下载海报
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
