"use client";

import {createContext, useCallback, useEffect, useMemo, useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import {getUser, login as logInAPI, register as registerAPI} from "@api/auth";
import {AuthContextType, AuthProviderProps, LogInDetails, RegisterDetails, User} from "@providers";

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {
    },
    logout: () => {
    },
    registerUserAccount: async () => 0,
});


export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser();
            setUser(data);
        };

        fetchUser();
    }, []);

    const login = useCallback(async (formData: LogInDetails) => {
        const user = await logInAPI(formData);
        setUser(user);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const registerUserAccount = useCallback(
        async (accountDetails: RegisterDetails): Promise<number> => {
            try {
                const response: AxiosResponse = await registerAPI(accountDetails);
                const user: User = response.data;
                setUser(user);
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
            login,
            logout,
            registerUserAccount,
        }),
        [user, login, logout, registerUserAccount],
    );

    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
};
