import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Navbar from './Navbar';

export default function Header() {
  const navigate = useNavigate();
  const currentUser = useSelector(({ currentUser }) => currentUser);

  return (
    <div className="header">
      <Navbar />
      {currentUser && (
        <p className="header__login-p">
          Logged in as
          <span
            className="header__login-name"
            onClick={() => navigate('/profile')}
          >
            {' '}
            {currentUser.displayName}
          </span>
        </p>
      )}
    </div>
  );
}
