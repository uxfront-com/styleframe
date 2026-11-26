import "virtual:styleframe.css";
import Avatar from "./components/Avatar/Avatar";
import Badge from "./components/Badge/Badge";
import Button from "./components/Button/Button";
import Callout from "./components/Callout/Callout";
import Card from "./components/Card/Card";
import Checkbox from "./components/Checkbox/Checkbox";
import Input from "./components/Input/Input";
import Spinner from "./components/Spinner/Spinner";

const COLORS = [
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"neutral",
	"light",
	"dark",
] as const;
const BUTTON_VARIANTS = ["solid", "outline", "soft", "subtle", "ghost", "link"] as const;
const BADGE_VARIANTS = ["solid", "outline", "soft", "subtle"] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const CARD_VARIANTS = ["solid", "soft", "subtle"] as const;

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
						Components, tokens, and utilities generated from <code>styleframe.config.ts</code>. Edit
						the config or any component on the left, then press <kbd>Cmd+S</kbd> (macOS) or{" "}
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
					<h2 className="ui-kit-section-title">Badges</h2>
					{BADGE_VARIANTS.map((variant) => (
						<div key={variant} className="ui-kit-row">
							<span className="ui-kit-label">{variant}</span>
							{COLORS.map((color) => (
								<Badge key={color} color={color} variant={variant}>
									{color}
								</Badge>
							))}
						</div>
					))}
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Avatars</h2>
					<div className="ui-kit-row">
						<span className="ui-kit-label">sizes</span>
						{SIZES.map((size) => (
							<Avatar key={size} size={size}>
								SF
							</Avatar>
						))}
					</div>
					<div className="ui-kit-row">
						<span className="ui-kit-label">colors</span>
						<Avatar color="primary" variant="solid">
							AB
						</Avatar>
						<Avatar color="primary" variant="soft">
							CD
						</Avatar>
						<Avatar color="neutral">EF</Avatar>
						<Avatar color="dark">GH</Avatar>
						<Avatar shape="square" color="primary" variant="solid">
							IJ
						</Avatar>
					</div>
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Callouts</h2>
					<div className="ui-kit-stack">
						<Callout color="info" variant="soft">
							Heads up — this is an informational message.
						</Callout>
						<Callout color="success" variant="soft">
							Success — your changes have been saved.
						</Callout>
						<Callout color="warning" variant="soft">
							Warning — double-check before continuing.
						</Callout>
						<Callout color="error" variant="soft">
							Error — something went wrong.
						</Callout>
					</div>
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Cards</h2>
					<div className="ui-kit-cards">
						{CARD_VARIANTS.map((variant) => (
							<Card
								key={variant}
								variant={variant}
								header={<strong>{variant} card</strong>}
								footer={<Button size="sm">Action</Button>}
							>
								<p className="_margin:0">
									A {variant} card built from the card recipe with header, body, and footer parts.
								</p>
							</Card>
						))}
					</div>
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Form controls</h2>
					<div className="ui-kit-row">
						<span className="ui-kit-label">input</span>
						<Input placeholder="Type here…" />
						<Input size="sm" placeholder="Small" />
						<Input invalid defaultValue="Invalid value" />
						<Input disabled placeholder="Disabled" />
					</div>
					<div className="ui-kit-row">
						<span className="ui-kit-label">checkbox</span>
						<Checkbox defaultChecked>Checked</Checkbox>
						<Checkbox>Unchecked</Checkbox>
						<Checkbox disabled>Disabled</Checkbox>
					</div>
				</section>

				<section className="ui-kit-section">
					<h2 className="ui-kit-section-title">Spinners</h2>
					<div className="ui-kit-row">
						<span className="ui-kit-label">sizes</span>
						<Spinner size="sm" />
						<Spinner size="md" />
						<Spinner size="lg" />
						<Spinner color="neutral" />
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
