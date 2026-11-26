import type { PageSpec } from "../types";

/**
 * Marketing landing page written three times with identical HTML structure.
 *
 * 1. Styleframe (long):       _padding-inline:xl   _background:primary
 * 2. Styleframe (shorthand):  _px:xl               _bg:primary
 * 3. Tailwind:                px-xl                 bg-primary
 */

// ---------------------------------------------------------------------------
// Shared template
// ---------------------------------------------------------------------------

function page(c: {
	body: string;
	// Nav
	nav: string;
	navBrand: string;
	navLinks: string;
	navLink: string;
	navRight: string;
	btnPrimary: string;
	btnOutline: string;
	// Hero
	hero: string;
	heroContent: string;
	heroTitle: string;
	heroSubtitle: string;
	heroActions: string;
	// Features
	featuresSection: string;
	featuresTitle: string;
	featuresSubtitle: string;
	featuresGrid: string;
	featureCard: string;
	featureIcon: string;
	featureCardTitle: string;
	featureCardDesc: string;
	// Testimonials
	testimonialsSection: string;
	testimonialsTitle: string;
	testimonialsGrid: string;
	testimonialCard: string;
	testimonialQuote: string;
	testimonialAuthor: string;
	testimonialRole: string;
	// Pricing
	pricingSection: string;
	pricingTitle: string;
	pricingSubtitle: string;
	pricingGrid: string;
	pricingCard: string;
	pricingCardFeatured: string;
	pricingName: string;
	pricingPrice: string;
	pricingPeriod: string;
	pricingFeatures: string;
	pricingFeatureItem: string;
	pricingCta: string;
	pricingCtaFeatured: string;
	// CTA banner
	ctaBanner: string;
	ctaBannerTitle: string;
	ctaBannerDesc: string;
	// Footer
	footer: string;
	footerTop: string;
	footerBrand: string;
	footerDesc: string;
	footerColumn: string;
	footerColumnTitle: string;
	footerColumnList: string;
	footerColumnLink: string;
	footerBottom: string;
	footerCopyright: string;
	footerBottomLinks: string;
	footerBottomLink: string;
}): string {
	return `<div class="${c.body}">
  <!-- Nav -->
  <nav class="${c.nav}">
    <div class="${c.navBrand}">Acme</div>
    <ul class="${c.navLinks}">
      <li><a href="#" class="${c.navLink}">Features</a></li>
      <li><a href="#" class="${c.navLink}">Pricing</a></li>
      <li><a href="#" class="${c.navLink}">Testimonials</a></li>
      <li><a href="#" class="${c.navLink}">Blog</a></li>
    </ul>
    <div class="${c.navRight}">
      <button class="${c.btnOutline}">Log in</button>
      <button class="${c.btnPrimary}">Get started</button>
    </div>
  </nav>

  <!-- Hero -->
  <section class="${c.hero}">
    <div class="${c.heroContent}">
      <h1 class="${c.heroTitle}">Ship better products faster with Acme</h1>
      <p class="${c.heroSubtitle}">The all-in-one platform that helps your team collaborate, build, and deploy with confidence. Trusted by over 10,000 teams worldwide.</p>
      <div class="${c.heroActions}">
        <button class="${c.btnPrimary}">Start free trial</button>
        <button class="${c.btnOutline}">Watch demo</button>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="${c.featuresSection}">
    <h2 class="${c.featuresTitle}">Everything you need to build great products</h2>
    <p class="${c.featuresSubtitle}">Powerful features designed to streamline your workflow from idea to production.</p>
    <div class="${c.featuresGrid}">
      <div class="${c.featureCard}">
        <div class="${c.featureIcon}"></div>
        <h3 class="${c.featureCardTitle}">Real-time collaboration</h3>
        <p class="${c.featureCardDesc}">Work together seamlessly with live editing, comments, and instant sync across your entire team.</p>
      </div>
      <div class="${c.featureCard}">
        <div class="${c.featureIcon}"></div>
        <h3 class="${c.featureCardTitle}">Automated deployments</h3>
        <p class="${c.featureCardDesc}">Push to production with zero-downtime deploys, automatic rollbacks, and built-in health checks.</p>
      </div>
      <div class="${c.featureCard}">
        <div class="${c.featureIcon}"></div>
        <h3 class="${c.featureCardTitle}">Advanced analytics</h3>
        <p class="${c.featureCardDesc}">Track every metric that matters with customizable dashboards and real-time alerting.</p>
      </div>
      <div class="${c.featureCard}">
        <div class="${c.featureIcon}"></div>
        <h3 class="${c.featureCardTitle}">Enterprise security</h3>
        <p class="${c.featureCardDesc}">SOC 2 compliant with role-based access control, SSO, and end-to-end encryption.</p>
      </div>
      <div class="${c.featureCard}">
        <div class="${c.featureIcon}"></div>
        <h3 class="${c.featureCardTitle}">API-first design</h3>
        <p class="${c.featureCardDesc}">Build custom integrations with our comprehensive REST and GraphQL APIs and webhooks.</p>
      </div>
      <div class="${c.featureCard}">
        <div class="${c.featureIcon}"></div>
        <h3 class="${c.featureCardTitle}">24/7 support</h3>
        <p class="${c.featureCardDesc}">Get help when you need it with dedicated support engineers and 99.9% uptime SLA.</p>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="${c.testimonialsSection}">
    <h2 class="${c.testimonialsTitle}">Loved by teams everywhere</h2>
    <div class="${c.testimonialsGrid}">
      <div class="${c.testimonialCard}">
        <p class="${c.testimonialQuote}">"Acme transformed our deployment process. What used to take hours now takes minutes. The real-time collaboration features have been a game changer for our distributed team."</p>
        <div class="${c.testimonialAuthor}">Sarah Chen</div>
        <div class="${c.testimonialRole}">VP of Engineering, TechCorp</div>
      </div>
      <div class="${c.testimonialCard}">
        <p class="${c.testimonialQuote}">"We evaluated a dozen tools before choosing Acme. The analytics alone have helped us reduce our error rate by 40% and ship features twice as fast."</p>
        <div class="${c.testimonialAuthor}">Marcus Johnson</div>
        <div class="${c.testimonialRole}">CTO, StartupHQ</div>
      </div>
      <div class="${c.testimonialCard}">
        <p class="${c.testimonialQuote}">"The API-first approach meant we could integrate Acme into our existing stack in a single afternoon. Best developer experience I've encountered."</p>
        <div class="${c.testimonialAuthor}">Emily Rodriguez</div>
        <div class="${c.testimonialRole}">Lead Developer, DesignLab</div>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section class="${c.pricingSection}">
    <h2 class="${c.pricingTitle}">Simple, transparent pricing</h2>
    <p class="${c.pricingSubtitle}">No hidden fees. No surprises. Choose the plan that fits your team.</p>
    <div class="${c.pricingGrid}">
      <div class="${c.pricingCard}">
        <div class="${c.pricingName}">Free</div>
        <div class="${c.pricingPrice}">$0</div>
        <div class="${c.pricingPeriod}">per month</div>
        <ul class="${c.pricingFeatures}">
          <li class="${c.pricingFeatureItem}">Up to 3 projects</li>
          <li class="${c.pricingFeatureItem}">1 GB storage</li>
          <li class="${c.pricingFeatureItem}">Community support</li>
          <li class="${c.pricingFeatureItem}">Basic analytics</li>
        </ul>
        <button class="${c.pricingCta}">Get started</button>
      </div>
      <div class="${c.pricingCardFeatured}">
        <div class="${c.pricingName}">Pro</div>
        <div class="${c.pricingPrice}">$29</div>
        <div class="${c.pricingPeriod}">per month</div>
        <ul class="${c.pricingFeatures}">
          <li class="${c.pricingFeatureItem}">Unlimited projects</li>
          <li class="${c.pricingFeatureItem}">100 GB storage</li>
          <li class="${c.pricingFeatureItem}">Priority support</li>
          <li class="${c.pricingFeatureItem}">Advanced analytics</li>
        </ul>
        <button class="${c.pricingCtaFeatured}">Start free trial</button>
      </div>
      <div class="${c.pricingCard}">
        <div class="${c.pricingName}">Enterprise</div>
        <div class="${c.pricingPrice}">$99</div>
        <div class="${c.pricingPeriod}">per month</div>
        <ul class="${c.pricingFeatures}">
          <li class="${c.pricingFeatureItem}">Unlimited everything</li>
          <li class="${c.pricingFeatureItem}">1 TB storage</li>
          <li class="${c.pricingFeatureItem}">Dedicated support</li>
          <li class="${c.pricingFeatureItem}">Custom integrations</li>
        </ul>
        <button class="${c.pricingCta}">Contact sales</button>
      </div>
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="${c.ctaBanner}">
    <h2 class="${c.ctaBannerTitle}">Ready to get started?</h2>
    <p class="${c.ctaBannerDesc}">Join thousands of teams already using Acme to ship better products. Start your free 14-day trial today.</p>
    <button class="${c.btnPrimary}">Start your free trial</button>
  </section>

  <!-- Footer -->
  <footer class="${c.footer}">
    <div class="${c.footerTop}">
      <div class="${c.footerColumn}">
        <div class="${c.footerBrand}">Acme</div>
        <p class="${c.footerDesc}">The all-in-one platform for modern teams to build, deploy, and scale.</p>
      </div>
      <div class="${c.footerColumn}">
        <div class="${c.footerColumnTitle}">Product</div>
        <ul class="${c.footerColumnList}">
          <li><a href="#" class="${c.footerColumnLink}">Features</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Pricing</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Changelog</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Roadmap</a></li>
        </ul>
      </div>
      <div class="${c.footerColumn}">
        <div class="${c.footerColumnTitle}">Company</div>
        <ul class="${c.footerColumnList}">
          <li><a href="#" class="${c.footerColumnLink}">About</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Blog</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Careers</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Contact</a></li>
        </ul>
      </div>
      <div class="${c.footerColumn}">
        <div class="${c.footerColumnTitle}">Legal</div>
        <ul class="${c.footerColumnList}">
          <li><a href="#" class="${c.footerColumnLink}">Privacy</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Terms</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Security</a></li>
          <li><a href="#" class="${c.footerColumnLink}">Cookies</a></li>
        </ul>
      </div>
    </div>
    <div class="${c.footerBottom}">
      <div class="${c.footerCopyright}">&copy; 2026 Acme Inc. All rights reserved.</div>
      <div class="${c.footerBottomLinks}">
        <a href="#" class="${c.footerBottomLink}">Twitter</a>
        <a href="#" class="${c.footerBottomLink}">GitHub</a>
        <a href="#" class="${c.footerBottomLink}">Discord</a>
      </div>
    </div>
  </footer>
</div>`;
}

