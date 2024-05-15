"use client";

import { MouseEvent, useState } from "react";
import { Button } from "@components/Button/Button";
import { User } from "@providers";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/ExitToApp";

interface UserButtonProps {
	user: User | null;
	logout: () => void;
}

export const UserButton = ({ user, logout }: UserButtonProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		// TODO: Need to fix the dropdown spawn to fit the screen
		<div>
			<Button
				id="user-button"
				className="user-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				sx={{
					color: "black",
					backgroundColor: "#FFA5A5",
					"&:hover": {
						backgroundColor: "#cc8484",
						border: "none",
					},
				}}
			>
				{user ? user.username : "Account"}
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "user-button",
				}}
			>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutIcon fontSize="small" />
					</ListItemIcon>
					Log Out
				</MenuItem>
			</Menu>
		</div>
	);
};
