import "virtual:styleframe.css";
import Button from "./components/Button/Button";

// The axes of the Button recipe in components/Button/Button.styleframe.ts.
const COLORS = ["primary", "secondary", "success", "error", "neutral"] as const;
const BUTTON_VARIANTS = ["solid", "outline", "soft"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// Color scales generated for every base color by the design-token preset.
// (neutral / light / dark are surface colors without a 50–950 ramp.)
const PALETTE = ["primary", "secondary", "success", "info", "warning", "error", "gray"] as const;
const LEVELS = [
	50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
] as const;

// Each chip applies exactly the utility classes printed beneath it.
const UTILITIES = [
	"_background:color.primary _color:white",
	"_background:color.gray-100 _color:gray-900",
	"_color:primary _font-weight:medium",
	"_border-width:thin _border-style:solid _border-color:primary",
];

export default function App() {
	return (
		<main className="ui-kit">
			<div className="ui-kit-inner">
				<header className="ui-kit-header">
					<h1 className="ui-kit-title">Styleframe UI Kit</h1>
					<p className="ui-kit-subtitle">
						A Button recipe, tokens, and utilities generated from <code>styleframe.config.ts</code>.
						Edit the config or the Button on the left, then press <kbd>Cmd+S</kbd> (macOS) or{" "}
						<kbd>Ctrl+S</kbd> (otherwise).
					</p>
				</header>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Colors</h2>
					<p className="ui-kit-subtitle _margin:0">
						Each base color generates a full 50–950 lightness scale.
					</p>
					{PALETTE.map((name) => (
						<div key={name} className="ui-kit-ramp-row">
							<span className="ui-kit-label">{name}</span>
							<span
								className="ui-kit-ramp-cell"
								style={{ background: `var(--color--${name})` }}
								title={name}
							/>
							<div className="ui-kit-ramp">
								{LEVELS.map((level) => (
									<span
										key={level}
										className="ui-kit-ramp-cell"
										style={{ background: `var(--color--${name}-${level})` }}
										title={`${name}-${level}`}
									/>
								))}
							</div>
						</div>
					))}
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Buttons</h2>
					{BUTTON_VARIANTS.map((variant) => (
						<div key={variant} className="ui-kit-row">
							<span className="ui-kit-label">{variant}</span>
							{COLORS.map((color) => (
								<Button key={color} color={color} variant={variant}>
									{color}
								</Button>
							))}
						</div>
					))}
					<div className="ui-kit-row">
						<span className="ui-kit-label">disabled</span>
						{COLORS.map((color) => (
							<Button key={color} color={color} disabled>
								{color}
							</Button>
						))}
					</div>
					<div className="ui-kit-row">
						<span className="ui-kit-label">sizes</span>
						{SIZES.map((size) => (
							<Button key={size} size={size}>
								{size}
							</Button>
						))}
					</div>
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Utility classes</h2>
					<p className="ui-kit-subtitle _margin:0">
						Each chip is styled with the exact utility classes shown beneath it.
					</p>
					<div className="ui-kit-grid">
						{UTILITIES.map((className) => (
							<div key={className} className="ui-kit-swatch">
								<span
									className={`_display:inline-flex _padding:0.5 _border-radius:md _font-size:sm ${className}`}
								>
									Aa
								</span>
								<span className="ui-kit-caption">{className}</span>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
