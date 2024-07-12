import axios from "axios";

export default function http() {
  return axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      Authorization: localStorage.getItem("chat-token"),
    },
  });
}
