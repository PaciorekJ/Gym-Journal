import { Outlet } from "@remix-run/react";
import UserNavigation from "~/components/UserNavigation";

export default function User() {
	return (
		<>
			<UserNavigation></UserNavigation>
			<Outlet />
		</>
	);
}