// ---------------------------------------------------------------------------
// Styleframe (long names)
// ---------------------------------------------------------------------------

export const styleframePage = page({
	body: "_background:background",
	// Nav
	nav: "_display:flex _align-items:center _justify-content:between _padding-inline:xl _padding-block:md _background:white _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	navBrand: "_font-size:lg _font-weight:bold _color:text",
	navLinks: "_display:flex _gap:md _list-style:none",
	navLink: "_color:text-weak _text-decoration:none _font-size:sm _font-weight:medium",
	navRight: "_display:flex _align-items:center _gap:sm",
	btnPrimary:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer",
	btnOutline:
		"_display:inline-flex _align-items:center _justify-content:center _background:transparent _color:primary _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-width:thin _border-style:solid _border-color:primary _cursor:pointer",
	// Hero
	hero: "_background:primary-800 _padding-block:2xl _padding-inline:xl _display:flex _justify-content:center",
	heroContent:
		"_max-width:2xl _text-align:center _display:flex _flex-direction:column _align-items:center _gap:lg",
	heroTitle: "_font-size:lg _font-weight:bold _color:white _line-height:normal",
	heroSubtitle: "_font-size:md _color:primary-100 _line-height:normal _max-width:2xl",
	heroActions: "_display:flex _gap:md _justify-content:center",
	// Features
	featuresSection:
		"_padding-block:2xl _padding-inline:xl _display:flex _flex-direction:column _align-items:center",
	featuresTitle: "_font-size:lg _font-weight:bold _color:text _text-align:center _margin-bottom:sm",
	featuresSubtitle:
		"_font-size:md _color:text-weak _text-align:center _margin-bottom:xl _max-width:2xl",
	featuresGrid: "_display:grid _grid-template-columns:3 _gap:lg _max-width:2xl _width:full",
	featureCard:
		"_background:white _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:sm",
	featureIcon: "_width:xl _height:xl _border-radius:md _background:primary-100",
	featureCardTitle: "_font-size:md _font-weight:semibold _color:text",
	featureCardDesc: "_font-size:sm _color:text-weak _line-height:normal",
	// Testimonials
	testimonialsSection:
		"_padding-block:2xl _padding-inline:xl _background:neutral-50 _display:flex _flex-direction:column _align-items:center",
	testimonialsTitle:
		"_font-size:lg _font-weight:bold _color:text _text-align:center _margin-bottom:xl",
	testimonialsGrid: "_display:grid _grid-template-columns:3 _gap:lg _max-width:2xl _width:full",
	testimonialCard:
		"_background:white _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:md",
	testimonialQuote: "_font-size:sm _color:text _line-height:normal",
	testimonialAuthor: "_font-size:sm _font-weight:semibold _color:text",
	testimonialRole: "_font-size:xs _color:text-weak",
	// Pricing
	pricingSection:
		"_padding-block:2xl _padding-inline:xl _display:flex _flex-direction:column _align-items:center",
	pricingTitle: "_font-size:lg _font-weight:bold _color:text _text-align:center _margin-bottom:sm",
	pricingSubtitle: "_font-size:md _color:text-weak _text-align:center _margin-bottom:xl",
	pricingGrid:
		"_display:grid _grid-template-columns:3 _gap:lg _max-width:2xl _width:full _align-items:start",
	pricingCard:
		"_background:white _border-radius:lg _padding:xl _border-width:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _align-items:center _gap:md",
	pricingCardFeatured:
		"_background:primary-50 _border-radius:lg _padding:xl _border-width:thin _border-style:solid _border-color:primary _display:flex _flex-direction:column _align-items:center _gap:md",
	pricingName: "_font-size:md _font-weight:semibold _color:text",
	pricingPrice: "_font-size:lg _font-weight:bold _color:text",
	pricingPeriod: "_font-size:sm _color:text-weak",
	pricingFeatures: "_list-style:none _display:flex _flex-direction:column _gap:sm _width:full",
	pricingFeatureItem:
		"_font-size:sm _color:text _padding-block:xs _border-bottom-width:thin _border-bottom-color:neutral-100 _border-bottom-style:solid",
	pricingCta:
		"_display:inline-flex _align-items:center _justify-content:center _background:transparent _color:primary _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-width:thin _border-style:solid _border-color:primary _cursor:pointer _width:full",
	pricingCtaFeatured:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer _width:full",
	// CTA banner
	ctaBanner:
		"_background:primary-800 _padding-block:2xl _padding-inline:xl _display:flex _flex-direction:column _align-items:center _gap:lg _text-align:center",
	ctaBannerTitle: "_font-size:lg _font-weight:bold _color:white",
	ctaBannerDesc: "_font-size:md _color:primary-100 _max-width:2xl _line-height:normal",
	// Footer
	footer:
		"_background:neutral-900 _padding-block:xl _padding-inline:xl _display:flex _flex-direction:column _gap:xl",
	footerTop: "_display:grid _grid-template-columns:4 _gap:xl",
	footerBrand: "_font-size:lg _font-weight:bold _color:white",
	footerDesc: "_font-size:sm _color:neutral-200 _line-height:normal _margin-top:sm",
	footerColumn: "_display:flex _flex-direction:column",
	footerColumnTitle: "_font-size:sm _font-weight:semibold _color:white _margin-bottom:md",
	footerColumnList: "_list-style:none _display:flex _flex-direction:column _gap:sm",
	footerColumnLink: "_font-size:sm _color:neutral-200 _text-decoration:none",
	footerBottom:
		"_display:flex _justify-content:between _align-items:center _padding-top:lg _border-top-style:solid _border-top-width:thin _border-top-color:neutral-700",
	footerCopyright: "_font-size:sm _color:neutral-200",
	footerBottomLinks: "_display:flex _gap:md",
	footerBottomLink: "_font-size:sm _color:neutral-200 _text-decoration:none",
});

