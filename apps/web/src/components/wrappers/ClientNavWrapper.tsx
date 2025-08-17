import { useEffect, useState } from "react";
import { NewsletterModal } from "../NewsletterModal";

export default function ClientNavWrapper() {
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);

	useEffect(() => {
		// Add click handlers to navigation modal triggers
		const handleNavClick = (e: Event) => {
			e.preventDefault();
			setShowNewsletterModal(true);
		};

		const modalTriggers = document.querySelectorAll(".nav-modal-trigger");
		modalTriggers.forEach((trigger) => {
			trigger.addEventListener("click", handleNavClick);
		});

		return () => {
			modalTriggers.forEach((trigger) => {
				trigger.removeEventListener("click", handleNavClick);
			});
		};
	}, []);

	return (
		<NewsletterModal
			isOpen={showNewsletterModal}
			onClose={() => setShowNewsletterModal(false)}
		/>
	);
}
