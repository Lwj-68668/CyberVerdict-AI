"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ApiSettings } from "../types/verdict";

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ApiSettings) => void;
  currentSettings: ApiSettings;
}

const PRESETS = [
  { label: "DeepSeek", base: "https://api.deepseek.com" },
  { label: "Kimi", base: "https://api.moonshot.cn/v1" },
  { label: "OpenAI", base: "https://api.openai.com/v1" },
  { label: "自定义", base: "" },
];

export default function ApiSettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: ApiSettingsModalProps) {
  const [apiKey, setApiKey] = useState(currentSettings.apiKey);
  const [apiBase, setApiBase] = useState(currentSettings.apiBase);
  const [selectedPreset, setSelectedPreset] = useState(() => {
    const presetIndex = PRESETS.findIndex(
      (preset) => preset.base && preset.base === currentSettings.apiBase,
    );
    return presetIndex >= 0 ? presetIndex : PRESETS.length - 1;
  });

  const handlePreset = (index: number) => {
    setSelectedPreset(index);
    setApiBase(PRESETS[index].base);
  };

  const handleSave = () => {
    onSave({
      apiKey: apiKey.trim(),
      apiBase: apiBase.trim(),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[var(--bg-card)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  开发模式 API 设置
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  这个入口只用于本地调试或联调第三方模型。正式产品路径应该由服务端托管模型密钥，而不是让终端用户自行填写。
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-[var(--text-muted)] transition hover:text-white"
              >
                关闭
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Provider 预设
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset, index) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePreset(index)}
                      className="rounded-2xl border px-3 py-3 text-sm transition"
                      style={{
                        borderColor:
                          selectedPreset === index
                            ? "rgba(244,208,63,0.4)"
                            : "rgba(255,255,255,0.08)",
                        background:
                          selectedPreset === index
                            ? "rgba(244,208,63,0.12)"
                            : "rgba(255,255,255,0.03)",
                        color:
                          selectedPreset === index
                            ? "#f4d03f"
                            : "var(--text-secondary)",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-2xl border border-white/8 bg-[#0b1320] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#64748b] focus:border-[var(--gold)]/35"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Base URL
                </label>
                <input
                  type="text"
                  value={apiBase}
                  onChange={(event) => setApiBase(event.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="w-full rounded-2xl border border-white/8 bg-[#0b1320] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#64748b] focus:border-[var(--gold)]/35"
                />
              </div>

              <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/8 px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
                本地保存仅存在浏览器 localStorage。这适合开发者自测，不适合正式面向用户的产品方案。
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#203657_0%,#2b5d8a_100%)] px-4 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
              >
                保存配置
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
