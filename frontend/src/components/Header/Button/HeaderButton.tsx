"use client";

import { useContext } from "react";
import { AuthContext } from "@providers";
import { LogInButton } from "@components/Header/Button/LoginButton";
import { RegisterButton } from "@components/Header/Button/RegisterButton";
import { UserButton } from "./UserButton";

export const HeaderButton = () => {
	const { user, logout } = useContext(AuthContext);

	return (
		<>
			{!user && (
				<div>
					<LogInButton user={user} />
					<RegisterButton user={user} />
				</div>
			)}

			{user && <UserButton user={user} logout={logout} />}
		</>
	);
};
