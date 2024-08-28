"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface TimeComboBoxProps {
	placeholder: string; // Placeholder text for the combobox
	slug: string; // Slug for the combobox
}

const HOURS = Array.from({ length: 24 }, (_, i) => ({
	value: `${i}`,
	label: `${i} hrs`,
}));
const MINUTES = Array.from({ length: 60 }, (_, i) => ({
	value: `${i}`,
	label: `${i} mins`,
}));
const SECONDS = Array.from({ length: 60 }, (_, i) => ({
	value: `${i}`,
	label: `${i} secs`,
}));

export function TimeComboBox({ placeholder, slug }: TimeComboBoxProps) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const selectedTime =
		slug === "hours" ? HOURS : slug === "minutes" ? MINUTES : SECONDS;

	return (
		<>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[100px] justify-between">
						{value
							? selectedTime.find((option) => option.value === value)?.label
							: placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[150px] p-0">
					<Command>
						<CommandInput
							defaultValue={0}
							placeholder={`Search ${placeholder.toLowerCase()}...`}
						/>
						<CommandList>
							<CommandEmpty>No options found.</CommandEmpty>
							<CommandGroup>
								{selectedTime.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={(currentValue: string) => {
											setValue(currentValue === value ? "" : currentValue);
											setOpen(false);
										}}>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<input type="hidden" name={slug} value={value} />
		</>
	);
}
