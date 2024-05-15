import Link from "next/link";
import Image from "next/image";
import { Button } from "@components";

const NotFound = () => {
	return (
		<>
			<div className="w-4/5 flex flex-col mx-auto items-center text-center">
				<h1 className="mt-4 mb-4">Whoopsie!</h1>
				<h1 className="mt-4 mb-4">404 - Page Not Found</h1>
				<div className="flex flex-col items-center">
					<p className="text-xl mt-1 mb-1">
						You shouldn&apos;t be here! The page or whatever content you&apos;re
						trying to look for probably doesn&apos;t exist here.. yet.
					</p>
					<p>
						But I guess you can enjoy a picture of me posing here in the
						meantime!
					</p>
					<div className="w-[640px]">
						<Image
							src="https://image.himaa.me/hima-chan-posing.png"
							alt="Hima!"
							width="512"
							height="512"
						/>
					</div>
				</div>
				<Link href="/" passHref>
					<Button>Back to home</Button>
				</Link>
			</div>
		</>
	);
};

export default NotFound;
