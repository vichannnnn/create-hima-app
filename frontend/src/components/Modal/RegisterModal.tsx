"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	ErrorText,
	Modal,
	PasswordField,
	PasswordValidation,
	TextField,
} from "@components";
import { AuthContext } from "@providers";
import { RegisterValidation } from "@utils";
import { FormControl, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { RegisterDetails } from "@api/auth";

interface AccountRegisterFormProps {
	onRegisterSuccess: () => void;
	onRegisterFailure: (errorMessage: string | null) => void;
}

interface AccountRegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const AccountRegisterForm = ({
	onRegisterSuccess,
	onRegisterFailure,
}: AccountRegisterFormProps) => {
	const { registerUserAccount } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterDetails>({
		resolver: yupResolver(RegisterValidation),
	});

	const handleRegister = async (formData: RegisterDetails) => {
		try {
			onRegisterFailure(null);
			await registerUserAccount(formData);
			onRegisterSuccess();
			// TODO: We need a toast when account is successfully created to inform users that they have to verify email
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An error occurred during login.";
			onRegisterFailure(errorMessage);
		}
	};

	return (
		<form id="account-register-form" onSubmit={handleSubmit(handleRegister)}>
			<Stack direction="column" spacing={3}>
				<FormControl id="username">
					<TextField
						type="text"
						label="Username"
						error={Boolean(errors.username)}
						helperText={errors.username?.message}
						{...register("username")}
						required
					/>
				</FormControl>
				<FormControl id="email">
					<TextField
						type="email"
						label="Email Address"
						error={Boolean(errors.email)}
						helperText={errors.email?.message}
						{...register("email")}
						required
					/>
				</FormControl>
				<FormControl id="password">
					<PasswordField
						label="Password"
						error={Boolean(errors.password)}
						helperText={errors.password?.message}
						{...register("password")}
						required
					/>
				</FormControl>
				<FormControl id="repeat-password">
					<PasswordField
						label="Repeat Password"
						error={Boolean(errors.repeat_password)}
						helperText={errors.repeat_password?.message}
						{...register("repeat_password")}
						required
					/>
				</FormControl>
				<PasswordValidation
					password={watch("password")}
					repeatPassword={watch("repeat_password")}
				/>
			</Stack>
		</form>
	);
};

export const AccountRegisterModal = ({
	isOpen,
	onClose,
}: AccountRegisterModalProps) => {
	const [registerError, setRegisterError] = useState<string | null>(null);

	const handleRegisterFailure = (errorMessage: string | null) => {
		setRegisterError(errorMessage);
	};

	const handleClose = () => {
		setRegisterError(null);
		onClose();
	};

	return (
		<Modal
			sx={{ backgroundColor: "#222222" }}
			open={isOpen}
			onClose={handleClose}
		>
			<div className="relative">
				<div className="mt-4">
					<button className="absolute top-0 right-0" onClick={handleClose}>
						<CloseIcon />
					</button>
					<Image
						src="https://image.himaa.me/hima-chan-posing.png"
						alt="Hima!"
						height="64"
						width="64"
					/>
				</div>
				<h1 className="flex justify-center mb-4 mt-4 text-xl">
					Account Registration
				</h1>
				<AccountRegisterForm
					onRegisterSuccess={handleClose}
					onRegisterFailure={handleRegisterFailure}
				/>
				<div className="flex flex-col justify-center mt-6 gap-3 w-full">
					{registerError && <ErrorText>{registerError}</ErrorText>}
					<Button
						className="w-full"
						// TODO: We should probably set this in the MUI custom palette (sure but ideally not) for this Tori Pink
						//  TODO: color or in our Tailwind custom class (best option).
						// TODO: We need to solve the issue of MUI default color overriding Tailwind custom class as well.
						sx={{
							color: "black",
							backgroundColor: "#FFA5A5",
							"&:hover": {
								backgroundColor: "#cc8484",
								border: "none",
							},
						}}
						form="account-register-form"
						type="submit"
					>
						Sign Up
					</Button>
				</div>
				<p className="mt-3">Already have an account? Login here.</p>
			</div>
		</Modal>
	);
};
