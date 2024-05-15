import { useState } from "react";
import { AccountRegisterModal, Button } from "@components";
import { User } from "@providers";

interface RegisterButtonProps {
	user: User | null;
}

export const RegisterButton = ({ user }: RegisterButtonProps) => {
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

	const handleOpenRegisterModal = () => {
		if (!user) {
			setIsRegisterModalOpen(true);
		} else {
			window.location.reload();
		}
	};

	const handleCloseRegisterModal = () => {
		setIsRegisterModalOpen(false);
	};

	return (
		<>
			<Button className="w-24 h-10" onClick={handleOpenRegisterModal}>
				Register
			</Button>
			<AccountRegisterModal
				isOpen={isRegisterModalOpen}
				onClose={handleCloseRegisterModal}
			/>
		</>
	);
};
