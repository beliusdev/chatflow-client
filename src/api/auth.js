import http from './http';

export const register = async (values) => {
  return await http().post('/auth', values);
};

export const login = async (values) => {
  return await http().post('/auth/login', values);
};

export const checkUsernameAvailability = async (value) => {
  return await http().post('/auth/check-username-availability', {
    username: value,
  });
};

export const checkEmailAvailability = async (value) => {
  return await http().post('/auth/check-email-availability', { email: value });
};

export const verifyEmail = async (token) => {
  return await http().patch(`/auth/verify/${token}`);
};

export const resendEmailVerificationToken = async () => {
  return await http().get('/auth/resend');
};
