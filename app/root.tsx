import {
	Links,
	Meta,
	MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";

export const meta: MetaFunction = () => {
	return [
		{ title: "Gym Journal" },
		{ name: "description", content: "Journal your workouts with ease!" },
	];
};

export function links() {
	return [
		{ rel: "stylesheet", href: stylesheet },
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com",
		},
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Edu+VIC+WA+NT+Beginner:wght@400..700&display=swap",
		},
	];
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body
				className="bg-background min-h-[100vh] min-w-screen bg-gradient-to-bl from-sky-950
       to-zinc-500">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
