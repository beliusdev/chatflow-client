import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { createChat } from '../api/chat';
import { setChats, setSearchTerm } from '../state';

export default function UserChat({ chat }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector(({ chats }) => chats);
  const { senderName, username, displayName, lastMessage, createdAt, chatId } =
    chat;

  const handleClick = async () => {
    if (chatId) return navigate(`/chat/${chatId}`);

    try {
      const { data } = await createChat(chat.id);
      dispatch(setChats([...chats, data]));
      navigate(`/chat/${data.id}`);
      dispatch(setSearchTerm(''));
    } catch (error) {
      console.log(error);
      dispatch(
        setMessage({
          success: false,
          text: getErrorMessage(error),
        }),
      );
    }
  };

  return (
    <div className="user-chat" onClick={handleClick}>
      <h5 className="user-chat__display-name">{senderName || displayName}</h5>
      <p className="user-chat__username">{username && <>@{username}</>}</p>
      {/* // todo: last message */}
    </div>
  );
}
