import { MovingBorderButton } from "@/components/aceternity/moving-border";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { TextGenerateEffect } from "@/components/magicui/text-generate-effect";
import { Button } from "@/components/ui/button";

export function TestComponents() {
	return (
		<div className="space-y-8 p-8">
			<h2 className="text-2xl font-bold">Component Test</h2>

			{/* shadcn/ui Button */}
			<div>
				<h3 className="text-lg font-semibold mb-2">shadcn/ui Button</h3>
				<Button>Click me</Button>
			</div>

			{/* Magic UI Shimmer Button */}
			<div>
				<h3 className="text-lg font-semibold mb-2">Magic UI Shimmer Button</h3>
				<ShimmerButton>Get Started</ShimmerButton>
			</div>

			{/* Text Generate Effect */}
			<div>
				<h3 className="text-lg font-semibold mb-2">Text Generate Effect</h3>
				<TextGenerateEffect words="Welcome to our amazing platform" />
			</div>

			{/* Moving Border Button */}
			<div>
				<h3 className="text-lg font-semibold mb-2">Moving Border Button</h3>
				<MovingBorderButton
					borderRadius="1.75rem"
					className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
				>
					Contact Us
				</MovingBorderButton>
			</div>
		</div>
	);
}
