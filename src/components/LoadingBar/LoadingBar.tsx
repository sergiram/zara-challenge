import styles from './LoadingBar.module.scss';

interface LoadingBarProps {
  label?: string;
}

export const LoadingBar = ({ label = 'Cargando' }: LoadingBarProps) => {
  return <div className={styles.bar} role="progressbar" aria-label={label} />;
};
