import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div>
      <h1>404</h1>
      <p>NotFoundPage</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};
