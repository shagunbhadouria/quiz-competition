import { TopicId, getTopicById, getTopicColors, getTopicGradient } from "./TopicSelect";
import { LeaderboardEntry } from "../lib/leaderboard";
import styles from "../quiz.module.css";

type ResultScreenProps = {
  topicId: TopicId;
  score: number;
  maxScore: number;
  playerName: string;
  leaderboard: LeaderboardEntry[];
  onRestart: () => void;
  onChangeTopic: () => void;
};

const TOP_COUNT = 10;

function getMedal(rank: number): string {
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return "";
}

export default function ResultScreen({
  topicId,
  score,
  maxScore,
  playerName,
  leaderboard,
  onRestart,
  onChangeTopic,
}: ResultScreenProps) {
  const topic = getTopicById(topicId);

  // Color is chosen here: getTopicColors / getTopicGradient look up this
  // topic's id in the colors map (defined in TopicSelect.tsx) and are
  // applied directly as inline styles throughout this screen.
  const heroGradient = getTopicGradient(topicId);
  const colors = getTopicColors(topicId);

  const percentage = Math.round((score / maxScore) * 100);
  const topEntries = leaderboard.slice(0, TOP_COUNT);

  const playerRank = leaderboard.findIndex(
    (entry) => entry.name === playerName && entry.score === score && entry.maxScore === maxScore
  );

  const playerIsInTop = playerRank !== -1 && playerRank < TOP_COUNT;
  const playerEntry = playerRank !== -1 ? leaderboard[playerRank] : null;

  return (
    <div className={styles.card}>
      <div className={styles.resultHero} style={{ background: heroGradient }}>
        <span className={styles.resultBadge}>Quiz Completed 🎉</span>
        <div className={styles.resultScoreCircle}>
          <span className={styles.resultScoreNumber}>{score}</span>
          <span className={styles.resultScoreDivider}>/ {maxScore}</span>
        </div>
        <p className={styles.resultPercentage}>{percentage}% correct</p>
      </div>

      <div className={styles.body}>
        <h3 className={styles.leaderboardTitle}>
          {topic.icon} {topic.name} Leaderboard
        </h3>

        {leaderboard.length === 0 ? (
          <p className={styles.leaderboardEmpty}>
            No scores yet for {topic.name} — you&apos;re the first!
          </p>
        ) : (
          <div className={styles.leaderboardList}>
            {topEntries.map((entry, index) => {
              const isCurrentPlayer = index === playerRank;

              return (
                <div
                  key={index}
                  className={styles.leaderboardRow}
                  style={
                    isCurrentPlayer
                      ? { borderColor: colors.primary, background: "#eff6ff" }
                      : undefined
                  }
                >
                  <span
                    className={styles.leaderboardRank}
                    style={{ color: colors.primary }}
                  >
                    {getMedal(index) || `#${index + 1}`}
                  </span>
                  <span className={styles.leaderboardName}>{entry.name}</span>
                  <span className={styles.leaderboardScore}>
                    {entry.score}/{entry.maxScore}
                  </span>
                </div>
              );
            })}

            {!playerIsInTop && playerEntry && (
              <>
                <div className={styles.leaderboardDivider}>⋯</div>
                <div
                  className={styles.leaderboardRow}
                  style={{ borderColor: colors.primary, background: "#eff6ff" }}
                >
                  <span className={styles.leaderboardRank} style={{ color: colors.primary }}>
                    #{playerRank + 1}
                  </span>
                  <span className={styles.leaderboardName}>{playerEntry.name}</span>
                  <span className={styles.leaderboardScore}>
                    {playerEntry.score}/{playerEntry.maxScore}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <div className={styles.buttonArea}>
          <button
            className={styles.nextButton}
            style={{ background: heroGradient }}
            onClick={onRestart}
          >
            Play Again
          </button>
        </div>

        <button
          type="button"
          className={styles.backLink}
          style={{ borderColor: colors.primary, color: colors.primary, background: "#fff" }}
          onClick={onChangeTopic}
        >
          ← Choose a different topic
        </button>
      </div>
    </div>
  );
}