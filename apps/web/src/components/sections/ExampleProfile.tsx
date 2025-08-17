import { motion } from "framer-motion";

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

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					viewport={{ once: true }}
					className="max-w-4xl mx-auto"
				>
					<div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800">
						<div className="flex items-center gap-3 mb-6">
							<div className="flex gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
								<div className="w-3 h-3 rounded-full bg-green-500"></div>
							</div>
							<div className="flex-1 bg-gray-800 rounded px-3 py-1 text-sm text-gray-400 font-mono">
								zabaca.com/yourbusiness
							</div>
						</div>

						<pre className="text-sm text-gray-300 overflow-x-auto">
							<code>{`{
  "profile": {
    "name": "Your Business Name",
    "business": "Product Strategy Consultant",
    "verified": true,
    "last_updated": "2025-01-26T10:30:00Z"
  },
  "services": {
    "scheduling": {
      "platform": "cal.com",
      "endpoint": "https://api.zabaca.com/yourbusiness/schedule",
      "public_access": true,
      "types": ["consultation", "workshop", "coffee-chat"]
    },
    "payments": {
      "platform": "stripe",
      "endpoint": "https://api.zabaca.com/yourbusiness/payments",
      "public_access": true,
      "methods": ["credit_card", "ach"]
    },
    "support": {
      "platform": "intercom",
      "endpoint": "https://api.zabaca.com/yourbusiness/support",
      "public_access": true,
      "channels": ["chat", "email"]
    }
  }
}`}</code>
						</pre>
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						viewport={{ once: true }}
						className="mt-8 text-center"
					>
						<p className="text-2xl font-bold text-gray-900 italic">
							"Within 24 hours of setting up my Zabaca profile, I had AI
							assistants booking consultations directly into my calendar."
						</p>
						<p className="text-gray-600 mt-2">
							- Michael Torres, Marketing Consultant
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
