import { motion } from "framer-motion";
import { useState } from "react";
import { NewsletterModal } from "@/components/NewsletterModal";
import { PrimaryButton } from "@/components/ui/gradient-button";

export default function HeroSection() {
	const [username, setUsername] = useState("");
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);

	const handleClaimUsername = (e: React.FormEvent) => {
		e.preventDefault();
		if (username && username.length >= 3) {
			// Track PostHog event
			if (typeof window !== "undefined" && (window as any).posthog) {
				(window as any).posthog.capture("username_claim_attempted", {
					vanity_url: `zabaca.com/${username}`,
					username: username,
					timestamp: new Date().toISOString(),
					source: "hero_section",
				});
			}
			setShowNewsletterModal(true);
		}
	};

	return (
		<section id="home" className="relative bg-white py-20">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Content section - Left aligned */}
				<motion.div
					className="text-left max-w-3xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<motion.h1
						className="text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight text-gray-900"
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						style={{ letterSpacing: "-0.025em", fontWeight: 700 }}
					>
						The Universal Business
						<br />
						Card for the AI Age
					</motion.h1>

					<p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
						Zabaca seamlessly integrates your business services into one
						platform so that AI agents can discover and interact with you in a
						single click.
					</p>

					{/* Username claim CTA */}
					<div className="max-w-md">
						<form
							className="flex flex-col sm:flex-row gap-3 items-stretch"
							onSubmit={handleClaimUsername}
						>
							<div className="relative flex-1">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">
									zabaca.com/
								</span>
								<input
									type="text"
									value={username}
									onChange={(e) =>
										setUsername(
											e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
										)
									}
									placeholder="yourbusiness"
									className="w-full pl-[6rem] pr-4 py-3 border-2 border-gray-300 rounded-full focus:border-primary focus:outline-none text-base font-medium"
								/>
							</div>
							<PrimaryButton
								type="submit"
								className="text-base whitespace-nowrap px-6"
								disabled={!username || username.length < 3}
							>
								Claim your username
							</PrimaryButton>
						</form>
						<p className="text-sm text-gray-500 mt-3">
							Get your free AI business card • No credit card required
						</p>
					</div>
				</motion.div>
			</div>

			{/* Newsletter Modal */}
			<NewsletterModal
				isOpen={showNewsletterModal}
				onClose={() => setShowNewsletterModal(false)}
			/>
		</section>
	);
}
