import http from './http';

export const getCurrentUserChats = async () => {
  return await http().get('/chat');
};

export const createChat = async (secondUserId) => {
  return await http().post(`/chat/${secondUserId}`);
};

export const getChat = async (chatId) => {
  return await http().get(`/chat/${chatId}`);
};

export const fetchChatMessages = async (chatId) => {
  return await http().get(`/message/${chatId}`);
};

export const sendMessage = async (data) => {
  return await http().post('/message', data);
};
