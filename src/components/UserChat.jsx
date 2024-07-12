import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getErrorMessage } from "../utils/helper";

import { createChat } from "../api/chat";
import { setChats, setMessage, setSearchTerm } from "../state";

export default function UserChat({ chat }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector(({ chats }) => chats);
  const {
    senderName,
    username,
    displayName,
    senderUsername,
    createdAt,
    chatId,
  } = chat;

  const handleClick = async () => {
    if (chatId) return navigate(`/chat/${chatId}`);

    try {
      const { data } = await createChat(chat.id);
      console.log("DATA", data); // todo
      const existingChat = chats.find((chat) => chat.id === data.id);
      if (existingChat) return;
      navigate(`/chat/${data.id}`);
      dispatch(setSearchTerm(""));
    } catch (error) {
      console.log(error);
      dispatch(
        setMessage({
          success: false,
          text: getErrorMessage(error),
        })
      );
    }
  };

  return (
    <div className="user-chat" onClick={handleClick}>
      <h5 className="user-chat__display-name">{senderName || displayName}</h5>
      <p className="user-chat__username">
        {username ? <>@{username}</> : <>@{senderUsername}</>}
      </p>
      {/* // todo: last message */}
    </div>
  );
}
