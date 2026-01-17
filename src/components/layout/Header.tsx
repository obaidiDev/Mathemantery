import styles from '../../config/styles.json';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

export function Header({ showBackButton = false, onBack, title }: HeaderProps) {
  return (
    <header className="w-full mb-8 sm:mb-10 md:mb-12">
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="self-start flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all mb-4"
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
      <h1 className={`${styles.header.logo} text-center`}>
        {title || 'رياضيات الأطفال'}
      </h1>
    </header>
  );
}

export default Header;
