"use client";

import { useEffect, useState } from "react";
import { Icon } from "@mui/material";
import { Check } from "@mui/icons-material";

interface PasswordValidationBoxProps {
	password: string;
	repeatPassword: string;
}

export const PasswordValidation = ({
	password,
	repeatPassword,
}: PasswordValidationBoxProps) => {
	const [lengthValid, setLengthValid] = useState(false);
	const [specialCharValid, setSpecialCharValid] = useState(false);
	const [capitalLetterValid, setCapitalLetterValid] = useState(false);
	const [repeatPasswordValid, setRepeatPasswordValid] = useState(false);

	useEffect(() => {
		setLengthValid(password?.length <= 30 && password?.length >= 8);
		setSpecialCharValid(/[!@#$%^&*]/.test(password || ""));
		setCapitalLetterValid(/[A-Z]/.test(password || ""));
		setRepeatPasswordValid(
			!!(password && repeatPassword && password === repeatPassword),
		);
	}, [password, repeatPassword]);

	const renderValidationMessage = (valid: boolean, message: string) => (
		<div className="flex text-left space-x-1">
			<Icon component={Check} sx={{ color: valid ? "#43d87a" : "#444444" }} />
			<div>{message}</div>
		</div>
	);

	return (
		<div className="flex-col items-start">
			<p>
				{renderValidationMessage(lengthValid, "Between 8 and 30 characters")}
			</p>
			<p>
				{renderValidationMessage(
					specialCharValid,
					"Contains at least one special character",
				)}
			</p>
			<p>
				{" "}
				{renderValidationMessage(
					capitalLetterValid,
					"Contains at least one capital letter",
				)}
			</p>
			<p> {renderValidationMessage(repeatPasswordValid, "Passwords match")}</p>
		</div>
	);
};
