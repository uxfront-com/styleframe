import type { ReactNode } from "react";
import { button } from "virtual:styleframe";

interface ButtonProps {
	color?: "primary" | "secondary" | "success" | "error" | "neutral";
	variant?: "solid" | "outline" | "soft";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	children?: ReactNode;
}

export default function Button({
	color = "neutral",
	variant = "solid",
	size = "md",
	disabled,
	children,
}: ButtonProps) {
	return (
		<button type="button" className={button({ color, variant, size })} disabled={disabled}>
			{children}
		</button>
	);
}
