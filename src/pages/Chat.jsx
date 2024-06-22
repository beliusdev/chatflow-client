import moment from 'moment';
import io from 'socket.io-client';

import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Hero from './Hero';

import { getErrorMessage } from '../utils/helper';
import { setCurrentChat, setMessage } from '../state';
import { fetchChatMessages, getChat, sendMessage } from '../api/chat';

export default function Chat() {
  const scroll = useRef();

  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(({ currentUser }) => currentUser);
  const currentChat = useSelector(({ currentChat }) => currentChat);
  const isLoggedIn = Boolean(currentUser);

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [textMessage, setTextMessage] = useState('');

  const recipientId = currentChat?.members?.find((id) => id !== currentUser.id);
  const recipientName = currentChat?.names?.find(
    (name) => name !== currentUser.displayName,
  );

  const handleChange = async (e) => {
    const value = e.target.value;
    setTextMessage(value);
    socket.emit('typing', { recipientId });
  };

  const sendTextMessage = async (e) => {
    e.preventDefault();
    if (socket === null || !currentChat) return;

    const response = await sendMessage({
      recipientId,
      chatId: currentChat?.id,
      senderId: currentUser?.id,
      text: textMessage,
    });
    const data = response.data;

    if (response?.error) {
      // todo
    }

    socket.emit('sendMessage', {
      recipientId,
      text: textMessage,
      senderId: currentUser.id,
    });
    setMessages((prev) => [...prev, data]);
    setTextMessage('');
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, textMessage]);

  // Connect to socket server
  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit('addNewUser', currentUser?.id);
    socket.on('getOnlineUsers', (res) => {
      // todo: setOnlineUsers(res);
    });

    return () => {
      socket.off('getOnlineUsers');
    };
  }, [socket]);

  // Typing...
  useEffect(() => {
    if (socket === null || !currentChat) return;

    socket.on('typing', () => setIsTyping(true));
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => {
      socket.off('typing');
      clearTimeout(timeout);
    };
  }, [currentChat, isTyping]);

  // Receive messages and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on('getMessage', (res) => {
      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off('getMessage');
    };
  }, [socket]);

  // Get Chats and Messages
  useEffect(() => {
    if (!id) setIsLoading(false);

    setIsLoading(true);
    try {
      const getChatInfo = async () => {
        const { data: chatData } = await getChat(id);
        dispatch(setCurrentChat({ ...chatData }));
      };

      getChatInfo();
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
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentChat || !id) return;

    try {
      const getMessages = async () => {
        const { data: messagesData } = await fetchChatMessages(id);
        setMessages(messagesData);
      };

      getMessages();
    } catch (error) {
      console.log(error);
      dispatch(
        setMessage({
          success: false,
          text: getErrorMessage(error),
        }),
      );
    }
  }, [currentChat]);

  const form = (
    <form
      ref={scroll}
      className="form form--inline-button"
      onSubmit={(e) => sendTextMessage(e)}
    >
      <div className="form__group">
        <input
          type="text"
          className="form__input"
          placeholder="Type in a message..."
          value={textMessage}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Send</button>
    </form>
  );

  if (!isLoggedIn) return <Hero />;
  if (isLoading) return <p>Loading messages...</p>; // todo: make this work
  if (!currentChat) return <p>No chat selected.</p>;
  return (
    <>
      <p className="messages__recipient-status">
        {isTyping ? `${recipientName} is typing...` : recipientName}
      </p>
      <div className="messages">
        {messages?.length ? (
          messages.map((message) => (
            <p
              key={message.id}
              className={`message ${message.senderId !== recipientId ? 'message--sender' : ''}`}
            >
              {message.text}
              <span className="message__date">
                {moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </span>
            </p>
          ))
        ) : (
          <p>No messages.</p>
        )}
        {form}
      </div>
    </>
  );
}
