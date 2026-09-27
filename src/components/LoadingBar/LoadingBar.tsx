import styles from './LoadingBar.module.scss';

interface LoadingBarProps {
  label?: string;
}

export const LoadingBar = ({ label = 'Loading' }: LoadingBarProps) => {
  return <div className={styles.bar} role="progressbar" aria-label={label} />;
};
