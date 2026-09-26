import styles from './LoadingBar.module.scss';

export const LoadingBar = () => {
  return <div className={styles.bar} role="progressbar" aria-label="Cargando productos" />;
};
