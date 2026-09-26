import { useId, useRef } from 'react';
import { CloseIcon } from '../icons/CloseIcon';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount: number | null;
}

export const SearchBar = ({ value, onChange, resultsCount }: SearchBarProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div role="search">
      <label htmlFor={id} className="visually-hidden">
        Search
      </label>
      <div className={styles.field}>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a smartphone..."
          autoComplete="off"
          className={styles.input}
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Borrar búsqueda"
            onClick={handleClear}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <p className={styles.results} aria-live="polite">
        {resultsCount !== null && `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'}`}
      </p>
    </div>
  );
};
