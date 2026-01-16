import styles from '../../config/styles.json';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

export function Header({ showBackButton = false, onBack, title }: HeaderProps) {
  return (
    <header className={styles.header.container}>
      <div className="flex items-center gap-4">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
          >
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <h1 className={styles.header.logo}>
          {title || 'رياضيات الأطفال'}
        </h1>
      </div>

      {/* Decorative elements */}
      {/* <div className="flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        <span className="text-2xl">✨</span>
        <span className="text-2xl">🎯</span>
      </div> */}
    </header>
  );
}

export default Header;
