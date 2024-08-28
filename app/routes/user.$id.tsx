import { LoaderFunctionArgs } from "@remix-run/node";
import {
	json,
	Link,
	Outlet,
	useLoaderData,
	useLocation,
} from "@remix-run/react";
import { ChartPie, Dumbbell, Home, Settings } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

const navItems = [
	{
		to: (id: string) => `/user/${id}`,
		icon: Home,
		label: "Dashboard",
		tooltip: "Dashboard",
	},
	{
		to: (id: string) => `/user/${id}/workout-log`,
		icon: Dumbbell,
		label: "Workout Log",
		tooltip: "Workout Log",
	},
	{
		to: (id: string) => `/user/${id}/analytics`,
		icon: ChartPie,
		label: "Progress & Analytics",
		tooltip: "Progress & Analytics",
	},
	{
		to: (id: string) => `/user/${id}/settings`,
		icon: Settings,
		label: "Settings",
		tooltip: "Settings",
		isFooter: true,
	},
];

export function loader({ params }: LoaderFunctionArgs) {
	const userId = params.id;

	if (!userId) {
		throw new Response("User Not Found", { status: 404 });
	}
	return json({ userId: params.id });
}

export default function UserDashboard() {
	const { userId } = useLoaderData<typeof loader>();
	const { pathname } = useLocation();

	if (!userId) {
		return null;
	}

	return (
		<div className="h-[calc(100vh-64px)] w-[calc(100vw-64px)] ml-[64px]">
			<TooltipProvider>
				<aside className="fixed inset-y-0 left-0 hidden flex-col border-r bg-black sm:flex w-[64px]">
					<nav className="mt-[64px] flex flex-col items-center gap-4 px-2 sm:py-5 hover:[&_.isPrimary]:text-black">
						{navItems
							.filter((item) => !item.isFooter)
							.map(({ to, icon: Icon, label, tooltip }, index) => (
								<Tooltip key={index}>
									<TooltipTrigger asChild>
										<Link
											to={to(userId)}
											className={`flex h-9 w-9 items-center justify-center rounded-lg ${
												to(userId) === pathname ? "bg-accent isPrimary" : ""
											} text-muted-foreground transition-colors hover:text-white md:h-8 md:w-8`}>
											<Icon
												className={`${
													to(userId) === pathname
														? "h-4 w-4 transition-all hover:text-black group-hover:scale-110"
														: ""
												}`}
											/>
											<span className="sr-only">{label}</span>
										</Link>
									</TooltipTrigger>
									<TooltipContent side="right">{tooltip}</TooltipContent>
								</Tooltip>
							))}
					</nav>
					<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5 ">
						{navItems
							.filter((item) => item.isFooter)
							.map(({ to, icon: Icon, label, tooltip }, index) => (
								<Tooltip key={index}>
									<TooltipTrigger asChild>
										<Link
											to={to(userId)}
											className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white md:h-8 md:w-8`}>
											<Icon className="h-5 w-5" />
											<span className="sr-only">{label}</span>
										</Link>
									</TooltipTrigger>
									<TooltipContent side="right">{tooltip}</TooltipContent>
								</Tooltip>
							))}
					</nav>
				</aside>
			</TooltipProvider>
			<div className="flex flex-col justify-center items-center pt-10">
				<Outlet></Outlet>
			</div>
		</div>
	);
}
