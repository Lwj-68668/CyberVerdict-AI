"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import ApiSettingsModal from "./components/ApiSettingsModal";
import PosterGenerator from "./components/PosterGenerator";
import VerdictPanel from "./components/VerdictPanel";
import { AnalysisStage, InputStage, ResultStage } from "./components/home";
import type {
  ApiSettings,
  AppState,
  VerdictHistoryItem,
  VerdictResponse,
  VerdictResult,
} from "./types/verdict";

const GaugeChart = dynamic(() => import("./components/GaugeChart"), {
  ssr: false,
});

const DEFAULT_API_SETTINGS: ApiSettings = {
  apiKey: "",
  apiBase: "",
};

const HISTORY_STORAGE_KEY = "cyber-court-history";

function buildHistoryItem(chatLog: string, result: VerdictResult): VerdictHistoryItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    chatLog,
    chatPreview: chatLog.slice(0, 120),
    result,
  };
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("input");
  const [chatLog, setChatLog] = useState("");
  const [gaugeValue, setGaugeValue] = useState(50);
  const [verdict, setVerdict] = useState<VerdictResult | null>(null);
  const [error, setError] = useState("");
  const [showApiModal, setShowApiModal] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [apiSettings, setApiSettings] =
    useState<ApiSettings>(DEFAULT_API_SETTINGS);
  const [historyItems, setHistoryItems] = useState<VerdictHistoryItem[]>([]);

  const gaugeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cyber-court-api-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<ApiSettings>;
        setApiSettings({
          apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : "",
          apiBase: typeof parsed.apiBase === "string" ? parsed.apiBase : "",
        });
      } catch {
        localStorage.removeItem("cyber-court-api-settings");
      }
    }

    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (history) {
      try {
        setHistoryItems(JSON.parse(history) as VerdictHistoryItem[]);
      } catch {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      }
    }
  }, []);

  const appendHistoryItem = useCallback((item: VerdictHistoryItem) => {
    setHistoryItems((current) => {
      const next = [item, ...current].slice(0, 5);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveApiSettings = (settings: ApiSettings) => {
    setApiSettings(settings);
    localStorage.setItem("cyber-court-api-settings", JSON.stringify(settings));
  };

  const startGaugeAnimation = useCallback(() => {
    gaugeIntervalRef.current = setInterval(() => {
      setGaugeValue(Math.random() * 100);
    }, 140);
  }, []);

  const stopGaugeAnimation = useCallback((finalValue: number) => {
    if (gaugeIntervalRef.current) {
      clearInterval(gaugeIntervalRef.current);
      gaugeIntervalRef.current = null;
    }
    setGaugeValue(finalValue);
  }, []);

  useEffect(() => {
    return () => {
      if (gaugeIntervalRef.current) {
        clearInterval(gaugeIntervalRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    const normalizedChatLog = chatLog.trim();
    if (normalizedChatLog.length < 20) {
      setError("聊天记录太短，至少提供一段完整对话再提交分析。");
      return;
    }

    setError("");
    setVerdict(null);
    setShowPoster(false);
    setAppState("analyzing");
    startGaugeAnimation();

    try {
      const response = await fetch("/api/verdict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatLog: normalizedChatLog,
          apiKey: apiSettings.apiKey,
          apiBase: apiSettings.apiBase,
        }),
      });

      const data = (await response.json()) as VerdictResponse;
      if (!response.ok || !data.ok) {
        const message = data.ok
          ? "分析服务暂时不可用，请稍后重试。"
          : data.error;
        throw new Error(message);
      }

      stopGaugeAnimation(data.result.score_B);
      setVerdict(data.result);
      appendHistoryItem(buildHistoryItem(normalizedChatLog, data.result));
      window.setTimeout(() => setAppState("result"), 500);
    } catch (requestError: unknown) {
      stopGaugeAnimation(50);
      setAppState("input");
      setError(
        requestError instanceof Error
          ? requestError.message
          : "分析失败，请检查配置后重试。",
      );
    }
  };

  const handleReset = () => {
    setAppState("input");
    setVerdict(null);
    setChatLog("");
    setGaugeValue(50);
    setError("");
    setShowPoster(false);
  };

  const handleSelectHistory = (item: VerdictHistoryItem) => {
    setVerdict(item.result);
    setGaugeValue(item.result.score_B);
    setChatLog(item.chatLog);
    setShowPoster(false);
    setError("");
    setAppState("result");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[rgba(7,10,18,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xl text-[var(--gold)]">[审]</span>
            <div>
              <div className="font-mono text-sm font-bold tracking-[0.28em] text-[var(--gold)]">
                CYBER COURT
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                对聊天争议做结构化分析，而不是情绪站队。
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {appState === "result" ? (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/75 transition hover:border-white/20 hover:text-white"
              >
                重新开始
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setShowApiModal(true)}
              className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-2 text-xs text-[var(--gold)] transition hover:bg-[var(--gold)]/16"
            >
              开发模式 API 设置
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-24 sm:px-6">
        <AnimatePresence mode="wait">
          {appState === "input" ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <InputStage
                chatLog={chatLog}
                error={error}
                historyItems={historyItems}
                onChange={setChatLog}
                onLoadExample={setChatLog}
                onSelectHistory={handleSelectHistory}
                onSubmit={handleSubmit}
              />
            </motion.div>
          ) : null}

          {appState === "analyzing" ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <AnalysisStage>
                <GaugeChart
                  value={gaugeValue}
                  isAnimating
                  playerA="甲方"
                  playerB="乙方"
                />
              </AnalysisStage>
            </motion.div>
          ) : null}

          {appState === "result" && verdict ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <ResultStage verdict={verdict}>
                <div className="mx-auto w-full max-w-3xl">
                  <GaugeChart
                    value={verdict.score_B}
                    isAnimating={false}
                    playerA={verdict.player_A}
                    playerB={verdict.player_B}
                  />
                </div>
                <VerdictPanel
                  verdict={verdict}
                  onGeneratePoster={() => setShowPoster(true)}
                />
              </ResultStage>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <ApiSettingsModal
        key={`${showApiModal}-${apiSettings.apiBase}-${apiSettings.apiKey.length}`}
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={saveApiSettings}
        currentSettings={apiSettings}
      />

      {showPoster && verdict ? (
        <PosterGenerator
          verdict={verdict}
          onClose={() => setShowPoster(false)}
        />
      ) : null}
    </div>
  );
}
