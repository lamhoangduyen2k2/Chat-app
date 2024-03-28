import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg"
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

interface UserChatType {
    chat: { _id: string, members: string[], createdAt: Date, updatedAt: Date };
    user: { email: string, name: string, token: string, _id: string };
}

interface ChatContextType {
    onlineUsers: { userId: string, socketId: string }[] | [];
}

interface UserOnlineType {
    userId: string;
    socketId: string;
}

const UserChat = ({ chat, user }: UserChatType) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext) as ChatContextType;

    const isOnline = onlineUsers?.some((u: UserOnlineType) => u?.userId === recipientUser?._id)
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button">
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} height="35px" />
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">Text Message</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    12/12/2024
                </div>
                <div className="this-user-notifications">2</div>
                <span className={ isOnline ? "user-online" : ""}></span>
            </div>
        </Stack>);
}

export default UserChat;