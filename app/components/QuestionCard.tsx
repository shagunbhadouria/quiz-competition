import { TopicId, getTopicById, getTopicColors, getTopicGradient } from "./TopicSelect";
import styles from "../quiz.module.css";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

type QuestionCardProps = {
  topicId: TopicId;
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
};

export default function QuestionCard({
  topicId,
  question,
  currentIndex,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  const topic = getTopicById(topicId);

  // Color is chosen here: getTopicColors/getTopicGradient look up this
  // topic's id in the colors map (defined in TopicSelect.tsx) and return
  // ready-to-use color values, applied directly as inline styles.
  const headerGradient = getTopicGradient(topicId, 90);
  const colors = getTopicColors(topicId);

  return (
    <div className={styles.card}>
      <div className={styles.header} style={{ background: headerGradient }}>
        <h1>{topic.name} Quiz</h1>

        <div className={styles.info}>
          <span>
            Question {currentIndex + 1} / {totalQuestions}
          </span>

          <span className={styles.timer}>⏳ {timeLeft}s</span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className={styles.body}>
        <h2 className={styles.question}>{question.question}</h2>

        <div className={styles.options}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;

            return (
              <button
                key={index}
                onClick={() => onAnswer(index)}
                disabled={selectedAnswer !== null}
                className={styles.option}
                style={
                  isSelected
                    ? {
                        borderColor: colors.primary,
                        background: "#eff6ff",
                      }
                    : undefined
                }
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}