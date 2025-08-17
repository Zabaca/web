import { motion } from "framer-motion";
import ApiProfileTerminal from "../shared/ApiProfileTerminal";

export default function ExampleProfile() {
	return (
		<section className="py-20 px-4 bg-white">
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Your AI Profile
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						See how AI agents will discover and interact with your business
					</p>
				</motion.div>

				<ApiProfileTerminal showTestimonial={true} animated={true} />
			</div>
		</section>
	);
}
