import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you are looking for does not exist.</p>
      <Link to="/" className={styles.link}>
        Back to home
      </Link>
    </div>
  );
};
