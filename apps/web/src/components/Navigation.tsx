import { useState } from "react";
import { NewsletterModal } from "./NewsletterModal";

export function Navigation() {
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setShowNewsletterModal(true);
	};

	return (
		<>
			<nav
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					backgroundColor: "#4ff37d",
					zIndex: 40,
					padding: "16px 8px",
				}}
			>
				<div
					style={{
						maxWidth: "1536px",
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0 16px",
					}}
				>
					{/* Logo */}
					<a
						href="/"
						style={{
							fontSize: "24px",
							fontWeight: 700,
							color: "#131416",
							textDecoration: "none",
							letterSpacing: "-0.03em",
							fontFamily: "'Fredoka', sans-serif",
						}}
					>
						Zabaca
					</a>

					{/* Center Links */}
					<div
						style={{
							display: "flex",
							gap: "32px",
							alignItems: "center",
						}}
						className="nav-links-responsive"
					>
						<a
							href="/careers"
							style={{
								color: "#131416",
								textDecoration: "none",
								fontSize: "16px",
								fontWeight: 500,
								transition: "opacity 0.2s",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
							onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
						>
							Careers
						</a>
						<a
							href="/press"
							style={{
								color: "#131416",
								textDecoration: "none",
								fontSize: "16px",
								fontWeight: 500,
								transition: "opacity 0.2s",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
							onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
						>
							Press
						</a>
					</div>

					{/* Right Actions */}
					<div
						style={{
							display: "flex",
							gap: "24px",
							alignItems: "center",
						}}
					>
						<a
							href="/app"
							onClick={handleNavClick}
							style={{
								position: "relative",
								display: "inline-flex",
								alignItems: "center",
								padding: "12px 24px",
								backgroundColor: "#131416",
								color: "white",
								textDecoration: "none",
								borderRadius: "100px",
								fontWeight: 600,
								fontSize: "16px",
								transition: "all 0.3s ease",
								overflow: "hidden",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = "scale(1.05)";
								e.currentTarget.style.boxShadow =
									"0 8px 16px rgba(0, 0, 0, 0.2)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = "scale(1)";
								e.currentTarget.style.boxShadow = "none";
							}}
						>
							<span>Start for free</span>
						</a>
						<a
							href="/login"
							onClick={handleNavClick}
							style={{
								color: "#131416",
								textDecoration: "none",
								fontSize: "16px",
								fontWeight: 500,
								transition: "opacity 0.2s",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
							onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
						>
							Login
						</a>
					</div>
				</div>
			</nav>

			{/* Newsletter Modal */}
			<NewsletterModal
				isOpen={showNewsletterModal}
				onClose={() => setShowNewsletterModal(false)}
			/>

			<style>{`
        @media (max-width: 768px) {
          .nav-links-responsive {
            display: none !important;
          }
        }
      `}</style>
		</>
	);
}
