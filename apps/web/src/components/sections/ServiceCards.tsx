"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
	CardBody,
	CardContainer,
	CardItem,
} from "@/components/aceternity/3d-card";

interface ServiceCardProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	delay?: number;
}

const ServiceCard = ({
	title,
	description,
	icon,
	delay = 0,
}: ServiceCardProps) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.5, delay }}
		>
			<CardContainer className="inter-var py-0">
				<CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-gray-200/50 w-full h-auto rounded-xl p-6 border border-gray-200 transition-all duration-300">
					<CardItem translateZ="50" className="text-4xl text-primary mb-4">
						{icon}
					</CardItem>

					<CardItem
						translateZ="60"
						className="text-xl font-bold text-gray-900 mb-2"
					>
						{title}
					</CardItem>

					<CardItem
						as="p"
						translateZ="40"
						className="text-gray-600 text-sm leading-relaxed"
					>
						{description}
					</CardItem>

					<CardItem
						translateZ={20}
						as="div"
						className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
					>
						<span />
					</CardItem>
				</CardBody>
			</CardContainer>
		</motion.div>
	);
};

export default function ServiceCards() {
	const services = [
		{
			title: "AI-Powered Discovery",
			description:
				"AI agents can instantly discover and interact with your business services through your unique vanity URL (zabaca.com/yourbusiness).",
			icon: (
				<svg
					className="w-10 h-10"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			),
		},
		{
			title: "One-Click Integration",
			description:
				"Connect your existing tools like Calendly, Stripe, Intercom, and more through secure OAuth. No coding required - just click and connect.",
			icon: (
				<svg
					className="w-10 h-10"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			),
		},
		{
			title: "Universal API Access",
			description:
				"Standardized endpoints allow any AI agent to book meetings, process payments, access support, or query your knowledge base automatically.",
			icon: (
				<svg
					className="w-10 h-10"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			),
		},
	];

	return (
		<section id="services" className="py-20 px-4 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						How It Works
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Get your business AI-ready in under 5 minutes. Just sign up,
						connect, and share your profile.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{services.map((service, index) => (
						<ServiceCard key={service.title} {...service} delay={index * 0.1} />
					))}
				</div>
			</div>
		</section>
	);
}
