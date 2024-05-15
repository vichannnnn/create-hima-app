import Image from "next/image";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="w-3/4 flex flex-col items-center text-center mx-auto mb-9">
				<Image
					src="https://image.himaa.me/hima-chan-posing.png"
					alt="Hima!"
					width="225"
					height="225"
					loading="lazy"
				/>
				<div>
					<h1>Create Hima App</h1>
					<p className="w-3/4 text-center mx-auto mb-6 text-2xl">
						This is a boilerplate for the Frontend of Hima App.
					</p>
				</div>
			</div>
		</main>
	);
}
