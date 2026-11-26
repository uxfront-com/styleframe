import type { ReactNode } from "react";
import { avatar } from "virtual:styleframe";

interface AvatarProps {
	color?: "primary" | "light" | "dark" | "neutral";
	variant?: "solid" | "soft";
	shape?: "circle" | "square";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	children?: ReactNode;
}

export default function Avatar({
	color = "neutral",
	variant = "soft",
	shape = "circle",
	size = "md",
	children,
}: AvatarProps) {
	return <div className={avatar({ color, variant, shape, size })}>{children}</div>;
}
