import { ReactNode } from "react";
import { RegisterDetails } from "@components/Modal/RegisterModal";

export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (loginDetails: LogInDetails) => Promise<void>;
	logout: () => void;
	registerUserAccount: (formData: RegisterDetails) => Promise<number>;
}

export interface LogInDetails {
	username: string;
	password: string;
}

export interface AuthProviderProps {
	children: ReactNode;
}

export interface User {
	user_id: number;
	username: string;
}

export interface CurrentUserWithJWT {
	data: User;
	access_token: string;
	token_type: string;
	exp: number;
}
