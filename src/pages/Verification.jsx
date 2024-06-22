import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { getErrorMessage } from '../utils/helper';
import { setCurrentUser, setMessage } from '../state';
import { verifyEmail, resendEmailVerificationToken } from '../api/auth';

export default function Verification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector(({ currentUser }) => currentUser);

  useEffect(() => {
    if (currentUser.isVerified) navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        setIsLoading(true);
        const { data } = await verifyEmail(token);

        dispatch(
          setMessage({
            success: true,
            text: 'Email address was successfully verified.',
          }),
        );
        dispatch(setCurrentUser(data));

        navigate('/');
      } catch (error) {
        console.log(error);
        dispatch(
          setMessage({
            success: false,
            text: getErrorMessage(error),
          }),
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, dispatch, currentUser]);

  const resend = async () => {
    try {
      setIsLoading(true);
      const { data } = await resendEmailVerificationToken();
      if (data.success) {
        dispatch(
          setMessage({
            success: true,
            text: 'Verification link was successfully sent to your email address.',
          }),
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        setMessage({
          success: false,
          text: getErrorMessage(error),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    !currentUser?.isVerified && (
      <div>
        <p>Please verify your email address</p>
        <button onClick={resend} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Resend Verification Link'}
        </button>
      </div>
    )
  );
}
