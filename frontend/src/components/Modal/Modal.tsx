import { useContext } from "react";
import { MediaQueryContext } from "@providers";
import {
	Box,
	Modal as BaseModal,
	ModalProps as BaseModalProps,
	SxProps,
	Theme,
} from "@mui/material";

interface ModalProps extends BaseModalProps {
	onClose: () => void;
	sx?: SxProps<Theme>;
}

export const Modal = ({ onClose, sx, ...props }: ModalProps) => {
	const { isDesktop } = useContext(MediaQueryContext);

	return (
		<BaseModal onClose={onClose} {...props}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: isDesktop ? "25%" : "75%",
					borderRadius: "12px",
					boxShadow: 24,
					p: 4,
					paddingTop: "12px",
					...sx,
				}}
			>
				{props.children}
			</Box>
		</BaseModal>
	);
};
