import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getErrorMessage } from "../utils/helper";
import { setChats, setMessage, setSearchTerm } from "../state";

import { searchUsers } from "../api/user";
import { getCurrentUserChats } from "../api/chat";

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector(({ searchTerm }) => searchTerm);
  const currentUser = useSelector(({ currentUser }) => currentUser);

  const [debounceTimeout, setDebounceTimeout] = useState(null); // todo: check

  const handleChange = async (e) => {
    const value = e.target.value;
    dispatch(setSearchTerm(value));
    clearTimeout(debounceTimeout);

    const timeout = setTimeout(async () => {
      try {
        const { data } = !value
          ? await getCurrentUserChats()
          : await searchUsers(value);
        dispatch(setChats(data));
      } catch (error) {
        console.log(error);
        dispatch(
          setMessage({
            success: false,
            text: getErrorMessage(error),
          })
        );
      }
    }, 1000);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    if (searchTerm || !currentUser) return;

    const getUserChats = async () => {
      try {
        const { data } = await getCurrentUserChats();
        dispatch(setChats(data));
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

    getUserChats();
  }, [dispatch, currentUser]);

  useEffect(() => {
    return () => clearTimeout(debounceTimeout);
  }, [debounceTimeout]);

  return (
    currentUser && (
      <div className="user-chats__search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Username..."
        />
      </div>
    )
  );
}
