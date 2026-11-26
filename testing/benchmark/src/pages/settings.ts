import type { PageSpec } from "../types";

/**
 * Settings page written three times with identical HTML structure.
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
	// Header
	header: string;
	breadcrumb: string;
	breadcrumbSep: string;
	breadcrumbActive: string;
	pageTitle: string;
	// Tabs
	tabBar: string;
	tab: string;
	tabActive: string;
	// Section wrapper
	section: string;
	sectionTitle: string;
	sectionDesc: string;
	// Profile
	profileHeader: string;
	avatar: string;
	avatarPlaceholder: string;
	avatarLabel: string;
	formGroup: string;
	formRow: string;
	formLabel: string;
	formInput: string;
	formTextarea: string;
	formHelp: string;
	formActions: string;
	btnPrimary: string;
	btnOutline: string;
	// Notifications
	toggleList: string;
	toggleRow: string;
	toggleInfo: string;
	toggleLabel: string;
	toggleDesc: string;
	toggleSwitch: string;
	toggleSwitchOn: string;
	// Security
	securityGrid: string;
	securityFieldGroup: string;
	twoFaRow: string;
	twoFaLabel: string;
	twoFaBadge: string;
	sessionsTitle: string;
	table: string;
	tableHeader: string;
	tableRow: string;
	tableCell: string;
	tableCellBold: string;
	btnSmOutline: string;
	// Danger zone
	dangerCard: string;
	dangerTitle: string;
	dangerText: string;
	btnDanger: string;
	// Divider
	divider: string;
	// Card wrapper
	card: string;
}): string {
	return `<div class="${c.body}">
  <!-- Header -->
  <div class="${c.header}">
    <div class="${c.breadcrumb}">
      <span>Home</span>
      <span class="${c.breadcrumbSep}">/</span>
      <span class="${c.breadcrumbActive}">Settings</span>
    </div>
    <h1 class="${c.pageTitle}">Settings</h1>
  </div>

  <!-- Tabs -->
  <div class="${c.tabBar}">
    <button class="${c.tabActive}">Profile</button>
    <button class="${c.tab}">Notifications</button>
    <button class="${c.tab}">Security</button>
    <button class="${c.tab}">Billing</button>
    <button class="${c.tab}">API</button>
  </div>

  <!-- Profile Section -->
  <div class="${c.section}">
    <h2 class="${c.sectionTitle}">Profile</h2>
    <p class="${c.sectionDesc}">Manage your public profile and personal account settings.</p>
    <div class="${c.card}">
      <div class="${c.profileHeader}">
        <div class="${c.avatar}">
          <div class="${c.avatarPlaceholder}"></div>
          <div class="${c.avatarLabel}">Change avatar</div>
        </div>
      </div>
      <div class="${c.divider}"></div>
      <form class="${c.formGroup}">
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Full name</label>
          <input type="text" class="${c.formInput}" placeholder="Alex Grozav" />
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Email address</label>
          <input type="email" class="${c.formInput}" placeholder="alex@acme.com" />
          <span class="${c.formHelp}">This email will be used for account-related notifications.</span>
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Username</label>
          <input type="text" class="${c.formInput}" placeholder="alexgrozav" />
          <span class="${c.formHelp}">Your username is visible to other team members.</span>
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Bio</label>
          <textarea class="${c.formTextarea}" placeholder="Tell us a little about yourself..."></textarea>
          <span class="${c.formHelp}">Brief description for your profile. Maximum 160 characters.</span>
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Website</label>
          <input type="url" class="${c.formInput}" placeholder="https://example.com" />
        </div>
        <div class="${c.formRow}">
          <label class="${c.formLabel}">Location</label>
          <input type="text" class="${c.formInput}" placeholder="San Francisco, CA" />
        </div>
        <div class="${c.formActions}">
          <button type="submit" class="${c.btnPrimary}">Save changes</button>
          <button type="button" class="${c.btnOutline}">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Notifications Section -->
  <div class="${c.section}">
    <h2 class="${c.sectionTitle}">Notifications</h2>
    <p class="${c.sectionDesc}">Choose how and when you want to be notified.</p>
    <div class="${c.card}">
      <div class="${c.toggleList}">
        <div class="${c.toggleRow}">
          <div class="${c.toggleInfo}">
            <div class="${c.toggleLabel}">Email notifications</div>
            <div class="${c.toggleDesc}">Receive email notifications for important account activity and updates.</div>
          </div>
          <div class="${c.toggleSwitchOn}"></div>
        </div>
        <div class="${c.divider}"></div>
        <div class="${c.toggleRow}">
          <div class="${c.toggleInfo}">
            <div class="${c.toggleLabel}">Push notifications</div>
            <div class="${c.toggleDesc}">Get push notifications on your desktop and mobile devices.</div>
          </div>
          <div class="${c.toggleSwitchOn}"></div>
        </div>
        <div class="${c.divider}"></div>
        <div class="${c.toggleRow}">
          <div class="${c.toggleInfo}">
            <div class="${c.toggleLabel}">Marketing emails</div>
            <div class="${c.toggleDesc}">Receive emails about new features, tips, and product updates.</div>
          </div>
          <div class="${c.toggleSwitch}"></div>
        </div>
        <div class="${c.divider}"></div>
        <div class="${c.toggleRow}">
          <div class="${c.toggleInfo}">
            <div class="${c.toggleLabel}">Weekly digest</div>
            <div class="${c.toggleDesc}">Get a weekly summary of your team's activity and project progress.</div>
          </div>
          <div class="${c.toggleSwitch}"></div>
        </div>
        <div class="${c.divider}"></div>
        <div class="${c.toggleRow}">
          <div class="${c.toggleInfo}">
            <div class="${c.toggleLabel}">Mentions</div>
            <div class="${c.toggleDesc}">Notify me when someone mentions me in a comment or discussion.</div>
          </div>
          <div class="${c.toggleSwitchOn}"></div>
        </div>
        <div class="${c.divider}"></div>
        <div class="${c.toggleRow}">
          <div class="${c.toggleInfo}">
            <div class="${c.toggleLabel}">Comments</div>
            <div class="${c.toggleDesc}">Notify me when someone comments on my posts or pull requests.</div>
          </div>
          <div class="${c.toggleSwitchOn}"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Security Section -->
  <div class="${c.section}">
    <h2 class="${c.sectionTitle}">Security</h2>
    <p class="${c.sectionDesc}">Manage your password, two-factor authentication, and active sessions.</p>
    <div class="${c.card}">
      <form class="${c.formGroup}">
        <div class="${c.securityGrid}">
          <div class="${c.securityFieldGroup}">
            <div class="${c.formRow}">
              <label class="${c.formLabel}">Current password</label>
              <input type="password" class="${c.formInput}" placeholder="Enter current password" />
            </div>
          </div>
          <div class="${c.securityFieldGroup}">
            <div class="${c.formRow}">
              <label class="${c.formLabel}">New password</label>
              <input type="password" class="${c.formInput}" placeholder="Enter new password" />
              <span class="${c.formHelp}">Must be at least 12 characters with one uppercase and one number.</span>
            </div>
          </div>
          <div class="${c.securityFieldGroup}">
            <div class="${c.formRow}">
              <label class="${c.formLabel}">Confirm new password</label>
              <input type="password" class="${c.formInput}" placeholder="Confirm new password" />
            </div>
          </div>
        </div>
        <div class="${c.formActions}">
          <button type="submit" class="${c.btnPrimary}">Update password</button>
        </div>
      </form>
      <div class="${c.divider}"></div>
      <div class="${c.twoFaRow}">
        <div class="${c.toggleInfo}">
          <div class="${c.twoFaLabel}">Two-factor authentication</div>
          <div class="${c.toggleDesc}">Add an extra layer of security to your account by requiring a verification code.</div>
        </div>
        <div class="${c.twoFaBadge}">Disabled</div>
        <button class="${c.btnOutline}">Enable</button>
      </div>
      <div class="${c.divider}"></div>
      <h3 class="${c.sessionsTitle}">Active sessions</h3>
      <table class="${c.table}">
        <thead><tr>
          <th class="${c.tableHeader}">Device</th>
          <th class="${c.tableHeader}">Location</th>
          <th class="${c.tableHeader}">Last active</th>
          <th class="${c.tableHeader}">Action</th>
        </tr></thead>
        <tbody>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">MacBook Pro — Chrome</td><td class="${c.tableCell}">San Francisco, US</td><td class="${c.tableCell}">Just now</td><td class="${c.tableCell}"><span class="${c.formHelp}">Current session</span></td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">iPhone 15 — Safari</td><td class="${c.tableCell}">San Francisco, US</td><td class="${c.tableCell}">2 hours ago</td><td class="${c.tableCell}"><button class="${c.btnSmOutline}">Revoke</button></td></tr>
          <tr class="${c.tableRow}"><td class="${c.tableCellBold}">Windows PC — Firefox</td><td class="${c.tableCell}">New York, US</td><td class="${c.tableCell}">3 days ago</td><td class="${c.tableCell}"><button class="${c.btnSmOutline}">Revoke</button></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Danger Zone -->
  <div class="${c.section}">
    <div class="${c.dangerCard}">
      <h2 class="${c.dangerTitle}">Delete account</h2>
      <p class="${c.dangerText}">Permanently delete your account and all associated data. This action cannot be undone and you will lose access to all projects, teams, and billing history.</p>
      <button class="${c.btnDanger}">Delete my account</button>
    </div>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------
// Styleframe (long names)
// ---------------------------------------------------------------------------

export const styleframePage = page({
	body: "_background:background _display:flex _flex-direction:column _gap:lg _padding:xl _max-width:2xl",
	header: "_display:flex _flex-direction:column _gap:xs _margin-bottom:sm",
	breadcrumb: "_display:flex _align-items:center _gap:xs _font-size:sm _color:text-weak",
	breadcrumbSep: "_color:neutral-200",
	breadcrumbActive: "_color:text _font-weight:medium",
	pageTitle: "_font-size:lg _font-weight:bold _color:text",
	tabBar:
		"_display:flex _gap:xs _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid _padding-bottom:xs",
	tab: "_font-size:sm _color:text-weak _padding-inline:md _padding-block:sm _background:transparent _border-style:none _border-radius:md _cursor:pointer",
	tabActive:
		"_font-size:sm _color:primary _font-weight:medium _padding-inline:md _padding-block:sm _background:primary-50 _border-style:none _border-radius:md _cursor:pointer",
	section: "_display:flex _flex-direction:column _gap:md",
	sectionTitle: "_font-size:lg _font-weight:bold _color:text",
	sectionDesc: "_font-size:sm _color:text-weak _line-height:normal",
	profileHeader: "_display:flex _align-items:center _gap:lg _padding-bottom:md",
	avatar: "_display:flex _align-items:center _gap:md",
	avatarPlaceholder: "_width:2xl _height:2xl _border-radius:full _background:primary-100",
	avatarLabel: "_font-size:sm _color:primary _font-weight:medium _cursor:pointer",
	card: "_background:white _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:lg",
	formGroup: "_display:flex _flex-direction:column _gap:lg",
	formRow: "_display:flex _flex-direction:column _gap:xs",
	formLabel: "_font-size:sm _font-weight:medium _color:text",
	formInput:
		"_padding-inline:md _padding-block:sm _border-width:thin _border-style:solid _border-color:neutral-200 _border-radius:md _font-size:sm _color:text _background:white",
	formTextarea:
		"_padding-inline:md _padding-block:sm _border-width:thin _border-style:solid _border-color:neutral-200 _border-radius:md _font-size:sm _color:text _background:white _height:2xl",
	formHelp: "_font-size:xs _color:text-weak",
	formActions: "_display:flex _gap:sm",
	btnPrimary:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer",
	btnOutline:
		"_display:inline-flex _align-items:center _justify-content:center _background:transparent _color:primary _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-width:thin _border-style:solid _border-color:primary _cursor:pointer",
	toggleList: "_display:flex _flex-direction:column _gap:md",
	toggleRow: "_display:flex _align-items:center _justify-content:between _gap:lg",
	toggleInfo: "_display:flex _flex-direction:column _gap:xs",
	toggleLabel: "_font-size:sm _font-weight:medium _color:text",
	toggleDesc: "_font-size:xs _color:text-weak _line-height:normal",
	toggleSwitch: "_width:xl _height:md _border-radius:full _background:neutral-200 _cursor:pointer",
	toggleSwitchOn: "_width:xl _height:md _border-radius:full _background:primary _cursor:pointer",
	securityGrid: "_display:flex _flex-direction:column _gap:lg",
	securityFieldGroup: "_display:flex _flex-direction:column _gap:xs",
	twoFaRow: "_display:flex _align-items:center _justify-content:between _gap:lg",
	twoFaLabel: "_font-size:sm _font-weight:medium _color:text",
	twoFaBadge:
		"_display:inline-flex _font-size:xs _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:full _background:neutral-100 _color:neutral-700",
	sessionsTitle: "_font-size:md _font-weight:semibold _color:text _margin-bottom:sm",
	table:
		"_width:full _border-style:solid _border-width:thin _border-color:neutral-200 _border-radius:lg _overflow:hidden",
	tableHeader:
		"_text-align:left _font-size:xs _font-weight:semibold _color:text-weak _padding-inline:lg _padding-block:md _background:neutral-50 _border-bottom-width:thin _border-bottom-color:neutral-200",
	tableRow: "_border-bottom-width:thin _border-bottom-color:neutral-100",
	tableCell: "_padding-inline:lg _padding-block:md _font-size:sm _color:text",
	tableCellBold:
		"_padding-inline:lg _padding-block:md _font-size:sm _font-weight:medium _color:text",
	btnSmOutline:
		"_display:inline-flex _align-items:center _justify-content:center _background:transparent _color:text-weak _font-size:xs _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:md _border-width:thin _border-style:solid _border-color:neutral-200 _cursor:pointer",
	dangerCard:
		"_background:error-50 _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:error _display:flex _flex-direction:column _gap:md",
	dangerTitle: "_font-size:lg _font-weight:bold _color:error-700",
	dangerText: "_font-size:sm _color:text _line-height:normal",
	btnDanger:
		"_display:inline-flex _align-items:center _justify-content:center _background:error _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer",
	divider: "_border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
});

// ---------------------------------------------------------------------------
// Styleframe (shorthand names)
// ---------------------------------------------------------------------------

export const styleframeShorthandPage = page({
	body: "_bg:background _display:flex _flex-direction:column _gap:lg _p:xl _max-w:2xl",
	header: "_display:flex _flex-direction:column _gap:xs _mb:sm",
	breadcrumb: "_display:flex _items:center _gap:xs _text:sm _color:text-weak",
	breadcrumbSep: "_color:neutral-200",
	breadcrumbActive: "_color:text _font:medium",
	pageTitle: "_text:lg _font:bold _color:text",
	tabBar:
		"_display:flex _gap:xs _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid _pb:xs",
	tab: "_text:sm _color:text-weak _px:md _py:sm _bg:transparent _border-style:none _rounded:md _cursor:pointer",
	tabActive:
		"_text:sm _color:primary _font:medium _px:md _py:sm _bg:primary-50 _border-style:none _rounded:md _cursor:pointer",
	section: "_display:flex _flex-direction:column _gap:md",
	sectionTitle: "_text:lg _font:bold _color:text",
	sectionDesc: "_text:sm _color:text-weak _leading:normal",
	profileHeader: "_display:flex _items:center _gap:lg _pb:md",
	avatar: "_display:flex _items:center _gap:md",
	avatarPlaceholder: "_w:2xl _h:2xl _rounded:full _bg:primary-100",
	avatarLabel: "_text:sm _color:primary _font:medium _cursor:pointer",
	card: "_bg:white _rounded:lg _p:lg _border:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:lg",
	formGroup: "_display:flex _flex-direction:column _gap:lg",
	formRow: "_display:flex _flex-direction:column _gap:xs",
	formLabel: "_text:sm _font:medium _color:text",
	formInput:
		"_px:md _py:sm _border:thin _border-style:solid _border-color:neutral-200 _rounded:md _text:sm _color:text _bg:white",
	formTextarea:
		"_px:md _py:sm _border:thin _border-style:solid _border-color:neutral-200 _rounded:md _text:sm _color:text _bg:white _h:2xl",
	formHelp: "_text:xs _color:text-weak",
	formActions: "_display:flex _gap:sm",
	btnPrimary:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer",
	btnOutline:
		"_display:inline-flex _items:center _justify:center _bg:transparent _color:primary _text:sm _font:medium _px:lg _py:sm _rounded:md _border:thin _border-style:solid _border-color:primary _cursor:pointer",
	toggleList: "_display:flex _flex-direction:column _gap:md",
	toggleRow: "_display:flex _items:center _justify:between _gap:lg",
	toggleInfo: "_display:flex _flex-direction:column _gap:xs",
	toggleLabel: "_text:sm _font:medium _color:text",
	toggleDesc: "_text:xs _color:text-weak _leading:normal",
	toggleSwitch: "_w:xl _h:md _rounded:full _bg:neutral-200 _cursor:pointer",
	toggleSwitchOn: "_w:xl _h:md _rounded:full _bg:primary _cursor:pointer",
	securityGrid: "_display:flex _flex-direction:column _gap:lg",
	securityFieldGroup: "_display:flex _flex-direction:column _gap:xs",
	twoFaRow: "_display:flex _items:center _justify:between _gap:lg",
	twoFaLabel: "_text:sm _font:medium _color:text",
	twoFaBadge:
		"_display:inline-flex _text:xs _font:medium _px:sm _py:xs _rounded:full _bg:neutral-100 _color:neutral-700",
	sessionsTitle: "_text:md _font:semibold _color:text _mb:sm",
	table:
		"_w:full _border-style:solid _border:thin _border-color:neutral-200 _rounded:lg _overflow:hidden",
	tableHeader:
		"_text-align:left _text:xs _font:semibold _color:text-weak _px:lg _py:md _bg:neutral-50 _border-bottom-width:thin _border-bottom-color:neutral-200",
	tableRow: "_border-bottom-width:thin _border-bottom-color:neutral-100",
	tableCell: "_px:lg _py:md _text:sm _color:text",
	tableCellBold: "_px:lg _py:md _text:sm _font:medium _color:text",
	btnSmOutline:
		"_display:inline-flex _items:center _justify:center _bg:transparent _color:text-weak _text:xs _font:medium _px:sm _py:xs _rounded:md _border:thin _border-style:solid _border-color:neutral-200 _cursor:pointer",
	dangerCard:
		"_bg:error-50 _rounded:lg _p:lg _border:thin _border-style:solid _border-color:error _display:flex _flex-direction:column _gap:md",
	dangerTitle: "_text:lg _font:bold _color:error-700",
	dangerText: "_text:sm _color:text _leading:normal",
	btnDanger:
		"_display:inline-flex _items:center _justify:center _bg:error _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer",
	divider: "_border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
});

// ---------------------------------------------------------------------------
// Tailwind
// ---------------------------------------------------------------------------

export const tailwindPage = page({
	body: "bg-background flex flex-col gap-lg p-xl max-w-2xl",
	header: "flex flex-col gap-xs mb-sm",
	breadcrumb: "flex items-center gap-xs text-sm text-text-weak",
	breadcrumbSep: "text-neutral-200",
	breadcrumbActive: "text-text font-medium",
	pageTitle: "text-lg font-bold text-text",
	tabBar: "flex gap-xs border-b border-neutral-200 pb-xs",
	tab: "text-sm text-text-weak px-md py-sm bg-transparent border-0 rounded-md cursor-pointer",
	tabActive:
		"text-sm text-primary font-medium px-md py-sm bg-primary-50 border-0 rounded-md cursor-pointer",
	section: "flex flex-col gap-md",
	sectionTitle: "text-lg font-bold text-text",
	sectionDesc: "text-sm text-text-weak leading-normal",
	profileHeader: "flex items-center gap-lg pb-md",
	avatar: "flex items-center gap-md",
	avatarPlaceholder: "w-2xl h-2xl rounded-full bg-primary-100",
	avatarLabel: "text-sm text-primary font-medium cursor-pointer",
	card: "bg-white rounded-lg p-lg border border-neutral-200 flex flex-col gap-lg",
	formGroup: "flex flex-col gap-lg",
	formRow: "flex flex-col gap-xs",
	formLabel: "text-sm font-medium text-text",
	formInput: "px-md py-sm border border-neutral-200 rounded-md text-sm text-text bg-white",
	formTextarea: "px-md py-sm border border-neutral-200 rounded-md text-sm text-text bg-white h-2xl",
	formHelp: "text-xs text-text-weak",
	formActions: "flex gap-sm",
	btnPrimary:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer",
	btnOutline:
		"inline-flex items-center justify-center bg-transparent text-primary text-sm font-medium px-lg py-sm rounded-md border border-primary cursor-pointer",
	toggleList: "flex flex-col gap-md",
	toggleRow: "flex items-center justify-between gap-lg",
	toggleInfo: "flex flex-col gap-xs",
	toggleLabel: "text-sm font-medium text-text",
	toggleDesc: "text-xs text-text-weak leading-normal",
	toggleSwitch: "w-xl h-md rounded-full bg-neutral-200 cursor-pointer",
	toggleSwitchOn: "w-xl h-md rounded-full bg-primary cursor-pointer",
	securityGrid: "flex flex-col gap-lg",
	securityFieldGroup: "flex flex-col gap-xs",
	twoFaRow: "flex items-center justify-between gap-lg",
	twoFaLabel: "text-sm font-medium text-text",
	twoFaBadge:
		"inline-flex text-xs font-medium px-sm py-xs rounded-full bg-neutral-100 text-neutral-700",
	sessionsTitle: "text-md font-semibold text-text mb-sm",
	table: "w-full border border-neutral-200 rounded-lg overflow-hidden",
	tableHeader:
		"text-left text-xs font-semibold text-text-weak px-lg py-md bg-neutral-50 border-b border-neutral-200",
	tableRow: "border-b border-neutral-100",
	tableCell: "px-lg py-md text-sm text-text",
	tableCellBold: "px-lg py-md text-sm font-medium text-text",
	btnSmOutline:
		"inline-flex items-center justify-center bg-transparent text-text-weak text-xs font-medium px-sm py-xs rounded-md border border-neutral-200 cursor-pointer",
	dangerCard: "bg-error-50 rounded-lg p-lg border border-error flex flex-col gap-md",
	dangerTitle: "text-lg font-bold text-error-700",
	dangerText: "text-sm text-text leading-normal",
	btnDanger:
		"inline-flex items-center justify-center bg-error text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer",
	divider: "border-b border-neutral-200",
});

export const settings: PageSpec = {
	name: "settings",
	styleframe: styleframePage,
	styleframeShorthand: styleframeShorthandPage,
	tailwind: tailwindPage,
};
