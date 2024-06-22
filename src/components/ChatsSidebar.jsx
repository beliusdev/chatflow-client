import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setChats } from '../state';
import { getCurrentUserChats } from '../api/chat';

import UserChat from './UserChat';
import SearchBar from './SearchBar';

export default function ChatsSidebar() {
  const dispatch = useDispatch();
  const chats = useSelector(({ chats }) => chats);
  const currentUser = useSelector(({ currentUser }) => currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      dispatch(setChats(null));
      return setIsLoading(false);
    }

    const fetchChats = async () => {
      setIsLoading(true);
      const { data } = await getCurrentUserChats();
      dispatch(setChats(data));
      setIsLoading(false);
    };

    fetchChats();
  }, [dispatch, currentUser]);

  return (
    <div className="user-chats">
      <SearchBar />
      {chats &&
        chats.map((chat) => (
          <UserChat key={chat.chatId || Math.random()} chat={chat} />
        ))}
      {isLoading && <p>Loading chats...</p>}
    </div>
  );
}