// ---------------------------------------------------------------------------
// Styleframe (shorthand names)
// ---------------------------------------------------------------------------

export const styleframeShorthandPage = page({
	body: "_bg:background",
	// Nav
	nav: "_display:flex _items:center _justify:between _px:xl _py:md _bg:white _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	navBrand: "_text:lg _font:bold _color:text",
	navLinks: "_display:flex _gap:md _list:none",
	navLink: "_color:text-weak _text-decoration:none _text:sm _font:medium",
	navRight: "_display:flex _items:center _gap:sm",
	btnPrimary:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer",
	btnOutline:
		"_display:inline-flex _items:center _justify:center _bg:transparent _color:primary _text:sm _font:medium _px:lg _py:sm _rounded:md _border:thin _border-style:solid _border-color:primary _cursor:pointer",
	// Hero
	hero: "_bg:primary-800 _py:2xl _px:xl _display:flex _justify:center",
	heroContent:
		"_max-w:2xl _text-align:center _display:flex _flex-direction:column _items:center _gap:lg",
	heroTitle: "_text:lg _font:bold _color:white _leading:normal",
	heroSubtitle: "_text:md _color:primary-100 _leading:normal _max-w:2xl",
	heroActions: "_display:flex _gap:md _justify:center",
	// Features
	featuresSection: "_py:2xl _px:xl _display:flex _flex-direction:column _items:center",
	featuresTitle: "_text:lg _font:bold _color:text _text-align:center _mb:sm",
	featuresSubtitle: "_text:md _color:text-weak _text-align:center _mb:xl _max-w:2xl",
	featuresGrid: "_display:grid _grid-cols:3 _gap:lg _max-w:2xl _w:full",
	featureCard:
		"_bg:white _rounded:lg _p:lg _border:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:sm",
	featureIcon: "_w:xl _h:xl _rounded:md _bg:primary-100",
	featureCardTitle: "_text:md _font:semibold _color:text",
	featureCardDesc: "_text:sm _color:text-weak _leading:normal",
	// Testimonials
	testimonialsSection:
		"_py:2xl _px:xl _bg:neutral-50 _display:flex _flex-direction:column _items:center",
	testimonialsTitle: "_text:lg _font:bold _color:text _text-align:center _mb:xl",
	testimonialsGrid: "_display:grid _grid-cols:3 _gap:lg _max-w:2xl _w:full",
	testimonialCard:
		"_bg:white _rounded:lg _p:lg _border:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:md",
	testimonialQuote: "_text:sm _color:text _leading:normal",
	testimonialAuthor: "_text:sm _font:semibold _color:text",
	testimonialRole: "_text:xs _color:text-weak",
	// Pricing
	pricingSection: "_py:2xl _px:xl _display:flex _flex-direction:column _items:center",
	pricingTitle: "_text:lg _font:bold _color:text _text-align:center _mb:sm",
	pricingSubtitle: "_text:md _color:text-weak _text-align:center _mb:xl",
	pricingGrid: "_display:grid _grid-cols:3 _gap:lg _max-w:2xl _w:full _items:start",
	pricingCard:
		"_bg:white _rounded:lg _p:xl _border:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _items:center _gap:md",
	pricingCardFeatured:
		"_bg:primary-50 _rounded:lg _p:xl _border:thin _border-style:solid _border-color:primary _display:flex _flex-direction:column _items:center _gap:md",
	pricingName: "_text:md _font:semibold _color:text",
	pricingPrice: "_text:lg _font:bold _color:text",
	pricingPeriod: "_text:sm _color:text-weak",
	pricingFeatures: "_list:none _display:flex _flex-direction:column _gap:sm _w:full",
	pricingFeatureItem:
		"_text:sm _color:text _py:xs _border-bottom-width:thin _border-bottom-color:neutral-100 _border-bottom-style:solid",
	pricingCta:
		"_display:inline-flex _items:center _justify:center _bg:transparent _color:primary _text:sm _font:medium _px:lg _py:sm _rounded:md _border:thin _border-style:solid _border-color:primary _cursor:pointer _w:full",
	pricingCtaFeatured:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer _w:full",
	// CTA banner
	ctaBanner:
		"_bg:primary-800 _py:2xl _px:xl _display:flex _flex-direction:column _items:center _gap:lg _text-align:center",
	ctaBannerTitle: "_text:lg _font:bold _color:white",
	ctaBannerDesc: "_text:md _color:primary-100 _max-w:2xl _leading:normal",
	// Footer
	footer: "_bg:neutral-900 _py:xl _px:xl _display:flex _flex-direction:column _gap:xl",
	footerTop: "_display:grid _grid-cols:4 _gap:xl",
	footerBrand: "_text:lg _font:bold _color:white",
	footerDesc: "_text:sm _color:neutral-200 _leading:normal _mt:sm",
	footerColumn: "_display:flex _flex-direction:column",
	footerColumnTitle: "_text:sm _font:semibold _color:white _mb:md",
	footerColumnList: "_list:none _display:flex _flex-direction:column _gap:sm",
	footerColumnLink: "_text:sm _color:neutral-200 _text-decoration:none",
	footerBottom:
		"_display:flex _justify:between _items:center _pt:lg _border-top-style:solid _border-top-width:thin _border-top-color:neutral-700",
	footerCopyright: "_text:sm _color:neutral-200",
	footerBottomLinks: "_display:flex _gap:md",
	footerBottomLink: "_text:sm _color:neutral-200 _text-decoration:none",
});

