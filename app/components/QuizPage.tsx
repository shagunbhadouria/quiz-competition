"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getLeaderboard,
  saveScore,
  clearLegacyLeaderboard,
  saveLastPlayerName,
  LeaderboardEntry,
} from "../lib/leaderboard";
import TopicSelect, { TopicId } from "./TopicSelect";
import NameEntry from "./NameEntry";
import QuestionCard from "./QuestionCard";
import ResultScreen from "./ResultScreen";
import styles from "../quiz.module.css";

// Each topic's question bank is loaded directly with require() from its
// own JSON file - no per-topic .ts wrapper files.
/* eslint-disable @typescript-eslint/no-require-imports */
const techData = require("../data/tech.json");
const scienceData = require("../data/science.json");
const historyData = require("../data/history.json");
const sportsData = require("../data/sports.json");
const moviesData = require("../data/movies.json");
const geographyData = require("../data/geography.json");
/* eslint-enable @typescript-eslint/no-require-imports */

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

const questionBanksByTopic: Record<TopicId, Question[]> = {
  tech: techData.questions,
  science: scienceData.questions,
  history: historyData.questions,
  sports: sportsData.questions,
  movies: moviesData.questions,
  geography: geographyData.questions,
};

const TOTAL_QUESTIONS = 10;
const TIMER_DURATION = 15;

type Stage = "topic" | "name" | "quiz" | "result";

function shuffleQuestions(questions: Question[]) {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, TOTAL_QUESTIONS);
}

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("topic");
  const [topicId, setTopicId] = useState<TopicId | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const hasFinishedRef = useRef(false);

  useEffect(() => {
    clearLegacyLeaderboard();
  }, []);

  const finishQuiz = useCallback(
    (finalScore: number) => {
      if (hasFinishedRef.current || !topicId) return;
      hasFinishedRef.current = true;

      saveScore(topicId, playerName, finalScore, TOTAL_QUESTIONS);
      setLeaderboard(getLeaderboard(topicId));
      setStage("result");
    },
    [playerName, topicId]
  );

  const nextQuestion = useCallback(
    (finalScore?: number) => {
      setCurrentQuestion((prev) => {
        if (prev + 1 < questions.length) {
          setSelectedAnswer(null);
          setTimeLeft(TIMER_DURATION);
          return prev + 1;
        }
        finishQuiz(finalScore ?? score);
        return prev;
      });
    },
    [questions.length, finishQuiz, score]
  );

  useEffect(() => {
    if (stage !== "quiz" || questions.length === 0) return;

    if (timeLeft === 0) {
      const timeoutId = setTimeout(() => nextQuestion(), 0);
      return () => clearTimeout(timeoutId);
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, stage, questions, nextQuestion]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null) return;

      setSelectedAnswer(index);
      const isCorrect = index === questions[currentQuestion].correctIndex;
      const updatedScore = isCorrect ? score + 1 : score;

      if (isCorrect) {
        setScore(updatedScore);
      }

      setTimeout(() => {
        nextQuestion(updatedScore);
      }, 400);
    },
    [selectedAnswer, questions, currentQuestion, nextQuestion, score]
  );

  const selectTopic = (id: TopicId) => {
    setTopicId(id);
    setStage("name");
  };

  const startQuiz = (name: string) => {
    if (!topicId) return;

    hasFinishedRef.current = false;
    setPlayerName(name);
    saveLastPlayerName(name);
    setQuestions(shuffleQuestions(questionBanksByTopic[topicId]));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(TIMER_DURATION);
    setStage("quiz");
  };

  const restartQuiz = () => {
    setStage("name");
    setPlayerName("");
  };

  const backToTopics = () => {
    setStage("topic");
    setTopicId(null);
    setPlayerName("");
  };

  if (stage === "topic" || !topicId) {
    return (
      <div className={styles.container}>
        <TopicSelect onSelect={selectTopic} />
      </div>
    );
  }

  if (stage === "name") {
    return (
      <div className={styles.container}>
        <NameEntry topicId={topicId} onStart={startQuiz} onBack={backToTopics} />
      </div>
    );
  }

  if (stage === "quiz") {
    if (questions.length === 0) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.body}>
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <QuestionCard
          topicId={topicId}
          question={questions[currentQuestion]}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ResultScreen
        topicId={topicId}
        score={score}
        maxScore={TOTAL_QUESTIONS}
        playerName={playerName}
        leaderboard={leaderboard}
        onRestart={restartQuiz}
        onChangeTopic={backToTopics}
      />
    </div>
  );
}