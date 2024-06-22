import axios from "axios";

export default function http() {
  return axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: localStorage.getItem("chat-token"),
    },
  });
}
