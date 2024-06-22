import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Form, Formik, Field } from 'formik';

import {
  checkEmailAvailability,
  checkUsernameAvailability,
  register,
} from '../api/auth';
import { setCurrentUser, setMessage } from '../state';
import { getErrorMessage } from '../utils/helper';

const initialValues = {
  displayName: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
};

export default function Register() {
  const dispatch = useDispatch();
  const usernameErrorMessage = 'Username is already used.';
  const emailErrorMessage = 'Email address is already used.';
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const { data } = await register(values);
      localStorage.setItem('chat-token', `Bearer ${data.token}`);
      dispatch(setCurrentUser(data.user));
      dispatch(
        setMessage({
          success: true,
          text: 'Email verification link was sent to your email address.',
        }),
      );
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      dispatch(
        setMessage({
          success: false,
          text: getErrorMessage(error),
        }),
      );
    }
  };

  const checkUsername = async (value) => {
    const isAvailable = await checkUsernameAvailability(value);
    if (isAvailable.data) return false;
    else return true;
  };

  const checkEmail = async (value) => {
    const isAvailable = await checkEmailAvailability(value);
    if (isAvailable.data) return false;
    else return true;
  };

  const validationSchema = Yup.object({
    displayName: Yup.string()
      .required('Display name is required.')
      .min(2, 'Display name must be at least 2 characters.'),
    username: Yup.string()
      .required('Username is required.')
      .min(2, 'Username must be at least 2 characters.')
      .test('check-username-availability', usernameErrorMessage, checkUsername),
    email: Yup.string()
      .required('Email address is required.')
      .email('Invalid email address.')
      .test('check-email-availability', emailErrorMessage, checkEmail),
    password: Yup.string()
      .min(6, 'Password must contain at least 6 characters.')
      .required('Password is required.'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match.')
      .required('Confirm password.'),
  });

  useEffect(() => {
    const token = localStorage.getItem('chat-token');
    if (token) navigate('/');
  });

  const navigate = useNavigate();
  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ errors }) => (
        <Form className="form">
          <div className="form__group">
            <Field
              className="form__field"
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Display Name"
            />
            <ErrorMessage
              className="form__error-message"
              name="displayName"
              component="div"
            />
          </div>
          <div className="form__group">
            <Field
              className="form__field"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
            />
            <ErrorMessage
              className="form__error-message"
              name="username"
              component="div"
            />
          </div>
          <div className="form__group">
            <Field
              className="form__field"
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
            />
            <ErrorMessage
              className="form__error-message"
              name="email"
              component="div"
            />
          </div>
          <div className="form__group">
            <Field
              className="form__field"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <ErrorMessage
              className="form__error-message"
              name="password"
              component="div"
            />
          </div>
          <div className="form__group">
            <Field
              className="form__field"
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
            />
            <ErrorMessage
              className="form__error-message"
              name="confirm_password"
              component="div"
            />
          </div>
          <button
            type="submit"
            className="form__button"
            disabled={Boolean(Object.entries(errors).length)}
          >
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
