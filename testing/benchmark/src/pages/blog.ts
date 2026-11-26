import type { PageSpec } from "../types";

/**
 * Blog article page written three times with identical HTML structure.
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
	headerBrand: string;
	headerNav: string;
	headerLink: string;
	headerLinkActive: string;
	// Article layout
	articleLayout: string;
	articleMain: string;
	articleSidebar: string;
	// Article
	articleTitle: string;
	articleMeta: string;
	articleMetaLink: string;
	heroImage: string;
	articleBody: string;
	heading2: string;
	heading3: string;
	paragraph: string;
	blockquote: string;
	blockquoteText: string;
	blockquoteCite: string;
	codeBlock: string;
	orderedList: string;
	unorderedList: string;
	listItem: string;
	inlineLink: string;
	// Sidebar
	sidebarSection: string;
	sidebarTitle: string;
	relatedList: string;
	relatedItem: string;
	relatedLink: string;
	tagsList: string;
	tag: string;
	newsletterForm: string;
	newsletterLabel: string;
	newsletterDesc: string;
	newsletterInput: string;
	newsletterBtn: string;
	// Comments
	commentsSection: string;
	commentsTitle: string;
	commentsList: string;
	comment: string;
	commentHeader: string;
	commentAvatar: string;
	commentAuthor: string;
	commentDate: string;
	commentText: string;
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
      <a href="#" class="${c.headerBrand}">The Overflow</a>
      <nav class="${c.headerNav}">
        <a href="#" class="${c.headerLinkActive}">Blog</a>
        <a href="#" class="${c.headerLink}">Tutorials</a>
        <a href="#" class="${c.headerLink}">Podcast</a>
        <a href="#" class="${c.headerLink}">Newsletter</a>
        <a href="#" class="${c.headerLink}">About</a>
      </nav>
    </div>
  </header>

  <!-- Article layout -->
  <div class="${c.articleLayout}">
    <!-- Main article -->
    <article class="${c.articleMain}">
      <h1 class="${c.articleTitle}">Building Resilient Distributed Systems: Lessons from a Decade of Production Failures</h1>
      <div class="${c.articleMeta}">
        <span>By <a href="#" class="${c.articleMetaLink}">Sarah Chen</a></span>
        <span>May 14, 2026</span>
        <span>18 min read</span>
      </div>

      <div class="${c.heroImage}"></div>

      <div class="${c.articleBody}">
        <p class="${c.paragraph}">Over the past ten years, I have built and maintained distributed systems that serve millions of requests per second. Along the way, every possible thing that could go wrong did go wrong. Network partitions at the worst possible moment. Clock skew that corrupted our event ordering. A cascading failure triggered by a single misconfigured health check. Each incident taught me something that no textbook ever covered.</p>

        <p class="${c.paragraph}">This article distills those hard-won lessons into practical guidance you can apply to your own systems today. Whether you are running a handful of microservices or orchestrating thousands of containers across multiple regions, the principles remain the same.</p>

        <h2 class="${c.heading2}">Understanding Failure Modes</h2>

        <p class="${c.paragraph}">The first step toward resilience is accepting that failures are inevitable. Hardware fails. Software has bugs. Networks are unreliable. The question is not whether your system will experience failures, but how it will behave when they occur. A well-designed system degrades gracefully rather than collapsing entirely.</p>

        <p class="${c.paragraph}">In our early days, we treated every error as something to be eliminated. We added retry logic everywhere, increased timeouts, and hoped for the best. What we got instead was a system that amplified failures. A single slow database query would cause retries across dozens of services, turning a minor hiccup into a full-scale outage. We learned to <a href="#" class="${c.inlineLink}">embrace failure as a feature</a> of our architecture, not a bug to be suppressed.</p>

        <h3 class="${c.heading3}">The Retry Amplification Problem</h3>

        <p class="${c.paragraph}">When Service A retries three times against Service B, and Service B retries three times against Service C, a single failure at the bottom of the stack generates twenty-seven requests at the top. Add a few more layers and you have an exponential explosion that can bring down your entire infrastructure in seconds.</p>

        <blockquote class="${c.blockquote}">
          <p class="${c.blockquoteText}">"The most dangerous phrase in engineering is 'we've always done it this way.' Every retry policy, every timeout value, every circuit breaker threshold should be questioned regularly against your current traffic patterns."</p>
          <cite class="${c.blockquoteCite}">-- Werner Vogels, CTO of Amazon Web Services</cite>
        </blockquote>

        <p class="${c.paragraph}">The solution is to implement retry budgets. Instead of allowing each service to retry independently, you allocate a fixed retry budget across the entire call chain. If the budget is exhausted, requests fail fast rather than piling up. Combined with exponential backoff and jitter, this approach prevents the thundering herd problem that plagues most retry implementations.</p>

        <h2 class="${c.heading2}">Circuit Breakers and Bulkheads</h2>

        <p class="${c.paragraph}">Circuit breakers are one of the most effective patterns for preventing cascading failures. The concept is borrowed from electrical engineering: when a circuit detects too many failures, it trips open and stops sending requests to the failing service. After a cooldown period, it allows a small number of probe requests through to test whether the service has recovered.</p>

        <h3 class="${c.heading3}">Implementing Effective Circuit Breakers</h3>

        <p class="${c.paragraph}">A good circuit breaker implementation requires careful tuning of three parameters: the failure threshold that triggers the circuit to open, the cooldown period before allowing probe requests, and the success threshold that closes the circuit again. These values should be based on your actual traffic patterns and SLA requirements, not arbitrary defaults.</p>

        <p class="${c.paragraph}">Here is a simplified example of a circuit breaker in TypeScript:</p>

        <pre class="${c.codeBlock}"><code>class CircuitBreaker {
  private failures = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private nextAttempt = Date.now();

  async execute&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt;): Promise&lt;T&gt; {
    if (this.state === 'open') {
      if (Date.now() &lt; this.nextAttempt) {
        throw new Error('Circuit is open');
      }
      this.state = 'half-open';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}</code></pre>

        <p class="${c.paragraph}">Bulkheads complement circuit breakers by isolating different parts of your system from each other. Named after the watertight compartments in a ship's hull, bulkheads ensure that a failure in one component cannot consume all available resources and starve other components.</p>

        <h2 class="${c.heading2}">Observability and Incident Response</h2>

        <p class="${c.paragraph}">You cannot fix what you cannot see. Comprehensive observability is the foundation of any resilient system. This means structured logging, distributed tracing, and meaningful metrics at every layer of your stack. But raw data is not enough. You need dashboards that surface anomalies before they become incidents, and alerting that notifies the right people at the right time.</p>

        <h3 class="${c.heading3}">The Three Pillars of Observability</h3>

        <p class="${c.paragraph}">Modern observability rests on three complementary pillars that give you different perspectives on your system's behavior:</p>

        <ol class="${c.orderedList}">
          <li class="${c.listItem}">Structured logs provide detailed records of individual events with consistent key-value pairs for easy filtering and correlation</li>
          <li class="${c.listItem}">Distributed traces follow a single request across service boundaries, revealing latency bottlenecks and dependency failures</li>
          <li class="${c.listItem}">Metrics aggregate numerical measurements over time, enabling trend analysis, capacity planning, and threshold-based alerting</li>
          <li class="${c.listItem}">Profiling data captures runtime performance details including CPU usage, memory allocation patterns, and garbage collection pressure</li>
        </ol>

        <p class="${c.paragraph}">When building your incident response process, focus on reducing the time to detection and time to mitigation. Automated runbooks can handle common failure scenarios, freeing your on-call engineers to focus on novel problems that require human judgment.</p>

        <h2 class="${c.heading2}">Data Consistency Strategies</h2>

        <p class="${c.paragraph}">In a distributed system, maintaining strong consistency across all nodes is expensive and often unnecessary. Most applications can tolerate <a href="#" class="${c.inlineLink}">eventual consistency</a> for at least some of their data. The key is identifying which data requires strong consistency and which can be eventually consistent.</p>

        <p class="${c.paragraph}">Common strategies for managing data consistency in distributed systems include:</p>

        <ul class="${c.unorderedList}">
          <li class="${c.listItem}">Saga pattern for managing distributed transactions across multiple services without two-phase commit</li>
          <li class="${c.listItem}">Event sourcing to capture all changes as an immutable sequence of domain events</li>
          <li class="${c.listItem}">CQRS to separate read and write models, allowing each to be optimized independently</li>
          <li class="${c.listItem}">Conflict-free replicated data types for automatic conflict resolution in multi-master setups</li>
          <li class="${c.listItem}">Outbox pattern to ensure reliable event publishing alongside database writes</li>
        </ul>

        <h3 class="${c.heading3}">Choosing the Right Consistency Model</h3>

        <p class="${c.paragraph}">The choice between strong and eventual consistency should be driven by your business requirements, not your technical preferences. Financial transactions, inventory management, and user authentication typically require strong consistency. Activity feeds, analytics dashboards, and recommendation engines can usually tolerate eventual consistency without any visible impact on the user experience.</p>

        <p class="${c.paragraph}">We once spent three months building a strongly consistent <a href="#" class="${c.inlineLink}">inventory system</a> only to discover that our business could tolerate a two-second propagation delay. That realization allowed us to simplify our architecture dramatically, reducing our operational burden and improving both throughput and availability.</p>

        <h2 class="${c.heading2}">Looking Forward</h2>

        <p class="${c.paragraph}">Building resilient distributed systems is a journey, not a destination. As your system grows and evolves, new failure modes will emerge that you never anticipated. The best thing you can do is cultivate a culture of learning from failures, invest in observability, and practice incident response regularly through game days and chaos engineering exercises.</p>

        <p class="${c.paragraph}">Remember: the goal is not to prevent all failures, but to build systems that handle failures gracefully and recover quickly. If you take nothing else from this article, take this: the time to prepare for failure is before it happens, not during an incident at three in the morning.</p>
      </div>
    </article>

    <!-- Sidebar -->
    <aside class="${c.articleSidebar}">
      <div class="${c.sidebarSection}">
        <h3 class="${c.sidebarTitle}">Related Articles</h3>
        <ul class="${c.relatedList}">
          <li class="${c.relatedItem}"><a href="#" class="${c.relatedLink}">Microservices Communication Patterns You Should Know</a></li>
          <li class="${c.relatedItem}"><a href="#" class="${c.relatedLink}">A Practical Guide to Kubernetes Autoscaling</a></li>
          <li class="${c.relatedItem}"><a href="#" class="${c.relatedLink}">Event-Driven Architecture: Beyond the Basics</a></li>
          <li class="${c.relatedItem}"><a href="#" class="${c.relatedLink}">Database Sharding Strategies for Growing Applications</a></li>
          <li class="${c.relatedItem}"><a href="#" class="${c.relatedLink}">Zero-Downtime Deployments with Blue-Green and Canary Releases</a></li>
        </ul>
      </div>

      <div class="${c.sidebarSection}">
        <h3 class="${c.sidebarTitle}">Tags</h3>
        <div class="${c.tagsList}">
          <span class="${c.tag}">Distributed Systems</span>
          <span class="${c.tag}">Resilience</span>
          <span class="${c.tag}">Microservices</span>
          <span class="${c.tag}">Architecture</span>
          <span class="${c.tag}">DevOps</span>
          <span class="${c.tag}">Observability</span>
          <span class="${c.tag}">Circuit Breaker</span>
          <span class="${c.tag}">Incident Response</span>
        </div>
      </div>

      <div class="${c.sidebarSection}">
        <h3 class="${c.sidebarTitle}">Newsletter</h3>
        <p class="${c.newsletterDesc}">Get weekly insights on distributed systems, architecture patterns, and engineering leadership delivered to your inbox.</p>
        <form class="${c.newsletterForm}">
          <label class="${c.newsletterLabel}">Email address</label>
          <input type="email" class="${c.newsletterInput}" placeholder="you@example.com" />
          <button type="submit" class="${c.newsletterBtn}">Subscribe</button>
        </form>
      </div>
    </aside>
  </div>

  <!-- Comments -->
  <section class="${c.commentsSection}">
    <h2 class="${c.commentsTitle}">Comments (4)</h2>
    <div class="${c.commentsList}">
      <div class="${c.comment}">
        <div class="${c.commentHeader}">
          <div class="${c.commentAvatar}"></div>
          <span class="${c.commentAuthor}">Marcus Rivera</span>
          <span class="${c.commentDate}">May 15, 2026</span>
        </div>
        <p class="${c.commentText}">This is exactly what I needed to read. We recently had a cascading failure caused by retry amplification and it took us hours to figure out the root cause. The retry budget approach you describe would have prevented the entire incident. Already started implementing it in our payment service.</p>
      </div>
      <div class="${c.comment}">
        <div class="${c.commentHeader}">
          <div class="${c.commentAvatar}"></div>
          <span class="${c.commentAuthor}">Priya Sharma</span>
          <span class="${c.commentDate}">May 16, 2026</span>
        </div>
        <p class="${c.commentText}">Great article. One thing I would add is the importance of load shedding. When your system is under pressure, it is better to reject a percentage of requests quickly than to accept them all and respond slowly to everyone. We implemented priority-based load shedding last quarter and it dramatically improved our P99 latency during traffic spikes.</p>
      </div>
      <div class="${c.comment}">
        <div class="${c.commentHeader}">
          <div class="${c.commentAvatar}"></div>
          <span class="${c.commentAuthor}">James O'Brien</span>
          <span class="${c.commentDate}">May 17, 2026</span>
        </div>
        <p class="${c.commentText}">The section on observability resonated with me. We invested heavily in distributed tracing last year and it has been a game changer for debugging production issues. I would recommend anyone starting out to look into OpenTelemetry as a vendor-neutral standard for instrumentation.</p>
      </div>
      <div class="${c.comment}">
        <div class="${c.commentHeader}">
          <div class="${c.commentAvatar}"></div>
          <span class="${c.commentAuthor}">Elena Kowalski</span>
          <span class="${c.commentDate}">May 18, 2026</span>
        </div>
        <p class="${c.commentText}">I wish I had read this before our team decided to implement strong consistency everywhere. We spent months fighting latency issues before realizing that most of our data could be eventually consistent. The inventory system anecdote hits close to home. Sometimes the simplest architecture is the best one.</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="${c.footer}">
    <div class="${c.footerLinks}">
      <a href="#" class="${c.footerLink}">Privacy Policy</a>
      <a href="#" class="${c.footerLink}">Terms of Service</a>
      <a href="#" class="${c.footerLink}">Contact Us</a>
      <a href="#" class="${c.footerLink}">RSS Feed</a>
    </div>
    <div class="${c.footerText}">&copy; 2026 The Overflow. All rights reserved.</div>
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
		"_background:surface _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid _padding-block:md",
	headerInner:
		"_display:flex _align-items:center _justify-content:between _padding-inline:xl _max-width:2xl _margin-inline:auto _width:full",
	headerBrand: "_font-size:lg _font-weight:bold _color:text _text-decoration:none",
	headerNav: "_display:flex _gap:md _align-items:center",
	headerLink:
		"_color:text-weak _text-decoration:none _font-size:sm _padding-inline:sm _padding-block:xs",
	headerLinkActive:
		"_color:primary _text-decoration:none _font-size:sm _font-weight:medium _padding-inline:sm _padding-block:xs",
	// Article layout
	articleLayout:
		"_display:flex _gap:xl _padding-inline:xl _padding-block:xl _max-width:2xl _margin-inline:auto",
	articleMain: "_display:flex _flex-direction:column _gap:md",
	articleSidebar:
		"_display:flex _flex-direction:column _gap:lg _padding:lg _background:surface _border-radius:lg _border-width:thin _border-style:solid _border-color:neutral-200 _height:fit-content",
	// Article
	articleTitle: "_font-size:lg _font-weight:bold _color:text _line-height:tight",
	articleMeta: "_display:flex _gap:md _font-size:xs _color:text-weak",
	articleMetaLink: "_color:primary _text-decoration:none _font-weight:medium",
	heroImage: "_width:full _height:2xl _background:neutral-100 _border-radius:lg",
	articleBody: "_display:flex _flex-direction:column _gap:md",
	heading2: "_font-size:lg _font-weight:bold _color:text _margin-top:md",
	heading3: "_font-size:md _font-weight:semibold _color:text _margin-top:sm",
	paragraph: "_font-size:sm _color:text _line-height:normal",
	blockquote:
		"_border-style:solid _border-width:thin _border-color:primary _padding:lg _background:primary-50 _border-radius:md _margin-block:sm",
	blockquoteText: "_font-size:sm _color:text _line-height:normal _font-weight:medium",
	blockquoteCite: "_font-size:xs _color:text-weak _margin-top:sm _display:block",
	codeBlock:
		"_background:neutral-900 _color:neutral-100 _padding:lg _border-radius:md _font-size:xs _line-height:normal _overflow:auto _white-space:pre",
	orderedList:
		"_display:flex _flex-direction:column _gap:sm _padding-inline:lg _font-size:sm _color:text _line-height:normal",
	unorderedList:
		"_display:flex _flex-direction:column _gap:sm _padding-inline:lg _font-size:sm _color:text _line-height:normal _list-style:disc",
	listItem: "_font-size:sm _color:text _line-height:normal",
	inlineLink: "_color:primary _text-decoration:underline _font-weight:medium",
	// Sidebar
	sidebarSection: "_display:flex _flex-direction:column _gap:sm",
	sidebarTitle: "_font-size:md _font-weight:bold _color:text",
	relatedList: "_display:flex _flex-direction:column _gap:xs _list-style:none",
	relatedItem:
		"_padding-block:xs _border-bottom-width:thin _border-bottom-color:neutral-100 _border-bottom-style:solid",
	relatedLink: "_font-size:sm _color:primary _text-decoration:none _line-height:normal",
	tagsList: "_display:flex _flex-wrap:wrap _gap:xs",
	tag: "_display:inline-flex _font-size:xs _font-weight:medium _padding-inline:sm _padding-block:xs _border-radius:full _background:neutral-100 _color:neutral-700",
	newsletterForm: "_display:flex _flex-direction:column _gap:sm",
	newsletterLabel: "_font-size:sm _font-weight:medium _color:text",
	newsletterDesc: "_font-size:xs _color:text-weak _line-height:normal",
	newsletterInput:
		"_padding-inline:md _padding-block:sm _border-width:thin _border-style:solid _border-color:neutral-200 _border-radius:md _font-size:sm _color:text _background:white",
	newsletterBtn:
		"_display:inline-flex _align-items:center _justify-content:center _background:primary _color:white _font-size:sm _font-weight:medium _padding-inline:lg _padding-block:sm _border-radius:md _border-style:none _cursor:pointer _width:full",
	// Comments
	commentsSection: "_padding-inline:xl _padding-block:xl _max-width:2xl _margin-inline:auto",
	commentsTitle: "_font-size:lg _font-weight:bold _color:text _margin-bottom:md",
	commentsList: "_display:flex _flex-direction:column _gap:lg",
	comment:
		"_background:surface _border-radius:lg _padding:lg _border-width:thin _border-style:solid _border-color:neutral-200",
	commentHeader: "_display:flex _align-items:center _gap:sm _margin-bottom:sm",
	commentAvatar: "_width:lg _height:lg _border-radius:full _background:primary-100",
	commentAuthor: "_font-size:sm _font-weight:medium _color:text",
	commentDate: "_font-size:xs _color:text-weak",
	commentText: "_font-size:sm _color:text _line-height:normal",
	// Footer
	footer:
		"_display:flex _justify-content:between _align-items:center _padding-inline:xl _padding-block:lg _border-style:solid _border-width:thin _border-color:neutral-200 _background:surface",
	footerLinks: "_display:flex _gap:md",
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
		"_bg:surface _border-bottom-width:thin _border-bottom-color:neutral-200 _border-bottom-style:solid _py:md",
	headerInner: "_display:flex _items:center _justify:between _px:xl _max-w:2xl _mx:auto _w:full",
	headerBrand: "_text:lg _font:bold _color:text _text-decoration:none",
	headerNav: "_display:flex _gap:md _items:center",
	headerLink: "_color:text-weak _text-decoration:none _text:sm _px:sm _py:xs",
	headerLinkActive: "_color:primary _text-decoration:none _text:sm _font:medium _px:sm _py:xs",
	// Article layout
	articleLayout: "_display:flex _gap:xl _px:xl _py:xl _max-w:2xl _mx:auto",
	articleMain: "_display:flex _flex-direction:column _gap:md",
	articleSidebar:
		"_display:flex _flex-direction:column _gap:lg _p:lg _bg:surface _rounded:lg _border:thin _border-style:solid _border-color:neutral-200 _h:fit-content",
	// Article
	articleTitle: "_text:lg _font:bold _color:text _leading:tight",
	articleMeta: "_display:flex _gap:md _text:xs _color:text-weak",
	articleMetaLink: "_color:primary _text-decoration:none _font:medium",
	heroImage: "_w:full _h:2xl _bg:neutral-100 _rounded:lg",
	articleBody: "_display:flex _flex-direction:column _gap:md",
	heading2: "_text:lg _font:bold _color:text _mt:md",
	heading3: "_text:md _font:semibold _color:text _mt:sm",
	paragraph: "_text:sm _color:text _leading:normal",
	blockquote:
		"_border-style:solid _border:thin _border-color:primary _p:lg _bg:primary-50 _rounded:md _my:sm",
	blockquoteText: "_text:sm _color:text _leading:normal _font:medium",
	blockquoteCite: "_text:xs _color:text-weak _mt:sm _display:block",
	codeBlock:
		"_bg:neutral-900 _color:neutral-100 _p:lg _rounded:md _text:xs _leading:normal _overflow:auto _white-space:pre",
	orderedList:
		"_display:flex _flex-direction:column _gap:sm _px:lg _text:sm _color:text _leading:normal",
	unorderedList:
		"_display:flex _flex-direction:column _gap:sm _px:lg _text:sm _color:text _leading:normal _list:disc",
	listItem: "_text:sm _color:text _leading:normal",
	inlineLink: "_color:primary _text-decoration:underline _font:medium",
	// Sidebar
	sidebarSection: "_display:flex _flex-direction:column _gap:sm",
	sidebarTitle: "_text:md _font:bold _color:text",
	relatedList: "_display:flex _flex-direction:column _gap:xs _list:none",
	relatedItem:
		"_py:xs _border-bottom-width:thin _border-bottom-color:neutral-100 _border-bottom-style:solid",
	relatedLink: "_text:sm _color:primary _text-decoration:none _leading:normal",
	tagsList: "_display:flex _flex-wrap:wrap _gap:xs",
	tag: "_display:inline-flex _text:xs _font:medium _px:sm _py:xs _rounded:full _bg:neutral-100 _color:neutral-700",
	newsletterForm: "_display:flex _flex-direction:column _gap:sm",
	newsletterLabel: "_text:sm _font:medium _color:text",
	newsletterDesc: "_text:xs _color:text-weak _leading:normal",
	newsletterInput:
		"_px:md _py:sm _border:thin _border-style:solid _border-color:neutral-200 _rounded:md _text:sm _color:text _bg:white",
	newsletterBtn:
		"_display:inline-flex _items:center _justify:center _bg:primary _color:white _text:sm _font:medium _px:lg _py:sm _rounded:md _border-style:none _cursor:pointer _w:full",
	// Comments
	commentsSection: "_px:xl _py:xl _max-w:2xl _mx:auto",
	commentsTitle: "_text:lg _font:bold _color:text _mb:md",
	commentsList: "_display:flex _flex-direction:column _gap:lg",
	comment:
		"_bg:surface _rounded:lg _p:lg _border:thin _border-style:solid _border-color:neutral-200",
	commentHeader: "_display:flex _items:center _gap:sm _mb:sm",
	commentAvatar: "_w:lg _h:lg _rounded:full _bg:primary-100",
	commentAuthor: "_text:sm _font:medium _color:text",
	commentDate: "_text:xs _color:text-weak",
	commentText: "_text:sm _color:text _leading:normal",
	// Footer
	footer:
		"_display:flex _justify:between _items:center _px:xl _py:lg _border-style:solid _border:thin _border-color:neutral-200 _bg:surface",
	footerLinks: "_display:flex _gap:md",
	footerLink: "_color:text-weak _text-decoration:none _text:sm",
	footerText: "_text:sm _color:text-weak",
});

// ---------------------------------------------------------------------------
// Tailwind
// ---------------------------------------------------------------------------

export const tailwindPage = page({
	body: "bg-background",
	// Header
	header: "bg-surface border-b border-neutral-200 py-md",
	headerInner: "flex items-center justify-between px-xl max-w-2xl mx-auto w-full",
	headerBrand: "text-lg font-bold text-text no-underline",
	headerNav: "flex gap-md items-center",
	headerLink: "text-text-weak no-underline text-sm px-sm py-xs",
	headerLinkActive: "text-primary no-underline text-sm font-medium px-sm py-xs",
	// Article layout
	articleLayout: "flex gap-xl px-xl py-xl max-w-2xl mx-auto",
	articleMain: "flex flex-col gap-md",
	articleSidebar: "flex flex-col gap-lg p-lg bg-surface rounded-lg border border-neutral-200 h-fit",
	// Article
	articleTitle: "text-lg font-bold text-text leading-tight",
	articleMeta: "flex gap-md text-xs text-text-weak",
	articleMetaLink: "text-primary no-underline font-medium",
	heroImage: "w-full h-2xl bg-neutral-100 rounded-lg",
	articleBody: "flex flex-col gap-md",
	heading2: "text-lg font-bold text-text mt-md",
	heading3: "text-md font-semibold text-text mt-sm",
	paragraph: "text-sm text-text leading-normal",
	blockquote: "border border-primary p-lg bg-primary-50 rounded-md my-sm",
	blockquoteText: "text-sm text-text leading-normal font-medium",
	blockquoteCite: "text-xs text-text-weak mt-sm block",
	codeBlock:
		"bg-neutral-900 text-neutral-100 p-lg rounded-md text-xs leading-normal overflow-auto whitespace-pre",
	orderedList: "flex flex-col gap-sm px-lg text-sm text-text leading-normal",
	unorderedList: "flex flex-col gap-sm px-lg text-sm text-text leading-normal list-disc",
	listItem: "text-sm text-text leading-normal",
	inlineLink: "text-primary underline font-medium",
	// Sidebar
	sidebarSection: "flex flex-col gap-sm",
	sidebarTitle: "text-md font-bold text-text",
	relatedList: "flex flex-col gap-xs list-none",
	relatedItem: "py-xs border-b border-neutral-100",
	relatedLink: "text-sm text-primary no-underline leading-normal",
	tagsList: "flex flex-wrap gap-xs",
	tag: "inline-flex text-xs font-medium px-sm py-xs rounded-full bg-neutral-100 text-neutral-700",
	newsletterForm: "flex flex-col gap-sm",
	newsletterLabel: "text-sm font-medium text-text",
	newsletterDesc: "text-xs text-text-weak leading-normal",
	newsletterInput: "px-md py-sm border border-neutral-200 rounded-md text-sm text-text bg-white",
	newsletterBtn:
		"inline-flex items-center justify-center bg-primary text-white text-sm font-medium px-lg py-sm rounded-md border-0 cursor-pointer w-full",
	// Comments
	commentsSection: "px-xl py-xl max-w-2xl mx-auto",
	commentsTitle: "text-lg font-bold text-text mb-md",
	commentsList: "flex flex-col gap-lg",
	comment: "bg-surface rounded-lg p-lg border border-neutral-200",
	commentHeader: "flex items-center gap-sm mb-sm",
	commentAvatar: "w-lg h-lg rounded-full bg-primary-100",
	commentAuthor: "text-sm font-medium text-text",
	commentDate: "text-xs text-text-weak",
	commentText: "text-sm text-text leading-normal",
	// Footer
	footer: "flex justify-between items-center px-xl py-lg border border-neutral-200 bg-surface",
	footerLinks: "flex gap-md",
	footerLink: "text-text-weak no-underline text-sm",
	footerText: "text-sm text-text-weak",
});

export const blog: PageSpec = {
	name: "blog",
	styleframe: styleframePage,
	styleframeShorthand: styleframeShorthandPage,
	tailwind: tailwindPage,
};
