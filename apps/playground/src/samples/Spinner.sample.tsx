import { spinner, spinnerCircle } from "virtual:styleframe";

interface SpinnerProps {
	color?: "primary" | "light" | "dark" | "neutral";
	size?: "auto" | "sm" | "md" | "lg";
}

export default function Spinner({ color = "primary", size = "md" }: SpinnerProps) {
	return (
		<span className={spinner({ color, size })}>
			<svg className={spinnerCircle({ size })} viewBox="0 0 50 50">
				<circle cx="25" cy="25" r="20" />
			</svg>
		</span>
	);
}
