"use client";

import { useState } from "react";
import { TopicId, getTopicById, getTopicColors, getTopicGradient } from "./TopicSelect";
import { getLastPlayerName } from "../lib/leaderboard";
import styles from "../quiz.module.css";

type NameEntryProps = {
  topicId: TopicId;
  onStart: (name: string) => void;
  onBack: () => void;
};

export default function NameEntry({ topicId, onStart, onBack }: NameEntryProps) {
  const [name, setName] = useState(() => getLastPlayerName());

  const topic = getTopicById(topicId);

  // Color is chosen here: look up this topic's id via getTopicColors /
  // getTopicGradient (both defined in TopicSelect.tsx) and apply the
  // result directly as inline styles - no CSS class involved.
  const heroGradient = getTopicGradient(topicId);
  const colors = getTopicColors(topicId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onStart(name.trim());
  };

  return (
    <div className={styles.card}>
      <div className={styles.nameHero} style={{ background: heroGradient }}>
        <span className={styles.nameEmoji}>{topic.icon}</span>
        <h1 className={styles.nameTitle}>{topic.name} Quiz</h1>
        <p className={styles.nameSubtitle}>10 quick questions. 15 seconds each. Let&apos;s go.</p>
      </div>

      <div className={styles.body}>
        <form onSubmit={handleSubmit} className={styles.nameForm}>
          <label htmlFor="playerName" className={styles.nameLabel}>
            Enter your name
          </label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Shagun"
            className={styles.nameInput}
            maxLength={30}
            autoFocus
          />

          <div className={styles.buttonArea}>
            <button
              type="submit"
              className={styles.nextButton}
              style={{ background: heroGradient }}
              disabled={!name.trim()}
            >
              Start Quiz
            </button>
          </div>
        </form>

        <button
          type="button"
          className={styles.backLink}
          style={{ borderColor: colors.primary, color: colors.primary, background: "#fff" }}
          onClick={onBack}
        >
          ← Choose a different topic
        </button>
      </div>
    </div>
  );
}