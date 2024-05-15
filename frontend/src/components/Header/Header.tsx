import Link from "next/link";
import Image from "next/image";
import { HeaderButton } from "./Button/HeaderButton";

export const Header = () => {
	return (
		<header className="w-3/4 mx-auto bg-transparent justify-between items-center">
			<div className="pt-6 pb-6 flex justify-between items-center gap-4">
				<Link className="md:w-16 md:h-16" href="/">
					<Image
						src="https://image.himaa.me/hima-chan-original.png"
						alt="Hima!"
						height="128"
						width="128"
					/>
				</Link>
				<HeaderButton />
			</div>
		</header>
	);
};
