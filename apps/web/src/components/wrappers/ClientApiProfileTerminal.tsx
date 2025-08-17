import ApiProfileTerminal from "../shared/ApiProfileTerminal";

interface ClientApiProfileTerminalProps {
	showTestimonial?: boolean;
	animated?: boolean;
}

export default function ClientApiProfileTerminal({ 
	showTestimonial = true,
	animated = false 
}: ClientApiProfileTerminalProps) {
	return <ApiProfileTerminal showTestimonial={showTestimonial} animated={animated} />;
}