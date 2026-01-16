import { useEffect, useState } from 'react';
import { gameConfig } from '../../config/gameConfig';
import styles from '../../config/styles.json';

interface QuestionFeedbackProps {
  isCorrect: boolean | null;
  correctAnswer?: string | number;
  onContinue: () => void;
}

export function QuestionFeedback({
  isCorrect,
  correctAnswer,
  onContinue,
}: QuestionFeedbackProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isCorrect === true) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  // Auto-continue after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  const getMessage = () => {
    if (isCorrect === null) {
      return gameConfig.labels.feedback.skipped;
    }
    if (isCorrect) {
      return gameConfig.labels.feedback.correct;
    }
    return `${gameConfig.labels.feedback.wrong}: ${correctAnswer}`;
  };

  const getIcon = () => {
    if (isCorrect === null) {
      return (
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      );
    }
    if (isCorrect) {
      return (
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getBgColor = () => {
    if (isCorrect === null) return 'bg-gray-100';
    if (isCorrect) return 'bg-green-100';
    return 'bg-red-100';
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${styles.animations.fadeIn}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onContinue} />

      {/* Confetti for correct answers */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#fbbf24', '#34d399', '#f472b6', '#60a5fa', '#a78bfa'][
                  Math.floor(Math.random() * 5)
                ],
                animation: `confetti ${1.5 + Math.random()}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Feedback card */}
      <div
        className={`relative ${getBgColor()} rounded-3xl p-8 shadow-2xl transform ${
          isCorrect === true ? styles.animations.bounceIn : isCorrect === false ? styles.animations.shake : ''
        }`}
        onClick={onContinue}
      >
        <div className="flex flex-col items-center gap-4">
          {getIcon()}
          <p
            className={`text-xl font-bold ${
              isCorrect === null
                ? 'text-gray-600'
                : isCorrect
                ? styles.text.feedbackCorrect
                : styles.text.feedbackWrong
            }`}
          >
            {getMessage()}
          </p>
          <p className="text-sm text-gray-500">اضغط للمتابعة</p>
        </div>
      </div>
    </div>
  );
}

export default QuestionFeedback;
