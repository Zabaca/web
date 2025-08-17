import {
	CardBody,
	CardContainer,
	CardItem,
} from "@/components/aceternity/3d-card";

interface Client3DCardProps {
	children: React.ReactNode;
	className?: string;
	containerClassName?: string;
}

export default function Client3DCard({
	children,
	className,
	containerClassName,
}: Client3DCardProps) {
	return (
		<CardContainer
			className={className}
			containerClassName={containerClassName}
		>
			<CardBody>{children}</CardBody>
		</CardContainer>
	);
}

export { CardItem };
