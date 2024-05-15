import { useState } from "react";
import { Button, LogInModal } from "@components";
import { User } from "@providers";

interface LogInButtonProps {
	user: User | null;
}

export const LogInButton = ({ user }: LogInButtonProps) => {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const handleOpenLoginModal = () => {
		if (!user) {
			setIsLoginModalOpen(true);
		} else {
			window.location.reload();
		}
	};

	const handleCloseLoginModal = () => {
		setIsLoginModalOpen(false);
	};

	return (
		<>
			<Button className="w-24 h-10" onClick={handleOpenLoginModal}>
				Log In
			</Button>
			<LogInModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
		</>
	);
};
