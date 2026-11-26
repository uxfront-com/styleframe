import type { PageSpec } from "../types";

/**
 * E-commerce product listing page written three times with identical HTML structure.
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
	headerInner: string;
	logo: string;
	searchBar: string;
	searchInput: string;
	cartIcon: string;
	cartBadge: string;
	// Breadcrumbs
	breadcrumbs: string;
	breadcrumbLink: string;
	breadcrumbSep: string;
	breadcrumbCurrent: string;
	// Layout
	layout: string;
	// Filters sidebar
	sidebar: string;
	sidebarTitle: string;
	filterSection: string;
	filterLabel: string;
	filterGroup: string;
	filterCheckbox: string;
	filterCheckboxLabel: string;
	colorSwatchRow: string;
	colorSwatch: string;
	colorSwatchActive: string;
	priceRange: string;
	priceInput: string;
	priceSep: string;
	// Product grid
	main: string;
	gridHeader: string;
	gridTitle: string;
	gridCount: string;
	productGrid: string;
	productCard: string;
	productImage: string;
	productBody: string;
	productTitle: string;
	productPrice: string;
	productOldPrice: string;
	productPriceRow: string;
	productRating: string;
	ratingStar: string;
	ratingStarEmpty: string;
	ratingCount: string;
	addToCartBtn: string;
	// Pagination
	pagination: string;
	pageBtn: string;
	pageBtnActive: string;
	pageBtnDisabled: string;
	// Cart summary
	cartSummary: string;
	cartSummaryTitle: string;
	cartSummaryRow: string;
	cartSummaryLabel: string;
	cartSummaryValue: string;
	cartSummaryDivider: string;
	cartSummaryTotal: string;
	cartSummaryTotalValue: string;
	checkoutBtn: string;
	continueBtn: string;
	// Footer
	footer: string;
	footerLinks: string;
	footerLink: string;
	footerText: string;
}): string {
	return `<div class="${c.body}">
  <!-- Header -->
  <header class="${c.header}">
    <div class="${c.headerInner}">
      <div class="${c.logo}">ShopFrame</div>
      <div class="${c.searchBar}">
        <input type="text" class="${c.searchInput}" placeholder="Search products..." />
      </div>
      <div class="${c.cartIcon}">
        <span>Cart</span>
        <span class="${c.cartBadge}">3</span>
      </div>
    </div>
  </header>

  <!-- Breadcrumbs -->
  <nav class="${c.breadcrumbs}">
    <a href="#" class="${c.breadcrumbLink}">Home</a>
    <span class="${c.breadcrumbSep}">/</span>
    <a href="#" class="${c.breadcrumbLink}">Electronics</a>
    <span class="${c.breadcrumbSep}">/</span>
    <span class="${c.breadcrumbCurrent}">Headphones</span>
  </nav>

  <div class="${c.layout}">
    <!-- Filters sidebar -->
    <aside class="${c.sidebar}">
      <div class="${c.sidebarTitle}">Filters</div>

      <div class="${c.filterSection}">
        <div class="${c.filterLabel}">Price Range</div>
        <div class="${c.priceRange}">
          <input type="text" class="${c.priceInput}" placeholder="$0" />
          <span class="${c.priceSep}">—</span>
          <input type="text" class="${c.priceInput}" placeholder="$500" />
        </div>
      </div>

      <div class="${c.filterSection}">
        <div class="${c.filterLabel}">Category</div>
        <div class="${c.filterGroup}">
          <label class="${c.filterCheckbox}"><input type="checkbox" /><span class="${c.filterCheckboxLabel}">Over-ear</span></label>
          <label class="${c.filterCheckbox}"><input type="checkbox" /><span class="${c.filterCheckboxLabel}">On-ear</span></label>
          <label class="${c.filterCheckbox}"><input type="checkbox" /><span class="${c.filterCheckboxLabel}">In-ear</span></label>
          <label class="${c.filterCheckbox}"><input type="checkbox" /><span class="${c.filterCheckboxLabel}">Wireless</span></label>
          <label class="${c.filterCheckbox}"><input type="checkbox" /><span class="${c.filterCheckboxLabel}">Noise-canceling</span></label>
        </div>
      </div>

      <div class="${c.filterSection}">
        <div class="${c.filterLabel}">Color</div>
        <div class="${c.colorSwatchRow}">
          <div class="${c.colorSwatchActive}"></div>
          <div class="${c.colorSwatch}"></div>
          <div class="${c.colorSwatch}"></div>
          <div class="${c.colorSwatch}"></div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="${c.main}">
      <div class="${c.gridHeader}">
        <h1 class="${c.gridTitle}">Headphones</h1>
        <span class="${c.gridCount}">128 products</span>
      </div>

      <!-- Product grid -->
      <div class="${c.productGrid}">
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">Studio Pro Wireless</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$349.99</span>
              <span class="${c.productOldPrice}">$399.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingCount}">(142)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">AirMax Comfort</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$199.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingCount}">(87)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">BassBoost 500</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$129.99</span>
              <span class="${c.productOldPrice}">$159.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingCount}">(56)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">ClearSound NC</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$279.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingCount}">(203)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">FitSport Earbuds</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$89.99</span>
              <span class="${c.productOldPrice}">$119.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingCount}">(318)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">RetroWave Classic</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$149.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingCount}">(74)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">UltraSlim Fold</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$229.99</span>
              <span class="${c.productOldPrice}">$269.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingCount}">(165)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">KidSafe Junior</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$49.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingCount}">(412)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
        <div class="${c.productCard}">
          <div class="${c.productImage}"></div>
          <div class="${c.productBody}">
            <div class="${c.productTitle}">ProGamer X7</div>
            <div class="${c.productPriceRow}">
              <span class="${c.productPrice}">$179.99</span>
              <span class="${c.productOldPrice}">$219.99</span>
            </div>
            <div class="${c.productRating}"><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStar}">★</span><span class="${c.ratingStarEmpty}">★</span><span class="${c.ratingCount}">(289)</span></div>
            <button class="${c.addToCartBtn}">Add to cart</button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav class="${c.pagination}">
        <button class="${c.pageBtnDisabled}">Prev</button>
        <button class="${c.pageBtnActive}">1</button>
        <button class="${c.pageBtn}">2</button>
        <button class="${c.pageBtn}">3</button>
        <button class="${c.pageBtn}">4</button>
        <button class="${c.pageBtn}">5</button>
        <button class="${c.pageBtn}">Next</button>
      </nav>
    </main>
  </div>

  <!-- Cart summary -->
  <div class="${c.cartSummary}">
    <div class="${c.cartSummaryTitle}">Cart Summary</div>
    <div class="${c.cartSummaryRow}">
      <span class="${c.cartSummaryLabel}">Items</span>
      <span class="${c.cartSummaryValue}">3</span>
    </div>
    <div class="${c.cartSummaryRow}">
      <span class="${c.cartSummaryLabel}">Shipping</span>
      <span class="${c.cartSummaryValue}">Free</span>
    </div>
    <div class="${c.cartSummaryDivider}"></div>
    <div class="${c.cartSummaryRow}">
      <span class="${c.cartSummaryTotal}">Subtotal</span>
      <span class="${c.cartSummaryTotalValue}">$629.97</span>
    </div>
    <button class="${c.checkoutBtn}">Checkout</button>
    <button class="${c.continueBtn}">Continue shopping</button>
  </div>

  <!-- Footer -->
  <footer class="${c.footer}">
    <div class="${c.footerText}">&copy; 2026 ShopFrame Inc.</div>
    <div class="${c.footerLinks}">
      <a href="#" class="${c.footerLink}">Privacy</a>
      <a href="#" class="${c.footerLink}">Terms</a>
      <a href="#" class="${c.footerLink}">Returns</a>
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
	// Header
	header:
		"_background:surface _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	headerInner:
		"_display:flex _align-items:center _justify-content:between _padding-inline:xl _padding-block:md _max-width:2xl _margin-inline:auto _gap:lg",
	logo: "_font-size:lg _font-weight:bold _color:primary _white-space:nowrap",
	searchBar: "_display:flex _align-items:center _gap:sm",
	searchInput:
		"_padding-inline:md _padding-block:sm _border-width:thin _border-style:solid _border-color:neutral-200 _border-radius:md _font-size:sm _color:text _background:white _width:full",
	cartIcon:
		"_display:flex _align-items:center _gap:xs _cursor:pointer _color:text _font-size:sm _font-weight:medium _white-space:nowrap",
	cartBadge:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:xs _font-weight:bold _padding-inline:xs _border-radius:full _height:sm",
	// Breadcrumbs
	breadcrumbs:
		"_display:flex _align-items:center _gap:xs _padding-inline:xl _padding-block:sm _font-size:sm _background:surface _border-bottom-width:thin _border-bottom-color:neutral-100 _border-bottom-style:solid",
	breadcrumbLink: "_color:primary _text-decoration:none",
	breadcrumbSep: "_color:text-weak",
	breadcrumbCurrent: "_color:text-weak _font-weight:medium",
	// Layout
	layout:
		"_display:flex _max-width:2xl _margin-inline:auto _gap:lg _padding-block:lg _padding-inline:xl",
	// Filters sidebar
	sidebar:
		"_width:xl _display:flex _flex-direction:column _gap:lg _padding:lg _background:white _border-radius:lg _border-width:thin _border-style:solid _border-color:neutral-200 _height:full",
	sidebarTitle: "_font-size:md _font-weight:bold _color:text _margin-bottom:sm",
	filterSection:
		"_display:flex _flex-direction:column _gap:sm _padding-bottom:md _border-bottom-width:thin _border-bottom-color:neutral-100",
	filterLabel: "_font-size:sm _font-weight:semibold _color:text",
	filterGroup: "_display:flex _flex-direction:column _gap:xs",
	filterCheckbox: "_display:flex _align-items:center _gap:xs _cursor:pointer",
	filterCheckboxLabel: "_font-size:sm _color:text-weak",
	colorSwatchRow: "_display:flex _gap:sm",
	colorSwatch:
		"_width:md _height:md _border-radius:full _background:neutral-200 _cursor:pointer _border-width:thin _border-style:solid _border-color:neutral-200",
	colorSwatchActive:
		"_width:md _height:md _border-radius:full _background:primary _cursor:pointer _border-width:thin _border-style:solid _border-color:primary-700",
	priceRange: "_display:flex _align-items:center _gap:sm",
	priceInput:
		"_padding-inline:sm _padding-block:xs _border-width:thin _border-style:solid _border-color:neutral-200 _border-radius:md _font-size:sm _color:text _background:white _width:full",
	priceSep: "_color:text-weak _font-size:sm",
	// Product grid
	main: "_display:flex _flex-direction:column _gap:lg",
	gridHeader: "_display:flex _align-items:center _justify-content:between",
	gridTitle: "_font-size:lg _font-weight:bold _color:text",
	gridCount: "_font-size:sm _color:text-weak",
	productGrid: "_display:grid _grid-template-columns:3 _gap:lg",
	productCard:
		"_background:white _border-radius:lg _border-width:thin _border-style:solid _border-color:neutral-200 _overflow:hidden _display:flex _flex-direction:column",
	productImage: "_width:full _height:2xl _background:neutral-100",
	productBody: "_padding:md _display:flex _flex-direction:column _gap:xs",
	productTitle: "_font-size:sm _font-weight:semibold _color:text",
	productPrice: "_font-size:md _font-weight:bold _color:text",
	productOldPrice: "_font-size:sm _color:text-weak _text-decoration:line-through",
	productPriceRow: "_display:flex _align-items:center _gap:sm",
	productRating: "_display:flex _align-items:center _gap:xs",
	ratingStar: "_color:primary _font-size:sm",
	ratingStarEmpty: "_color:neutral-200 _font-size:sm",
	ratingCount: "_font-size:xs _color:text-weak",
	addToCartBtn:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:md _padding-block:sm _border-radius:md _border-style:none _cursor:pointer _margin-top:xs",
	// Pagination
	pagination: "_display:flex _align-items:center _justify-content:center _gap:xs",
	pageBtn:
		"_display:inline-flex _align-items:center _justify-content:center _padding-inline:sm _padding-block:xs _border-radius:md _border-width:thin _border-style:solid _border-color:neutral-200 _background:white _color:text _font-size:sm _cursor:pointer",
	pageBtnActive:
		"_display:inline-flex _align-items:center _justify-content:center _padding-inline:sm _padding-block:xs _border-radius:md _border-width:thin _border-style:solid _border-color:primary _background:primary _color:white _font-size:sm _cursor:pointer",
	pageBtnDisabled:
		"_display:inline-flex _align-items:center _justify-content:center _padding-inline:sm _padding-block:xs _border-radius:md _border-width:thin _border-style:solid _border-color:neutral-200 _background:neutral-50 _color:text-weak _font-size:sm _opacity:50 _cursor:pointer",
	// Cart summary
	cartSummary:
		"_position:fixed _background:white _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:sm _width:xl",
	cartSummaryTitle: "_font-size:md _font-weight:bold _color:text _margin-bottom:xs",
	cartSummaryRow: "_display:flex _justify-content:between _align-items:center",
	cartSummaryLabel: "_font-size:sm _color:text-weak",
	cartSummaryValue: "_font-size:sm _color:text _font-weight:medium",
	cartSummaryDivider:
		"_border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	cartSummaryTotal: "_font-size:sm _font-weight:bold _color:text",
	cartSummaryTotalValue: "_font-size:md _font-weight:bold _color:primary",
	checkoutBtn:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer _width:full",
	continueBtn:
		"_display:inline-flex _align-items:center _justify-content:center _background:transparent _color:primary _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-width:thin _border-style:solid _border-color:primary _cursor:pointer _width:full",
	// Footer
	footer:
		"_display:flex _justify-content:between _align-items:center _padding-inline:xl _padding-block:lg _border-style:solid _border-width:thin _border-color:neutral-200 _background:surface",
	footerLinks: "_display:flex _gap:sm",
	footerLink: "_color:text-weak _text-decoration:none _font-size:sm",
	footerText: "_font-size:sm _color:text-weak",
});

// ---------------------------------------------------------------------------
// Styleframe (shorthand names)
// ---------------------------------------------------------------------------

export const styleframeShorthandPage = page({
	body: "_bg:background",
	// Header
	header:
		"_bg:surface _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	headerInner:
		"_display:flex _items:center _justify:between _px:xl _py:md _max-w:2xl _mx:auto _gap:lg",
	logo: "_text:lg _font:bold _color:primary _white-space:nowrap",
	searchBar: "_display:flex _items:center _gap:sm",
	searchInput:
		"_px:md _py:sm _border:thin _border-style:solid _border-color:neutral-200 _rounded:md _text:sm _color:text _bg:white _w:full",
	cartIcon:
		"_display:flex _items:center _gap:xs _cursor:pointer _color:text _text:sm _font:medium _white-space:nowrap",
	cartBadge:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:xs _font:bold _px:xs _rounded:full _h:sm",
	// Breadcrumbs
	breadcrumbs:
		"_display:flex _items:center _gap:xs _px:xl _py:sm _text:sm _bg:surface _border-bottom-width:thin _border-bottom-color:neutral-100 _border-bottom-style:solid",
	breadcrumbLink: "_color:primary _text-decoration:none",
	breadcrumbSep: "_color:text-weak",
	breadcrumbCurrent: "_color:text-weak _font:medium",
	// Layout
	layout: "_display:flex _max-w:2xl _mx:auto _gap:lg _py:lg _px:xl",
	// Filters sidebar
	sidebar:
		"_w:xl _display:flex _flex-direction:column _gap:lg _p:lg _bg:white _rounded:lg _border:thin _border-style:solid _border-color:neutral-200 _h:full",
	sidebarTitle: "_text:md _font:bold _color:text _mb:sm",
	filterSection:
		"_display:flex _flex-direction:column _gap:sm _pb:md _border-bottom-width:thin _border-bottom-color:neutral-100",
	filterLabel: "_text:sm _font:semibold _color:text",
	filterGroup: "_display:flex _flex-direction:column _gap:xs",
	filterCheckbox: "_display:flex _items:center _gap:xs _cursor:pointer",
	filterCheckboxLabel: "_text:sm _color:text-weak",
	colorSwatchRow: "_display:flex _gap:sm",
	colorSwatch:
		"_w:md _h:md _rounded:full _bg:neutral-200 _cursor:pointer _border:thin _border-style:solid _border-color:neutral-200",
	colorSwatchActive:
		"_w:md _h:md _rounded:full _bg:primary _cursor:pointer _border:thin _border-style:solid _border-color:primary-700",
	priceRange: "_display:flex _items:center _gap:sm",
	priceInput:
		"_px:sm _py:xs _border:thin _border-style:solid _border-color:neutral-200 _rounded:md _text:sm _color:text _bg:white _w:full",
	priceSep: "_color:text-weak _text:sm",
	// Product grid
	main: "_display:flex _flex-direction:column _gap:lg",
	gridHeader: "_display:flex _items:center _justify:between",
	gridTitle: "_text:lg _font:bold _color:text",
	gridCount: "_text:sm _color:text-weak",
	productGrid: "_display:grid _grid-cols:3 _gap:lg",
	productCard:
		"_bg:white _rounded:lg _border:thin _border-style:solid _border-color:neutral-200 _overflow:hidden _display:flex _flex-direction:column",
	productImage: "_w:full _h:2xl _bg:neutral-100",
	productBody: "_p:md _display:flex _flex-direction:column _gap:xs",
	productTitle: "_text:sm _font:semibold _color:text",
	productPrice: "_text:md _font:bold _color:text",
	productOldPrice: "_text:sm _color:text-weak _text-decoration:line-through",
	productPriceRow: "_display:flex _items:center _gap:sm",
	productRating: "_display:flex _items:center _gap:xs",
	ratingStar: "_color:primary _text:sm",
	ratingStarEmpty: "_color:neutral-200 _text:sm",
	ratingCount: "_text:xs _color:text-weak",
	addToCartBtn:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:md _py:sm _rounded:md _border-style:none _cursor:pointer _mt:xs",
	// Pagination
	pagination: "_display:flex _items:center _justify:center _gap:xs",
	pageBtn:
		"_display:inline-flex _items:center _justify:center _px:sm _py:xs _rounded:md _border:thin _border-style:solid _border-color:neutral-200 _bg:white _color:text _text:sm _cursor:pointer",
	pageBtnActive:
		"_display:inline-flex _items:center _justify:center _px:sm _py:xs _rounded:md _border:thin _border-style:solid _border-color:primary _bg:primary _color:white _text:sm _cursor:pointer",
	pageBtnDisabled:
		"_display:inline-flex _items:center _justify:center _px:sm _py:xs _rounded:md _border:thin _border-style:solid _border-color:neutral-200 _bg:neutral-50 _color:text-weak _text:sm _opacity:50 _cursor:pointer",
	// Cart summary
	cartSummary:
		"_position:fixed _bg:white _rounded:lg _p:lg _border:thin _border-style:solid _border-color:neutral-200 _display:flex _flex-direction:column _gap:sm _w:xl",
	cartSummaryTitle: "_text:md _font:bold _color:text _mb:xs",
	cartSummaryRow: "_display:flex _justify:between _items:center",
	cartSummaryLabel: "_text:sm _color:text-weak",
	cartSummaryValue: "_text:sm _color:text _font:medium",
	cartSummaryDivider:
		"_border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid",
	cartSummaryTotal: "_text:sm _font:bold _color:text",
	cartSummaryTotalValue: "_text:md _font:bold _color:primary",
	checkoutBtn:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer _w:full",
	continueBtn:
		"_display:inline-flex _items:center _justify:center _bg:transparent _color:primary _text:sm _font:medium _px:lg _py:sm _rounded:md _border:thin _border-style:solid _border-color:primary _cursor:pointer _w:full",
	// Footer
	footer:
		"_display:flex _justify:between _items:center _px:xl _py:lg _border-style:solid _border:thin _border-color:neutral-200 _bg:surface",
	footerLinks: "_display:flex _gap:sm",
	footerLink: "_color:text-weak _text-decoration:none _text:sm",
	footerText: "_text:sm _color:text-weak",
});

// ---------------------------------------------------------------------------
// Tailwind
// ---------------------------------------------------------------------------

export const tailwindPage = page({
	body: "bg-background",
	// Header
	header: "bg-surface border-b border-neutral-200",
	headerInner: "flex items-center justify-between px-xl py-md max-w-2xl mx-auto gap-lg",
	logo: "text-lg font-bold text-primary whitespace-nowrap",
	searchBar: "flex items-center gap-sm",
	searchInput: "px-md py-sm border border-neutral-200 rounded-md text-sm text-text bg-white w-full",
	cartIcon:
		"flex items-center gap-xs cursor-pointer text-text text-sm font-medium whitespace-nowrap",
	cartBadge:
		"inline-flex items-center justify-center bg-primary text-white text-xs font-bold px-xs rounded-full h-sm",
	// Breadcrumbs
	breadcrumbs:
		"flex items-center gap-xs px-xl py-sm text-sm bg-surface border-b border-neutral-100",
	breadcrumbLink: "text-primary no-underline",
	breadcrumbSep: "text-text-weak",
	breadcrumbCurrent: "text-text-weak font-medium",
	// Layout
	layout: "flex max-w-2xl mx-auto gap-lg py-lg px-xl",
	// Filters sidebar
	sidebar: "w-xl flex flex-col gap-lg p-lg bg-white rounded-lg border border-neutral-200 h-full",
	sidebarTitle: "text-md font-bold text-text mb-sm",
	filterSection: "flex flex-col gap-sm pb-md border-b border-neutral-100",
	filterLabel: "text-sm font-semibold text-text",
	filterGroup: "flex flex-col gap-xs",
	filterCheckbox: "flex items-center gap-xs cursor-pointer",
	filterCheckboxLabel: "text-sm text-text-weak",
	colorSwatchRow: "flex gap-sm",
	colorSwatch: "w-md h-md rounded-full bg-neutral-200 cursor-pointer border border-neutral-200",
	colorSwatchActive: "w-md h-md rounded-full bg-primary cursor-pointer border border-primary-700",
	priceRange: "flex items-center gap-sm",
	priceInput: "px-sm py-xs border border-neutral-200 rounded-md text-sm text-text bg-white w-full",
	priceSep: "text-text-weak text-sm",
	// Product grid
	main: "flex flex-col gap-lg",
	gridHeader: "flex items-center justify-between",
	gridTitle: "text-lg font-bold text-text",
	gridCount: "text-sm text-text-weak",
	productGrid: "grid grid-cols-3 gap-lg",
	productCard: "bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col",
	productImage: "w-full h-2xl bg-neutral-100",
	productBody: "p-md flex flex-col gap-xs",
	productTitle: "text-sm font-semibold text-text",
	productPrice: "text-md font-bold text-text",
	productOldPrice: "text-sm text-text-weak line-through",
	productPriceRow: "flex items-center gap-sm",
	productRating: "flex items-center gap-xs",
	ratingStar: "text-primary text-sm",
	ratingStarEmpty: "text-neutral-200 text-sm",
	ratingCount: "text-xs text-text-weak",
	addToCartBtn:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-md py-sm rounded-md border-0 cursor-pointer mt-xs",
	// Pagination
	pagination: "flex items-center justify-center gap-xs",
	pageBtn:
		"inline-flex items-center justify-center px-sm py-xs rounded-md border border-neutral-200 bg-white text-text text-sm cursor-pointer",
	pageBtnActive:
		"inline-flex items-center justify-center px-sm py-xs rounded-md border border-primary bg-primary text-white text-sm cursor-pointer",
	pageBtnDisabled:
		"inline-flex items-center justify-center px-sm py-xs rounded-md border border-neutral-200 bg-neutral-50 text-text-weak text-sm opacity-50 cursor-pointer",
	// Cart summary
	cartSummary: "fixed bg-white rounded-lg p-lg border border-neutral-200 flex flex-col gap-sm w-xl",
	cartSummaryTitle: "text-md font-bold text-text mb-xs",
	cartSummaryRow: "flex justify-between items-center",
	cartSummaryLabel: "text-sm text-text-weak",
	cartSummaryValue: "text-sm text-text font-medium",
	cartSummaryDivider: "border-b border-neutral-200",
	cartSummaryTotal: "text-sm font-bold text-text",
	cartSummaryTotalValue: "text-md font-bold text-primary",
	checkoutBtn:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer w-full",
	continueBtn:
		"inline-flex items-center justify-center bg-transparent text-primary text-sm font-medium px-lg py-sm rounded-md border border-primary cursor-pointer w-full",
	// Footer
	footer: "flex justify-between items-center px-xl py-lg border border-neutral-200 bg-surface",
	footerLinks: "flex gap-sm",
	footerLink: "text-text-weak no-underline text-sm",
	footerText: "text-sm text-text-weak",
});

export const ecommerce: PageSpec = {
	name: "ecommerce",
	styleframe: styleframePage,
	styleframeShorthand: styleframeShorthandPage,
	tailwind: tailwindPage,
};
