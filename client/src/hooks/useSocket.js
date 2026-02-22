import { useEffect, useState } from "react";
import { creatSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const useSocket = (targetUserId) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useSelector((state) => state.user.user);
    const userID = user?._id;

    
   
    

    // 1. Initialize Socket
    useEffect(() => {
        if (!userID) return;

        const newSocket = creatSocketConnection();

        // newSocket.on("connect", () => {
        //     console.log("Socket Connected!", newSocket.id);
        // });

        // newSocket.on("connect_error", (err) => {
        //     console.log("Socket Connection Error:", err);
        // });

        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [userID]);

    // 2. Setup Global Listeners (Online Status)
    useEffect(() => {
        if (!socket) return;

        const handleOnlineUsers = (data) => {
            const onlineUsersList = Array.isArray(data)
                ? data.filter((x) => userID !== x)
                : [];
            setOnlineUsers(onlineUsersList);
        };

        const handleUserStatusChange = (data) => {
            const { userId: changedUserId, isOnline } = data;
            setOnlineUsers((prev) => {
                if (isOnline) {
                    return prev.includes(changedUserId) ? prev : [...prev, changedUserId];
                } else {
                    return prev.filter((id) => id !== changedUserId);
                }
            });
        };

        socket.on("getAllOnlineUsersID", handleOnlineUsers);
        socket.on("user_status_changed", handleUserStatusChange);

        return () => {
            socket.off("getAllOnlineUsersID", handleOnlineUsers);
            socket.off("user_status_changed", handleUserStatusChange);
        };
    }, [socket, userID]);

    // 3. Handle Room Joining
    useEffect(() => {
        if (socket && targetUserId && userID) {
            socket.emit("joinChat", { userID, RecieveruserId: targetUserId });
        }
    }, [socket, targetUserId, userID]);

    return { socket, onlineUsers };
};

export default useSocket;
