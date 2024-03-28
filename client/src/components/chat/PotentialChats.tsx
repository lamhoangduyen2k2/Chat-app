/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

interface PotentialChatsType {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ChatContextType {
    potentialChats: PotentialChatsType[] | [];
    createChat: (firstId: string, secondId: string) => void;
    onlineUsers: { userId: string, socketId: string }[] | [];
}

const PotentialChats = () => {
    const { user } = useContext(AuthContext) as { user: { email: string, name: string, token: string, _id: string } };
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext) as ChatContextType;
    return (
        <>
            <div className="all-users">
                {potentialChats && potentialChats.map((u: PotentialChatsType, index: number) => {
                    return (
                        <div
                            className="single-user"
                            key={index}
                            onClick={() => createChat(user._id, u._id)}>
                            {u.name}
                            <span className={onlineUsers.some((onUser: any) => onUser?.userId === u?._id)
                                ? "user-online"
                                : ""}></span>
                        </div>
                    )
                })}
            </div >
        </>
    );
}

export default PotentialChats;