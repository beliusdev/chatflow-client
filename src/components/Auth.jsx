import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getCurrentUser } from '../api/user';
import { getErrorMessage } from '../utils/helper';
import { setCurrentUser, setMessage } from '../state';

export default function Auth({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('chat-token'); // todo
  const currentUser = useSelector(({ currentUser }) => currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname;
    const isVerificationRoute = path.startsWith('/verification');
    if (currentUser && !currentUser.isVerified && !isVerificationRoute) {
      navigate('/verification');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const auth = async () => {
      if (!jwtToken || (jwtToken && currentUser)) return setIsLoading(false);
      if (jwtToken && !currentUser) {
        try {
          setIsLoading(true);
          const { data } = await getCurrentUser();
          dispatch(setCurrentUser(data));
        } catch (error) {
          console.log(error);
          localStorage.removeItem('chat-token');
          dispatch(
            setMessage({
              success: false,
              text: getErrorMessage(error),
            }),
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    auth();
  }, [jwtToken, currentUser]);

  return <div>{!isLoading && children}</div>;
}
