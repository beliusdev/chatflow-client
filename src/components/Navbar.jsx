import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import { setCurrentUser, setCurrentChat, resetState } from '../state';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(({ currentUser }) => currentUser);

  const links = currentUser
    ? {
        '/profile': 'Profile',
      }
    : {
        '/': 'Home',
        '/register': 'Sign Up',
        '/login': 'Sign In',
      };

  const logout = () => {
    localStorage.removeItem('chat-token');
    dispatch(resetState());
  };

  const handleClick = () => {
    dispatch(setCurrentChat(null));
  };

  return (
    <nav className="navbar">
      {currentUser && (
        <NavLink
          to="/"
          key={'/'}
          className="navbar__link"
          onClick={handleClick}
        >
          Chats
        </NavLink>
      )}
      {Object.entries(links).map(([link, text]) => (
        <NavLink className="navbar__link" key={link} to={link}>
          {text}
        </NavLink>
      ))}
      {currentUser && (
        <>
          <NavLink
            to="/"
            key={'logout'}
            className="navbar__link"
            onClick={logout}
          >
            Log Out
          </NavLink>
        </>
      )}
    </nav>
  );
}
