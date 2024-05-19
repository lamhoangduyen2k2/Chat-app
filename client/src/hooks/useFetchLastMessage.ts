import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext"
import { baseUrl, getRequest } from "../utils/service";

export const useFetchLastMessage = (chat) => {
    const { newMessage, notifications} = useContext(ChatContext);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if (response.error) {
                return console.log("Error getting messages...",response.error);
            }

            const lastMessage = response[response?.length - 1];

            setLastMessage(lastMessage);
        };

        getMessages();
    }, [newMessage, notifications]);

    return { lastMessage };
}