import React from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
}

export const PrimaryButton = React.forwardRef<
	HTMLButtonElement,
	PrimaryButtonProps
>(({ children, className, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={cn(
				"relative px-8 py-3 font-medium text-white rounded-lg",
				"bg-[#667eea]",
				"hover:bg-[#5a67d8]",
				"transform transition-all duration-200",
				"hover:scale-105 hover:shadow-lg",
				"active:scale-100",
				"focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
});

PrimaryButton.displayName = "PrimaryButton";

export const GradientButton = PrimaryButton; // For backwards compatibility
