import { Link } from "@remix-run/react";
import {
	NavigationMenu,
	NavigationMenuItem,
} from "~/components/ui/navigation-menu";

export default function UserNavigation() {
	return (
		<NavigationMenu className="p-3 px-10 z-10 text-white h-[64px] list-none justify-between bg-black min-w-[vw]">
			<NavigationMenuItem className="font-edu-vic text-xl font-bold">
				<Link to="/">FitJournal</Link>
			</NavigationMenuItem>
			<NavigationMenuItem>
				<Link to="/docs" className="p-4 m-4 rounded-lg">
					Journal
				</Link>
				<Link to="/docs" className="p-4 m-4 rounded-lg">
					Account
				</Link>
			</NavigationMenuItem>
		</NavigationMenu>
	);
}
