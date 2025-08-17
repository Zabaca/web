"use client";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { NewsletterModal } from "@/components/NewsletterModal";
import { PrimaryButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

export default function ContactSection() {
	const [username, setUsername] = useState("");
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);
	const [notification] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (username && username.length >= 3) {
			// Track PostHog event
			if (typeof window !== "undefined" && (window as any).posthog) {
				(window as any).posthog.capture("username_claim_attempted", {
					vanity_url: `zabaca.com/${username}`,
					username: username,
					timestamp: new Date().toISOString(),
					source: "contact_section",
				});
			}
			setShowNewsletterModal(true);
		}
	};

	return (
		<section id="contact" className="relative py-20 overflow-hidden bg-gray-50">
			<div className="relative">
				<div className="relative z-10 max-w-4xl mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
							Get Your Zabaca Profile
						</h2>
						<p className="text-lg text-gray-600">
							Join thousands of businesses making themselves discoverable to AI
							agents
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
						className="max-w-md mx-auto"
					>
						<form
							className="flex flex-col sm:flex-row gap-3 items-stretch"
							onSubmit={handleSubmit}
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
						<p className="text-sm text-gray-500 mt-3 text-center">
							Get your free AI business card • No credit card required
						</p>
					</motion.div>

					{/* Notification */}
					<AnimatePresence>
						{notification.type && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="fixed bottom-8 right-8 z-50"
							>
								<div
									className={cn(
										"px-6 py-4 rounded-lg shadow-lg",
										"backdrop-blur-md",
										notification.type === "success"
											? "bg-green-500/90 text-white"
											: "bg-red-500/90 text-white",
									)}
								>
									<p className="font-medium">{notification.message}</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Alternative CTA */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						viewport={{ once: true }}
						className="text-center mt-8"
					>
						<p className="text-gray-600">
							Prefer email?{" "}
							<a
								href="mailto:hello@zabaca.com"
								className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
							>
								hello@zabaca.com
							</a>
						</p>
					</motion.div>
				</div>
			</div>

			{/* Newsletter Modal */}
			<NewsletterModal
				isOpen={showNewsletterModal}
				onClose={() => setShowNewsletterModal(false)}
			/>
		</section>
	);
}
