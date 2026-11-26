import type { PageSpec } from "../types";

/**
 * Dashboard page written three times with identical HTML structure.
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
	navLinkActive: string;
	navRight: string;
	navAvatar: string;
	// Layout
	layout: string;
	// Sidebar
	sidebar: string;
	sidebarLabel: string;
	sidebarList: string;
	sidebarItem: string;
	sidebarItemActive: string;
	// Main
	main: string;
	sectionTitle: string;
	// Cards
	cardGrid: string;
	card: string;
	cardTitle: string;
	cardValue: string;
	cardLabel: string;
	// Alerts
	alertSuccess: string;
	alertError: string;
	alertText: string;
	// Table
	table: string;
	tableHeader: string;
	tableRow: string;
	tableCell: string;
	tableCellBold: string;
	badge: string;
	badgeSuccess: string;
	badgeError: string;
	// Hero
	hero: string;
	heroTitle: string;
	heroDesc: string;
	heroActions: string;
	btnPrimary: string;
	btnOutline: string;
	// Form
	formGroup: string;
	formLabel: string;
	formInput: string;
	formRow: string;
	formHelp: string;
	// Chat
	chatWrap: string;
	chatBubble: string;
	chatBubbleAlt: string;
	chatText: string;
	chatMeta: string;
	// Footer
	footer: string;
	footerLink: string;
	footerText: string;
}): string {
	return `<div class="${c.body}">
  <!-- Nav -->
  <nav class="${c.nav}">
    <div class="${c.navBrand}">Acme</div>
    <ul class="${c.navLinks}">
      <li><a href="#" class="${c.navLinkActive}">Dashboard</a></li>
      <li><a href="#" class="${c.navLink}">Projects</a></li>
      <li><a href="#" class="${c.navLink}">Team</a></li>
      <li><a href="#" class="${c.navLink}">Settings</a></li>
    </ul>
    <div class="${c.navRight}">
      <div class="${c.navAvatar}"></div>
    </div>
  </nav>

  <div class="${c.layout}">
    <!-- Sidebar -->
    <aside class="${c.sidebar}">
      <div class="${c.sidebarLabel}">Workspace</div>
      <ul class="${c.sidebarList}">
        <li><a href="#" class="${c.sidebarItemActive}">Overview</a></li>
        <li><a href="#" class="${c.sidebarItem}">Analytics</a></li>
        <li><a href="#" class="${c.sidebarItem}">Reports</a></li>
        <li><a href="#" class="${c.sidebarItem}">Audit log</a></li>
      </ul>
      <div class="${c.sidebarLabel}">Account</div>
      <ul class="${c.sidebarList}">
        <li><a href="#" class="${c.sidebarItem}">Profile</a></li>
        <li><a href="#" class="${c.sidebarItem}">Billing</a></li>
        <li><a href="#" class="${c.sidebarItem}">API keys</a></li>
      </ul>
    </aside>

    <!-- Main -->
    <main class="${c.main}">
      <!-- Hero -->
      <section class="${c.hero}">
        <h1 class="${c.heroTitle}">Welcome back, Alex</h1>
        <p class="${c.heroDesc}">Here's what happened while you were away. You have 3 new notifications and 2 pending reviews.</p>
        <div class="${c.heroActions}">
          <button class="${c.btnPrimary}">View notifications</button>
          <button class="${c.btnOutline}">Go to reviews</button>
        </div>
      </section>

      <!-- Stat cards -->
      <h2 class="${c.sectionTitle}">Overview</h2>
      <div class="${c.cardGrid}">
        <div class="${c.card}"><div class="${c.cardTitle}">Revenue</div><div class="${c.cardValue}">$12,394</div><div class="${c.cardLabel}">+12% from last month</div></div>
        <div class="${c.card}"><div class="${c.cardTitle}">Users</div><div class="${c.cardValue}">1,243</div><div class="${c.cardLabel}">Active this week</div></div>
        <div class="${c.card}"><div class="${c.cardTitle}">Orders</div><div class="${c.cardValue}">892</div><div class="${c.cardLabel}">Pending fulfillment</div></div>
        <div class="${c.card}"><div class="${c.cardTitle}">Tickets</div><div class="${c.cardValue}">23</div><div class="${c.cardLabel}">Awaiting response</div></div>
      </div>

      <!-- Alerts -->
      <div class="${c.alertSuccess}"><span class="${c.alertText}">Deployment complete — your changes are live on production.</span></div>
      <div class="${c.alertError}"><span class="${c.alertText}">Webhook delivery failed after 3 retries. Check your endpoint configuration.</span></div>

      <!-- Team table -->
      <h2 class="${c.sectionTitle}">Team members</h2>
      <table class="${c.table}">
        <thead><tr>
          <th class="${c.tableHeader}">Name</th>
          <th class="${c.tableHeader}">Status</th>
          <th class="${c.tableHeader}">Role</th>
        </tr></thead>
        <tbody>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Alice Johnson</td><td class="${c.tableCell}"><span class="${c.badgeSuccess}">Active</span></td><td class="${c.tableCell}">Admin</td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Bob Smith</td><td class="${c.tableCell}"><span class="${c.badge}">Pending</span></td><td class="${c.tableCell}">Editor</td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Carol Lee</td><td class="${c.tableCell}"><span class="${c.badgeError}">Suspended</span></td><td class="${c.tableCell}">Viewer</td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Dave Kim</td><td class="${c.tableCell}"><span class="${c.badgeSuccess}">Active</span></td><td class="${c.tableCell}">Admin</td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Eve Chen</td><td class="${c.tableCell}"><span class="${c.badge}">Pending</span></td><td class="${c.tableCell}">Editor</td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Frank Wu</td><td class="${c.tableCell}"><span class="${c.badgeSuccess}">Active</span></td><td class="${c.tableCell}">Viewer</td></tr>
        </tbody>
      </table>

      <!-- Form -->
      <h2 class="${c.sectionTitle}">Create project</h2>
      <form class="${c.formGroup}">
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Project name</label>
          <input type="text" class="${c.formInput}" placeholder="My project" />
          <span class="${c.formHelp}">Choose a unique name for your project.</span>
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Description</label>
          <input type="text" class="${c.formInput}" placeholder="What is this project about?" />
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Visibility</label>
          <input type="text" class="${c.formInput}" placeholder="Public" />
          <span class="${c.formHelp}">Public projects are visible to everyone.</span>
        </div>
        <div class="${c.heroActions}">
          <button type="submit" class="${c.btnPrimary}">Create project</button>
          <button type="button" class="${c.btnOutline}">Cancel</button>
        </div>
      </form>

      <!-- Chat -->
      <h2 class="${c.sectionTitle}">Recent messages</h2>
      <div class="${c.chatWrap}">
        <div class="${c.chatBubble}"><div class="${c.chatText}">Hey team, the new API endpoint is ready for testing.</div><div class="${c.chatMeta}">Alice · 2 hours ago</div></div>
        <div class="${c.chatBubbleAlt}"><div class="${c.chatText}">Great! I'll start writing the integration tests this afternoon.</div><div class="${c.chatMeta}">Bob · 1 hour ago</div></div>
        <div class="${c.chatBubble}"><div class="${c.chatText}">I found a bug in the auth middleware — the session token isn't being refreshed correctly on mobile browsers.</div><div class="${c.chatMeta}">Carol · 45 min ago</div></div>
        <div class="${c.chatBubbleAlt}"><div class="${c.chatText}">I'll look into it. Can you share the reproduction steps?</div><div class="${c.chatMeta}">Dave · 30 min ago</div></div>
        <div class="${c.chatBubble}"><div class="${c.chatText}">Sure, I'll create a ticket with the details and link it here.</div><div class="${c.chatMeta}">Carol · 20 min ago</div></div>
      </div>
    </main>
  </div>

  <!-- Footer -->
  <footer class="${c.footer}">
    <div class="${c.footerText}">&copy; 2026 Acme Inc.</div>
    <div class="${c.navLinks}">
      <a href="#" class="${c.footerLink}">Privacy</a>
      <a href="#" class="${c.footerLink}">Terms</a>
      <a href="#" class="${c.footerLink}">Contact</a>
    </div>
  </footer>
</div>`;
}

// ---------------------------------------------------------------------------
// Styleframe (long names)
// ---------------------------------------------------------------------------

export const styleframePage = page({
	body: "_background:background",
	nav: "_display:flex _align-items:center _justify-content:between _padding-inline:xl _padding-block:md _background:surface _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	navBrand: "_font-size:lg _font-weight:bold _color:text",
	navLinks: "_display:flex _gap:sm _list-style:none",
	navLink:
		"_color:text-weak _text-decoration:none _font-size:sm _padding-inline:sm _padding-block:xs",
	navLinkActive:
		"_color:primary _text-decoration:none _font-size:sm _font-weight:medium _padding-inline:sm _padding-block:xs",
	navRight: "_display:flex _align-items:center",
	navAvatar: "_width:lg _height:lg _border-radius:full _background:primary-100",
	layout: "_display:flex",
	sidebar:
		"_width:60 _padding:lg _background:surface _border-style:solid _border-width:thin _border-color:neutral-200 _display:flex _flex-direction:column _gap:lg",
	sidebarLabel: "_font-size:xs _font-weight:semibold _color:text-weak _padding-bottom:xs",
	sidebarList: "_list-style:none _display:flex _flex-direction:column _gap:xs",
	sidebarItem:
		"_color:text-weak _text-decoration:none _font-size:sm _padding-inline:sm _padding-block:xs _border-radius:md _display:block",
	sidebarItemActive:
		"_color:primary _text-decoration:none _font-size:sm _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:md _background:primary-50 _display:block",
	main: "_padding:xl _display:flex _flex-direction:column _gap:lg",
	sectionTitle: "_font-size:lg _font-weight:bold _color:text _margin-bottom:sm",
	cardGrid: "_display:grid _grid-template-columns:4 _gap:lg",
	card: "_background:white _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:neutral-200",
	cardTitle: "_font-size:sm _color:text-weak _margin-bottom:xs",
	cardValue: "_font-size:lg _font-weight:bold _color:text",
	cardLabel: "_font-size:xs _color:text-weak _margin-top:xs",
	alertSuccess:
		"_background:success-50 _border-radius:md _padding:md _border-width:thin _border-style:solid _border-color:success",
	alertError:
		"_background:error-50 _border-radius:md _padding:md _border-width:thin _border-style:solid _border-color:error _margin-top:sm",
	alertText: "_font-size:sm _color:text",
	table:
		"_width:full _border-style:solid _border-width:thin _border-color:neutral-200 _border-radius:lg _overflow:hidden",
	tableHeader:
		"_text-align:left _font-size:xs _font-weight:semibold _color:text-weak _padding-inline:lg _padding-block:md _background:neutral-50 _border-bottom-width:thin _border-bottom-color:neutral-200",
	tableRow: "_border-bottom-width:thin _border-bottom-color:neutral-100",
	tableCell: "_padding-inline:lg _padding-block:md _font-size:sm _color:text",
	tableCellBold:
		"_padding-inline:lg _padding-block:md _font-size:sm _font-weight:medium _color:text",
	badge:
		"_display:inline-flex _font-size:xs _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:full _background:neutral-100 _color:neutral-700",
	badgeSuccess:
		"_display:inline-flex _font-size:xs _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:full _background:success-100 _color:success-700",
	badgeError:
		"_display:inline-flex _font-size:xs _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:full _background:error-100 _color:error-700",
	hero: "_background:primary-50 _border-radius:lg _padding:xl _margin-bottom:sm",
	heroTitle: "_font-size:lg _font-weight:bold _color:text _margin-bottom:xs",
	heroDesc: "_font-size:sm _color:text-weak _margin-bottom:md _line-height:normal",
	heroActions: "_display:flex _gap:sm",
	btnPrimary:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer",
	btnOutline:
		"_display:inline-flex _align-items:center _justify-content:center _background:transparent _color:primary _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-width:thin _border-style:solid _border-color:primary _cursor:pointer",
	formGroup: "_display:flex _flex-direction:column _gap:lg",
	formLabel: "_font-size:sm _font-weight:medium _color:text",
	formInput:
		"_padding-inline:md _padding-block:sm _border-width:thin _border-style:solid _border-color:neutral-200 _border-radius:md _font-size:sm _color:text _background:white",
	formRow: "_display:flex _flex-direction:column _gap:xs",
	formHelp: "_font-size:xs _color:text-weak",
	chatWrap: "_display:flex _flex-direction:column _gap:sm",
	chatBubble: "_background:neutral-50 _border-radius:lg _padding:md _max-width:2xl",
	chatBubbleAlt:
		"_background:primary-50 _border-radius:lg _padding:md _max-width:2xl _margin-inline:auto",
	chatText: "_font-size:sm _color:text _line-height:normal",
	chatMeta: "_font-size:xs _color:text-weak _margin-top:xs",
	footer:
		"_display:flex _justify-content:between _align-items:center _padding-inline:xl _padding-block:lg _border-style:solid _border-width:thin _border-color:neutral-200 _background:surface",
	footerLink: "_color:text-weak _text-decoration:none _font-size:sm",
	footerText: "_font-size:sm _color:text-weak",
});

// ---------------------------------------------------------------------------
// Styleframe (shorthand names — Tailwind-style)
// ---------------------------------------------------------------------------

export const styleframeShorthandPage = page({
	body: "_bg:background",
	nav: "_display:flex _items:center _justify:between _px:xl _py:md _bg:surface _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	navBrand: "_text:lg _font:bold _color:text",
	navLinks: "_display:flex _gap:sm _list:none",
	navLink: "_color:text-weak _text-decoration:none _text:sm _px:sm _py:xs",
	navLinkActive: "_color:primary _text-decoration:none _text:sm _font:medium _px:sm _py:xs",
	navRight: "_display:flex _items:center",
	navAvatar: "_w:lg _h:lg _rounded:full _bg:primary-100",
	layout: "_display:flex",
	sidebar:
		"_w:60 _p:lg _bg:surface _border-style:solid _border:thin _border-color:neutral-200 _display:flex _flex-direction:column _gap:lg",
	sidebarLabel: "_text:xs _font:semibold _color:text-weak _pb:xs",
	sidebarList: "_list:none _display:flex _flex-direction:column _gap:xs",
	sidebarItem:
		"_color:text-weak _text-decoration:none _text:sm _px:sm _py:xs _rounded:md _display:block",
	sidebarItemActive:
		"_color:primary _text-decoration:none _text:sm _font:medium _px:sm _py:xs _rounded:md _bg:primary-50 _display:block",
	main: "_p:xl _display:flex _flex-direction:column _gap:lg",
	sectionTitle: "_text:lg _font:bold _color:text _mb:sm",
	cardGrid: "_display:grid _grid-cols:4 _gap:lg",
	card: "_bg:white _rounded:lg _p:lg _border:thin _border-style:solid _border-color:neutral-200",
	cardTitle: "_text:sm _color:text-weak _mb:xs",
	cardValue: "_text:lg _font:bold _color:text",
	cardLabel: "_text:xs _color:text-weak _mt:xs",
	alertSuccess:
		"_bg:success-50 _rounded:md _p:md _border:thin _border-style:solid _border-color:success",
	alertError:
		"_bg:error-50 _rounded:md _p:md _border:thin _border-style:solid _border-color:error _mt:sm",
	alertText: "_text:sm _color:text",
	table:
		"_w:full _border-style:solid _border:thin _border-color:neutral-200 _rounded:lg _overflow:hidden",
	tableHeader:
		"_text-align:left _text:xs _font:semibold _color:text-weak _px:lg _py:md _bg:neutral-50 _border-bottom-width:thin _border-bottom-color:neutral-200",
	tableRow: "_border-bottom-width:thin _border-bottom-color:neutral-100",
	tableCell: "_px:lg _py:md _text:sm _color:text",
	tableCellBold: "_px:lg _py:md _text:sm _font:medium _color:text",
	badge:
		"_display:inline-flex _text:xs _font:medium _px:sm _py:xs _rounded:full _bg:neutral-100 _color:neutral-700",
	badgeSuccess:
		"_display:inline-flex _text:xs _font:medium _px:sm _py:xs _rounded:full _bg:success-100 _color:success-700",
	badgeError:
		"_display:inline-flex _text:xs _font:medium _px:sm _py:xs _rounded:full _bg:error-100 _color:error-700",
	hero: "_bg:primary-50 _rounded:lg _p:xl _mb:sm",
	heroTitle: "_text:lg _font:bold _color:text _mb:xs",
	heroDesc: "_text:sm _color:text-weak _mb:md _leading:normal",
	heroActions: "_display:flex _gap:sm",
	btnPrimary:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer",
	btnOutline:
		"_display:inline-flex _items:center _justify:center _bg:transparent _color:primary _text:sm _font:medium _px:lg _py:sm _rounded:md _border:thin _border-style:solid _border-color:primary _cursor:pointer",
	formGroup: "_display:flex _flex-direction:column _gap:lg",
	formLabel: "_text:sm _font:medium _color:text",
	formInput:
		"_px:md _py:sm _border:thin _border-style:solid _border-color:neutral-200 _rounded:md _text:sm _color:text _bg:white",
	formRow: "_display:flex _flex-direction:column _gap:xs",
	formHelp: "_text:xs _color:text-weak",
	chatWrap: "_display:flex _flex-direction:column _gap:sm",
	chatBubble: "_bg:neutral-50 _rounded:lg _p:md _max-w:2xl",
	chatBubbleAlt: "_bg:primary-50 _rounded:lg _p:md _max-w:2xl _mx:auto",
	chatText: "_text:sm _color:text _leading:normal",
	chatMeta: "_text:xs _color:text-weak _mt:xs",
	footer:
		"_display:flex _justify:between _items:center _px:xl _py:lg _border-style:solid _border:thin _border-color:neutral-200 _bg:surface",
	footerLink: "_color:text-weak _text-decoration:none _text:sm",
	footerText: "_text:sm _color:text-weak",
});

// ---------------------------------------------------------------------------
// Tailwind
// ---------------------------------------------------------------------------

export const tailwindPage = page({
	body: "bg-background",
	nav: "flex items-center justify-between px-xl py-md bg-surface border-b border-neutral-200",
	navBrand: "text-lg font-bold text-text",
	navLinks: "flex gap-sm list-none",
	navLink: "text-text-weak no-underline text-sm px-sm py-xs",
	navLinkActive: "text-primary no-underline text-sm font-medium px-sm py-xs",
	navRight: "flex items-center",
	navAvatar: "w-lg h-lg rounded-full bg-primary-100",
	layout: "flex",
	sidebar: "w-60 p-lg bg-surface border border-neutral-200 flex flex-col gap-lg",
	sidebarLabel: "text-xs font-semibold text-text-weak pb-xs",
	sidebarList: "list-none flex flex-col gap-xs",
	sidebarItem: "text-text-weak no-underline text-sm px-sm py-xs rounded-md block",
	sidebarItemActive:
		"text-primary no-underline text-sm font-medium px-sm py-xs rounded-md bg-primary-50 block",
	main: "p-xl flex flex-col gap-lg",
	sectionTitle: "text-lg font-bold text-text mb-sm",
	cardGrid: "grid grid-cols-4 gap-lg",
	card: "bg-white rounded-lg p-lg border border-neutral-200",
	cardTitle: "text-sm text-text-weak mb-xs",
	cardValue: "text-lg font-bold text-text",
	cardLabel: "text-xs text-text-weak mt-xs",
	alertSuccess: "bg-success-50 rounded-md p-md border border-success",
	alertError: "bg-error-50 rounded-md p-md border border-error mt-sm",
	alertText: "text-sm text-text",
	table: "w-full border border-neutral-200 rounded-lg overflow-hidden",
	tableHeader:
		"text-left text-xs font-semibold text-text-weak px-lg py-md bg-neutral-50 border-b border-neutral-200",
	tableRow: "border-b border-neutral-100",
	tableCell: "px-lg py-md text-sm text-text",
	tableCellBold: "px-lg py-md text-sm font-medium text-text",
	badge: "inline-flex text-xs font-medium px-sm py-xs rounded-full bg-neutral-100 text-neutral-700",
	badgeSuccess:
		"inline-flex text-xs font-medium px-sm py-xs rounded-full bg-success-100 text-success-700",
	badgeError:
		"inline-flex text-xs font-medium px-sm py-xs rounded-full bg-error-100 text-error-700",
	hero: "bg-primary-50 rounded-lg p-xl mb-sm",
	heroTitle: "text-lg font-bold text-text mb-xs",
	heroDesc: "text-sm text-text-weak mb-md leading-normal",
	heroActions: "flex gap-sm",
	btnPrimary:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer",
	btnOutline:
		"inline-flex items-center justify-center bg-transparent text-primary text-sm font-medium px-lg py-sm rounded-md border border-primary cursor-pointer",
	formGroup: "flex flex-col gap-lg",
	formLabel: "text-sm font-medium text-text",
	formInput: "px-md py-sm border border-neutral-200 rounded-md text-sm text-text bg-white",
	formRow: "flex flex-col gap-xs",
	formHelp: "text-xs text-text-weak",
	chatWrap: "flex flex-col gap-sm",
	chatBubble: "bg-neutral-50 rounded-lg p-md max-w-2xl",
	chatBubbleAlt: "bg-primary-50 rounded-lg p-md max-w-2xl mx-auto",
	chatText: "text-sm text-text leading-normal",
	chatMeta: "text-xs text-text-weak mt-xs",
	footer: "flex justify-between items-center px-xl py-lg border border-neutral-200 bg-surface",
	footerLink: "text-text-weak no-underline text-sm",
	footerText: "text-sm text-text-weak",
});

export const dashboard: PageSpec = {
	name: "dashboard",
	styleframe: styleframePage,
	styleframeShorthand: styleframeShorthandPage,
	tailwind: tailwindPage,
};
