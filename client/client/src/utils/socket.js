import io from "socket.io-client";
import { BASE_API } from "./constants";
import Cookies from "js-cookie";

export const creatSocketConnection = () => {
  const token = Cookies.get("token");
  console.log("token:", token);
  return io("/", {
    path: "/api/socket.io",
    auth: {
      token: token,
    },
  });
};
