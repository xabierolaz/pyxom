import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface InteractiveQuizProps {
  quizData: QuizQuestion[];
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedOption: string) => {
    if (quizData[currentQuestionIndex].correctAnswer === selectedOption) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return <div className="quiz-result">Your score: {score}/{quizData.length}</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="interactive-quiz">
      <h3>{currentQuestion.question}</h3>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleAnswer(option)}>{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InteractiveQuiz;
