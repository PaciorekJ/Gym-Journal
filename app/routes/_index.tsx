import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { useState } from "react";
import { ZodError } from "zod";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import prisma from "~/database.server";
import Validator, { IUserCredentials } from "~/lib/validation";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const action = formData.get("action")?.toString();
	const email = formData.get("email")?.toString() || null;

  
	if (!email || (action !== "register" && action !== "login")) {
		throw new Response("Invalid action and email required", { status: 400 });
	}

	try {
		Validator.userCredentials.parse({ email });
	} catch (error) {
		const ZodError = error as ZodError<IUserCredentials>;
		return json({ error: ZodError.errors[0].message });
	}

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (action === "register") {
		if (user) {
			return json({ error: "User already exists" });
		}
		const { id } = await prisma.user.create({ data: { email } });
		return redirect(`/user/${id}`);
	}

	return !user
		? json({ error: "User does not exist" })
		: redirect(`/user/${user.id}`);
}

export default function Index() {
	const [email, setEmail] = useState("");
	const actionData = useActionData<typeof action>();

	return (
		<div className="flex items-center justify-center min-h-screen">
			{actionData?.error && (
				<p className="text-red-400 font-bold absolute">{actionData.error}</p>
			)}
			<Card className="flex flex-col bg-blue-700/20 p-2 w-1/2 min-w-[350px] max-w-[900px] h-1/2 shadow-2xl">
				<CardHeader className="text-center m-10">
					<CardTitle className="text-7xl font-edu-vic text-white">
						Welcome to FitJournal
					</CardTitle>
					<CardDescription className="text-white/80 text-xl">
						Sign in or login with just an email to get started
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" className="flex flex-col gap-4">
						<Input
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="w-full shadow-lg text-xl text-white bg-black h-[64px]"
						/>
						<div className="flex flex-col gap-4">
							<Button
								className="w-full p-6 text-lg bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95"
								type="submit"
								name="action"
								value="login">
								Login
							</Button>
							<Button
								className="w-full p-6 text-lg"
								type="submit"
								name="action"
								value="register">
								Register
							</Button>
						</div>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
