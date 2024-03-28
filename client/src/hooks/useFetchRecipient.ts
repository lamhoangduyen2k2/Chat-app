/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/service";

interface RecipientType {
  recipientUser: {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export const useFetchRecipientUser = (
  chat: { _id: string; members: string[]; createdAt: Date; updatedAt: Date },
  user: { email: string; name: string; token: string; _id: string }
) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response.error) {
        return setError(response);
      }

      setRecipientUser(response);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser } as RecipientType;
};
