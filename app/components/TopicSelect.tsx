import styles from "../quiz.module.css";

/* eslint-disable @typescript-eslint/no-require-imports */
const techData = require("../data/tech.json");
const scienceData = require("../data/science.json");
const historyData = require("../data/history.json");
const sportsData = require("../data/sports.json");
const moviesData = require("../data/movies.json");
const geographyData = require("../data/geography.json");
/* eslint-enable @typescript-eslint/no-require-imports */

export type TopicId = "tech" | "science" | "history" | "sports" | "movies" | "geography";

export type TopicColors = {
  primary: string;
  secondary: string;
};

export type Topic = {
  id: TopicId;
  name: string;
  description: string;
  icon: string;
  colors: TopicColors;
};

const topics: Topic[] = [
  techData,
  scienceData,
  historyData,
  sportsData,
  moviesData,
  geographyData,
];

const topicsById: Record<TopicId, Topic> = {
  tech: techData,
  science: scienceData,
  history: historyData,
  sports: sportsData,
  movies: moviesData,
  geography: geographyData,
};

export function getTopicById(id: TopicId): Topic {
  return topicsById[id];
}

export function getTopicColors(topicId: TopicId): TopicColors {
  return topicsById[topicId].colors;
}

export function getTopicGradient(topicId: TopicId, angle: number = 135): string {
  const colors = getTopicColors(topicId);
  return `linear-gradient(${angle}deg, ${colors.primary}, ${colors.secondary})`;
}

type TopicSelectProps = {
  onSelect: (topicId: TopicId) => void;
};

export default function TopicSelect({ onSelect }: TopicSelectProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topicHero}>
        <span className={styles.topicEmoji}>🎯</span>
        <h1 className={styles.topicTitle}>Quiz Competition</h1>
        <p className={styles.topicSubtitle}>Pick a topic to get started</p>
      </div>

      <div className={styles.body}>
        <div className={styles.topicGrid}>
          {topics.map((topic) => {
            const gradient = getTopicGradient(topic.id);

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelect(topic.id)}
                className={styles.topicCard}
                style={{ background: gradient }}
              >
                <span className={styles.topicCardIcon}>{topic.icon}</span>
                <span className={styles.topicCardName}>{topic.name}</span>
                <span className={styles.topicCardDescription}>{topic.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}