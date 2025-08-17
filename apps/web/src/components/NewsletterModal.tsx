import { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogPortal,
} from "@/components/ui/dialog";

interface NewsletterModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
	useEffect(() => {
		// Load Beehiiv script when modal opens
		if (isOpen && typeof window !== "undefined") {
			// Check if script already exists
			if (!document.querySelector('script[src*="beehiiv.com/embed.js"]')) {
				const script = document.createElement("script");
				script.src = "https://subscribe-forms.beehiiv.com/embed.js";
				script.async = true;
				document.body.appendChild(script);
			}
		}
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogPortal>
				<DialogOverlay className="bg-black/50 backdrop-blur-sm" />
				<DialogContent
					className="sm:max-w-[600px] p-0 border-0"
					showCloseButton={false}
				>
					{/* Beehiiv Form Container */}
					<div className="w-full flex justify-center">
						<iframe
							src="https://subscribe-forms.beehiiv.com/bafe4594-7f85-4d48-b8f5-98b597ed7ff4"
							className="beehiiv-embed"
							data-test-id="beehiiv-embed"
							style={{
								width: "100%",
								maxWidth: "592px",
								height: "462px",
								margin: "0",
								borderRadius: "0px",
								backgroundColor: "transparent",
								boxShadow: "none",
							}}
						/>
					</div>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
