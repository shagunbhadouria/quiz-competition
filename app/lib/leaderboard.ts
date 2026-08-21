import { TopicId } from "../components/TopicSelect";

export type LeaderboardEntry = {
  name: string;
  score: number;
  maxScore: number;
  date: string;
};

const STORAGE_PREFIX = "quiz_leaderboard_";
const LEGACY_STORAGE_KEY = "quiz_leaderboard";
const LAST_NAME_KEY = "quiz_last_player_name";

function getStorageKey(topicId: TopicId): string {
  return `${STORAGE_PREFIX}${topicId}`;
}

export function clearLegacyLeaderboard(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function getLastPlayerName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(LAST_NAME_KEY) ?? "";
}

export function saveLastPlayerName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_NAME_KEY, name);
}

function readRawEntries(topicId: TopicId): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(getStorageKey(topicId));
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLeaderboard(topicId: TopicId): LeaderboardEntry[] {
  const entries = readRawEntries(topicId);
  return [...entries].sort((a, b) => b.score - a.score);
}

export function saveScore(
  topicId: TopicId,
  name: string,
  score: number,
  maxScore: number
): void {
  if (typeof window === "undefined") return;

  const entries = readRawEntries(topicId);
  const newEntry: LeaderboardEntry = {
    name: name.trim() || "Anonymous",
    score,
    maxScore,
    date: new Date().toISOString().slice(0, 10),
  };

  const updated = [...entries, newEntry];
  window.localStorage.setItem(getStorageKey(topicId), JSON.stringify(updated));
}