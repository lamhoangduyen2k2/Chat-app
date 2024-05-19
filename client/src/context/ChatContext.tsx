/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/service';
import { io, Socket } from "socket.io-client";


export const ChatContext = createContext(Object as unknown);

interface ChatContextProviderType {
    children: ReactNode;
    user: { email: string, name: string, token: string, _id: string } | null;
}

interface PotentialUserType {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

interface UserChatsType {
    _id: string;
    members: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface MessageType {
    _id: string,
    chatId: string,
    senderId: string,
    text: string,
    createdAt: Date,
    updatedAt: Date
}

export const ChatContextProvider = ({ children, user }: ChatContextProviderType): JSX.Element => {
    const [userChats, setUserChats] = useState<UserChatsType[] | null>(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState<UserChatsType | null>(null);

    const [messages, setMessages] = useState<MessageType[] | null>(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState<MessageType | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<{ userId: string, socketId: string }[]>([]);
    const [notifications, setNotifications] = useState([])
    const [allUsers, setAllUsers] = useState([])
    console.log("🚀 ~ ChatContextProvider ~ notification:", notifications)

    //Initialize socket
    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    //add online users
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res: any) => {
            setOnlineUsers(res);
        })

        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket, user])

    //send message
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members?.find((id: string) => id !== user?._id);

        socket.emit("sendMessage", { ...newMessage, recipientId });

    }, [newMessage, socket, user, currentChat])

    //receive message and notifications
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;

            setMessages((prev) => prev ? [...prev, res] : [res])
        })

        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some((id: string) => id === res.senderId);

            if (isChatOpen) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            } else {
                setNotifications((prev) => [res, ...prev]);
            }
        })

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, user, currentChat])

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`);

            if (response.error) {
                return console.log("Error fetching users", response.error);
            }

            const pChats = response.filter((u: PotentialUserType) => {
                let isChatCreated = false;

                if (u._id === user?._id) return false;

                if (userChats) {
                    isChatCreated = userChats?.some((chat: UserChatsType) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }

                return !isChatCreated;
            });

            setPotentialChats(pChats)
            setAllUsers(response);
        }

        getUsers();
    }, [userChats, user])

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                setIsUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response);
            }
        }

        getUserChats();
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            setIsMessageLoading(true);
            setMessageError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

            setIsMessageLoading(false);

            if (response.error) {
                return setMessageError(response);
            }

            setMessages(response);
        }

        getMessages();
    }, [currentChat])

    const sendTextMessage = useCallback(async (textMessage: string, sender: { email: string, name: string, token: string, _id: string }, currentChatId: string, setTexMessage: any) => {
        if (!textMessage) return console.log("You must type something...");
        const response = await postRequest(`${baseUrl}/messages`, { chatId: currentChatId, senderId: sender._id, text: textMessage });

        if (response.error) {
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => prev ? [...prev, response] : [response]);
        setTexMessage('');

    }, []);

    const updateCurrentChat = useCallback((chat: UserChatsType) => {
        setCurrentChat(chat);
    }, [])

    const createChat = useCallback(async (firstId: string, secondId: string) => {
        const response = await postRequest(`${baseUrl}/chats`, { firstId, secondId });

        if (response.error) {
            return console.log("Error creating chat", response);
        }

        setUserChats((prev) => prev ? [...prev, response] : [response])

    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((n) => {
            return { ...n, isRead: true }
        })

        setNotifications(mNotifications);
    }, [])

    const markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
        //find chat to open
        const desiredChat = userChats.find((chat) => {
            const chatMembers = [user._id, n.senderId];
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            })

            return isDesiredChat;
        });
        
        //mark notification as read
        const mNotifications = notifications.map((el) => {
            if (n.senderId === el.senderId) {
                return { ...n, isRead: true }
            } else {
                return el;
            }
        })
        updateCurrentChat(desiredChat);
        setNotifications(mNotifications);
    }, [])

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
        //mark notification as read

        const mNotifications = notifications.map((el) => {
            let notification;

            thisUserNotifications.forEach((n) => {
                if (n.senderId === el.senderId) {
                    notification = { ...n, isRead: true }
                } else {
                    notification = el;
                }
            })

            return notification;
        })

        setNotifications(mNotifications);
    }, [])

    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessageLoading,
        messageError,
        sendTextMessage,
        sendTextMessageError,
        newMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead
    }}>{children}</ChatContext.Provider>
}