// ---------------------------------------------------------------------------
// Tailwind
// ---------------------------------------------------------------------------

export const tailwindPage = page({
	body: "bg-background",
	// Nav
	nav: "flex items-center justify-between px-xl py-md bg-white border-b border-neutral-200",
	navBrand: "text-lg font-bold text-text",
	navLinks: "flex gap-md list-none",
	navLink: "text-text-weak no-underline text-sm font-medium",
	navRight: "flex items-center gap-sm",
	btnPrimary:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer",
	btnOutline:
		"inline-flex items-center justify-center bg-transparent text-primary text-sm font-medium px-lg py-sm rounded-md border border-primary cursor-pointer",
	// Hero
	hero: "bg-primary-800 py-2xl px-xl flex justify-center",
	heroContent: "max-w-2xl text-center flex flex-col items-center gap-lg",
	heroTitle: "text-lg font-bold text-white leading-normal",
	heroSubtitle: "text-md text-primary-100 leading-normal max-w-2xl",
	heroActions: "flex gap-md justify-center",
	// Features
	featuresSection: "py-2xl px-xl flex flex-col items-center",
	featuresTitle: "text-lg font-bold text-text text-center mb-sm",
	featuresSubtitle: "text-md text-text-weak text-center mb-xl max-w-2xl",
	featuresGrid: "grid grid-cols-3 gap-lg max-w-2xl w-full",
	featureCard: "bg-white rounded-lg p-lg border border-neutral-200 flex flex-col gap-sm",
	featureIcon: "w-xl h-xl rounded-md bg-primary-100",
	featureCardTitle: "text-md font-semibold text-text",
	featureCardDesc: "text-sm text-text-weak leading-normal",
	// Testimonials
	testimonialsSection: "py-2xl px-xl bg-neutral-50 flex flex-col items-center",
	testimonialsTitle: "text-lg font-bold text-text text-center mb-xl",
	testimonialsGrid: "grid grid-cols-3 gap-lg max-w-2xl w-full",
	testimonialCard: "bg-white rounded-lg p-lg border border-neutral-200 flex flex-col gap-md",
	testimonialQuote: "text-sm text-text leading-normal",
	testimonialAuthor: "text-sm font-semibold text-text",
	testimonialRole: "text-xs text-text-weak",
	// Pricing
	pricingSection: "py-2xl px-xl flex flex-col items-center",
	pricingTitle: "text-lg font-bold text-text text-center mb-sm",
	pricingSubtitle: "text-md text-text-weak text-center mb-xl",
	pricingGrid: "grid grid-cols-3 gap-lg max-w-2xl w-full items-start",
	pricingCard:
		"bg-white rounded-lg p-xl border border-neutral-200 flex flex-col items-center gap-md",
	pricingCardFeatured:
		"bg-primary-50 rounded-lg p-xl border border-primary flex flex-col items-center gap-md",
	pricingName: "text-md font-semibold text-text",
	pricingPrice: "text-lg font-bold text-text",
	pricingPeriod: "text-sm text-text-weak",
	pricingFeatures: "list-none flex flex-col gap-sm w-full",
	pricingFeatureItem: "text-sm text-text py-xs border-b border-neutral-100",
	pricingCta:
		"inline-flex items-center justify-center bg-transparent text-primary text-sm font-medium px-lg py-sm rounded-md border border-primary cursor-pointer w-full",
	pricingCtaFeatured:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer w-full",
	// CTA banner
	ctaBanner: "bg-primary-800 py-2xl px-xl flex flex-col items-center gap-lg text-center",
	ctaBannerTitle: "text-lg font-bold text-white",
	ctaBannerDesc: "text-md text-primary-100 max-w-2xl leading-normal",
	// Footer
	footer: "bg-neutral-900 py-xl px-xl flex flex-col gap-xl",
	footerTop: "grid grid-cols-4 gap-xl",
	footerBrand: "text-lg font-bold text-white",
	footerDesc: "text-sm text-neutral-200 leading-normal mt-sm",
	footerColumn: "flex flex-col",
	footerColumnTitle: "text-sm font-semibold text-white mb-md",
	footerColumnList: "list-none flex flex-col gap-sm",
	footerColumnLink: "text-sm text-neutral-200 no-underline",
	footerBottom: "flex justify-between items-center pt-lg border-t border-neutral-700",
	footerCopyright: "text-sm text-neutral-200",
	footerBottomLinks: "flex gap-md",
	footerBottomLink: "text-sm text-neutral-200 no-underline",
});

export const marketing: PageSpec = {
	name: "marketing",
	styleframe: styleframePage,
	styleframeShorthand: styleframeShorthandPage,
	tailwind: tailwindPage,
};
