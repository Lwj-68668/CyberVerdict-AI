export interface VerdictResult {
  player_A: string;
  player_B: string;
  score_A: number;
  score_B: number;
  summary: string;
  guiltiest_sentence: string;
  key_points: string[];
  logic_flaws: string[];
  suggested_next_step: string;
  verdict: string;
}

export interface VerdictSuccessResponse {
  ok: true;
  result: VerdictResult;
}

export interface VerdictErrorResponse {
  ok: false;
  error: string;
}

export type VerdictResponse = VerdictSuccessResponse | VerdictErrorResponse;

export interface ApiSettings {
  apiKey: string;
  apiBase: string;
}

export interface VerdictHistoryItem {
  id: string;
  createdAt: string;
  chatLog: string;
  chatPreview: string;
  result: VerdictResult;
}

export type AppState = "input" | "analyzing" | "result";
