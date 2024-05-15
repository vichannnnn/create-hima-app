"use client";

import {createContext, useCallback, useEffect, useMemo, useState,} from "react";
import jwt_decode from "jwt-decode";
import {AxiosError, AxiosResponse} from "axios";
import {login as logInAPI, register as registerAPI, RegisterDetails} from "@api/auth";
import {AuthContextType, AuthProviderProps, LogInDetails, User,} from "@providers";

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => {
    },
    logout: () => {
    },
    registerUserAccount: async () => 0,
});

interface CurrentUserWithJWT {
    data: User;
    access_token: string;
    token_type: string;
    exp: number;
}

interface DecodedToken {
    exp: number;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const token = localStorage.getItem("access_token");
            if (token) {
                const decodedToken = jwt_decode<DecodedToken>(token);
                const currentTime = Date.now() / 1000;
                const remainingTime = decodedToken.exp - currentTime;
                if (remainingTime < 0) {
                    logout();
                }
            }
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (formData: LogInDetails) => {
        const {data, access_token} = await logInAPI(formData);
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("access_token", access_token);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
    }, []);

    const registerUserAccount = useCallback(
        async (accountDetails: RegisterDetails): Promise<number> => {
            try {
                const response: AxiosResponse = await registerAPI(accountDetails);
                const user: CurrentUserWithJWT = response.data;
                setUser(user.data);
                debugger;
                localStorage.setItem('user', JSON.stringify(user.data));
                localStorage.setItem('access_token', user.access_token);
                return response.status;
            } catch (error) {
                throw error as AxiosError;
            }
        },
        [],
    );

    const providerValue = useMemo(
        () => ({
            user,
            isLoading,
            login,
            logout,
            registerUserAccount,
        }),
        [user, isLoading, login, logout, registerUserAccount],
    );

    return (
        <AuthContext.Provider value={providerValue}>
            {!isLoading ? children : "Loading..."}
        </AuthContext.Provider>
    );
};
