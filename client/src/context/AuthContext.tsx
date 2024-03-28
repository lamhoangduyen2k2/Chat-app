
import React, { createContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { baseUrl, postRequest } from '../utils/service';

export const AuthContext = createContext(Object as unknown);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const user = localStorage.getItem("User");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, [])

    const updateRegisterInfo = useCallback((info: { name: string, email: string, password: string }) => {
        setRegisterInfo(info);
    }, [])

    const updateLoginInfo = useCallback((info: { email: string, password: string }) => {
        setLoginInfo(info);
    }, [])

    const registerUser = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        setIsRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, registerInfo);

        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response);
        }

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo])

    const loginUser = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            setIsLoginLoading(true);
            setLoginError(null);

            const response = await postRequest(`${baseUrl}/users/login`, loginInfo);

            setIsLoginLoading(false);

            if (response.error) {
                return setLoginError(response);
            }

            localStorage.setItem("User", JSON.stringify(response));
            setUser(response);
        }, [loginInfo])

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            registerInfo,
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            loginUser,
            loginError,
            loginInfo,
            updateLoginInfo,
            isLoginLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}
