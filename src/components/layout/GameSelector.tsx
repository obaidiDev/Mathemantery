import type { GameType } from '../../types';
import { gameConfig, gameColors } from '../../config/gameConfig';
import styles from '../../config/styles.json';

interface GameSelectorProps {
  onSelectGame: (gameType: GameType) => void;
}

const gameTypes: GameType[] = [
  'addition',
  'subtraction',
  'additionSubtraction',
  'multiplication',
  'division',
  'multiplicationDivision',
  'arithmetic',
  'readingNumbers',
  'comparingNumbers',
  'fractions',
];

const gameEmojis: Record<GameType, string> = {
  addition: '➕',
  subtraction: '➖',
  additionSubtraction: '➕➖',
  multiplication: '✖️',
  division: '➗',
  multiplicationDivision: '✖️➗',
  arithmetic: '🔢',
  readingNumbers: '📖',
  comparingNumbers: '⚖️',
  fractions: '🍕',
};

export function GameSelector({ onSelectGame }: GameSelectorProps) {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-6 sm:mb-8">
        اختر اللعبة
      </h2>

      <div className={styles.gameSelector.grid}>
        {gameTypes.map((gameType) => {
          const colors = gameColors[gameType];
          const emoji = gameEmojis[gameType];
          const name = gameConfig.labels.gameNames[gameType];

          return (
            <button
              key={gameType}
              onClick={() => onSelectGame(gameType)}
              className={`${styles.gameSelector.card} ${colors.bg} ${styles.gameSelector.cardHover}`}
            >
              <span className={styles.gameSelector.icon}>{emoji}</span>
              <span className={`${styles.gameSelector.name} ${colors.text}`}>
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GameSelector;
