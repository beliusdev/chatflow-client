import * as Yup from 'yup';
import { Form, Formik, Field, ErrorMessage } from 'formik';

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../api/auth';
import { getErrorMessage } from '../utils/helper';
import { setCurrentUser, setMessage } from '../state';

const initialValues = {
  identifier: '',
  password: '',
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const { data } = await login(values);
      dispatch(setCurrentUser(data.user));
      localStorage.setItem('chat-token', `Bearer ${data.token}`);
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

  const validationSchema = Yup.object({
    identifier: Yup.string().required('Email or username is required.'),
    password: Yup.string().required('Password is required.'),
  });

  useEffect(() => {
    const token = localStorage.getItem('chat-token');
    if (token) navigate('/');
  });

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
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Email address or username"
            />
            <ErrorMessage
              className="form__error-message"
              name="identifier"
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
          <button
            type="submit"
            className="form__button"
            disabled={Boolean(Object.entries(errors).length)}
          >
            {isLoading ? 'Logging In...' : 'Sign In'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
