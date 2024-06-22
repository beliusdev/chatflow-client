import http from './http';

export const getCurrentUser = async () => {
  return await http().get('/user/me');
};

export const searchUsers = async (identifier) => {
  return await http().get(`/user/search?identifier=${identifier}`);
};
