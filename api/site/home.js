// Import demo page renderers at the top
const { 
  resolveDemoPageMeta,
  renderDemoOverviewHTML,
  renderDemoTasksHTML,
  renderDemoHabitsHTML,
  renderDemoJournalHTML,
  renderDemoReviewHTML,
  renderDemoAgendaHTML,
  renderDemoSettingsHTML
} = require('../lib/demo-pages.js');

// bump this string each commit (or set via env in CI)
const BUILD_ID = process.env.SITE_BUILD_ID || new Date().toISOString();

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "OPTIONS") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("X-Served-By", "site-router");
    res.setHeader("X-Site-Build", BUILD_ID);
    res.setHeader("X-Cache-Buster", BUILD_ID);

    // Check if this is a demo route
    if (req.query.route === 'demo') {
      const page = (req.query.page || "overview").toString();
      const meta = resolveDemoPageMeta(page);
      
      try {
        let html;
        switch (page) {
          case "overview":
            html = await renderDemoOverviewHTML(meta, variant);
            break;
          case "tasks":
            html = await renderDemoTasksHTML(meta, variant);
            break;
          case "habits":
            html = await renderDemoHabitsHTML(meta, variant);
            break;
          case "journal":
            html = await renderDemoJournalHTML(meta, variant);
            break;
          case "review":
            html = await renderDemoReviewHTML(meta, variant);
            break;
          case "agenda":
            html = await renderDemoAgendaHTML(meta, variant);
            break;
          case "settings":
            html = await renderDemoSettingsHTML(meta, variant);
            break;
          default:
            html = await renderDemoOverviewHTML(meta, variant);
            break;
        }
        
        return res.status(200).send(html);
      } catch (error) {
        console.error('DEMO_ROUTER: Error rendering demo page:', error);
        const canonical = `https://theflowstateapp.com${meta.canonicalPath}`;
        const title = meta.title || "FlowState Demo";
        const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${canonical}">
    <style>
        body { font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px; }
    </style>
</head>
<body>
    <h1>Demo Temporarily Unavailable</h1>
    <div class="error">
        <strong>Error:</strong> We're experiencing technical difficulties. Please try again in a moment.
    </div>
    <a href="/api/demo/access" class="cta-button">Open Interactive Demo</a>
    <a href="/api/demo/static" class="cta-button">See Static Preview</a>
    <small style="display: block; margin-top: 20px; color: #64748b;">Build: ${BUILD_ID}</small>
</body>
</html>`;
        return res.status(200).send(fallbackHtml);
      }
    }

    // Default: Return the marketing homepage HTML
    // A/B variant logic
    const variant = req.query.v || "1";
    const isVariant2 = variant === "2";
    
    // Hero copy variants
    const heroCopy = isVariant2 ? {
      h1: "Type what you need. We schedule it for you.",
      subtitle: "AI capture → PARA buckets → proposed time blocks — done."
    } : {
      h1: "From scattered to scheduled in 90 seconds.",
      subtitle: "Capture naturally. We auto-sort with PARA and time-box your week."
    };
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowState — AI tasking with PARA & time-boxing</title>
    <meta name="description" content="Capture in plain language. We auto-sort with PARA and schedule your week.">
    <meta name="keywords" content="productivity, AI, PARA, task management, time-boxing, GTD, Getting Things Done">
    <meta name="author" content="FlowState App">
    
    <!-- Open Graph -->
    <meta property="og:title" content="FlowState — AI tasking with PARA & time-boxing">
    <meta property="og:description" content="Capture in plain language. We auto-sort with PARA and schedule your week.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://theflowstateapp.com/">
    <meta property="og:image" content="https://theflowstateapp.com/og.svg">
    <meta property="og:site_name" content="FlowState">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="FlowState — AI tasking with PARA & time-boxing">
    <meta name="twitter:description" content="Capture in plain language. We auto-sort with PARA and schedule your week.">
    <meta name="twitter:image" content="https://theflowstateapp.com/og.svg">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://theflowstateapp.com/">
    
    <!-- JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "FlowState",
      "description": "AI-powered productivity platform implementing PARA methodology with automatic time-boxing",
      "url": "https://theflowstateapp.com",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FlowState",
        "url": "https://theflowstateapp.com"
      }
    }
    </script>
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            background-color: #ffffff;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 24px;
            line-height: 1.2;
        }
        
        .hero .subtitle {
            font-size: 1.5rem;
            margin-bottom: 40px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-block;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.2s ease;
            border: 2px solid transparent;
        }
        
        .btn-primary {
            background-color: #ffffff;
            color: #667eea;
        }
        
        .btn-primary:hover {
            background-color: #f8fafc;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background-color: transparent;
            color: white;
            border-color: white;
        }
        
        .btn-secondary:hover {
            background-color: white;
            color: #667eea;
        }
        
        .badges {
            display: flex;
            gap: 24px;
            justify-content: center;
            flex-wrap: wrap;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        /* How it Works */
        .how-it-works {
            padding: 80px 0;
            background-color: #f8fafc;
        }
        
        .how-it-works h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: #1e293b;
        }
        
        .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            text-align: center;
        }
        
        .step {
            padding: 20px;
        }
        
        .step-icon {
            font-size: 3rem;
            margin-bottom: 16px;
        }
        
        .step h3 {
            font-size: 1.3rem;
            margin-bottom: 12px;
            color: #1e293b;
        }
        
        .step p {
            color: #64748b;
        }
        
        /* Features */
        .features {
            padding: 80px 0;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: #1e293b;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 32px;
        }
        
        .feature-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            transition: all 0.2s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .feature-card h3 {
            font-size: 1.4rem;
            margin-bottom: 12px;
            color: #1e293b;
        }
        
        .feature-card p {
            color: #64748b;
        }
        
        /* Testimonials */
        .testimonials {
            padding: 80px 0;
            background-color: #f8fafc;
        }
        
        .testimonials h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: #1e293b;
        }
        
        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
        }
        
        .testimonial {
            background: white;
            padding: 32px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        
        .testimonial p {
            font-style: italic;
            margin-bottom: 16px;
            color: #475569;
        }
        
        .testimonial-author {
            font-weight: 600;
            color: #1e293b;
        }
        
        /* Pricing */
        .pricing {
            padding: 80px 0;
        }
        
        .pricing h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: #1e293b;
        }
        
        .pricing-kicker {
            text-align: center;
            font-size: 1rem;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .pricing-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
        }
        
        .pricing-card.featured {
            border-color: #667eea;
            transform: scale(1.05);
        }
        
        .pricing-card h3 {
            font-size: 1.5rem;
            margin-bottom: 16px;
            color: #1e293b;
        }
        
        .pricing-card .price {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 24px;
        }
        
        .pricing-card ul {
            list-style: none;
            text-align: left;
        }
        
        .pricing-card li {
            padding: 8px 0;
            color: #64748b;
        }
        
        .pricing-card li:before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            margin-right: 8px;
        }
        
        /* FAQ */
        .faq {
            padding: 80px 0;
            background-color: #f8fafc;
        }
        
        .faq h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: #1e293b;
        }
        
        .faq-list {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .faq-item {
            background: white;
            margin-bottom: 16px;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .faq-question {
            padding: 24px;
            font-weight: 600;
            color: #1e293b;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .faq-answer {
            padding: 24px;
            color: #64748b;
        }
        
        /* Footer */
        footer {
            background-color: #1e293b;
            color: white;
            padding: 60px 0 40px;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .footer-section h3 {
            margin-bottom: 20px;
            color: #f1f5f9;
        }
        
        .footer-section a {
            color: #94a3b8;
            text-decoration: none;
            display: block;
            margin-bottom: 8px;
        }
        
        .footer-section a:hover {
            color: white;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid #334155;
            color: #94a3b8;
        }
        
        /* Focus styles for accessibility */
        a:focus, button:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .hero .subtitle { font-size: 1.2rem; }
            .cta-buttons { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 300px; }
            .badges { flex-direction: column; gap: 8px; }
        }
    </style>
</head>
<body>
    <main>
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <h1>${heroCopy.h1}</h1>
                <p class="subtitle">${heroCopy.subtitle}</p>
                
                <div class="cta-buttons">
                    <a href="/api/redirect?to=demo_access&src=home-hero&v=${variant}" class="btn btn-primary">Open Interactive Demo</a>
                    <a href="/api/redirect?to=static_preview&src=home-hero&v=${variant}" class="btn btn-secondary">See Static Preview</a>
                </div>
                
                <div class="badges">
                    <span>Made for India</span>
                    <span>•</span>
                    <span>UPI/PayPal</span>
                    <span>•</span>
                    <span>Mobile-friendly</span>
                </div>
            </div>
        </section>

        <!-- How it Works -->
        <section class="how-it-works">
            <div class="container">
                <h2>How it works</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-icon">📊</div>
                        <h3>Dashboard</h3>
                        <p>See exactly what matters today.</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">✍️</div>
                        <h3>Capture</h3>
                        <p>Type in plain language — we parse intent, priority, and time.</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">🗂️</div>
                        <h3>Organize (PARA)</h3>
                        <p>Projects, Areas, Resources, Archives — auto-suggested.</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">📅</div>
                        <h3>Plan</h3>
                        <p>Accept a proposed time block or reshuffle with one tap.</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">🔄</div>
                        <h3>Review</h3>
                        <p>Weekly summary + "Plan next week" to auto time-box.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="features">
            <div class="container">
                <h2>Everything you need</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🤖</div>
                        <h3>AI Capture</h3>
                        <p>Type naturally and we parse intent, priority, and time estimates automatically.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📋</div>
                        <h3>Tasks (Board/List/Calendar)</h3>
                        <p>Switch between views seamlessly with drag-and-drop scheduling and consistent chips.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔥</div>
                        <h3>Habits (90-day heatmap)</h3>
                        <p>Visual progress tracking with streak visualization and weekly target badges.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Weekly Review (Plan next week)</h3>
                        <p>Automated insights and intelligent scheduling for the upcoming week.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📝</div>
                        <h3>Journal & Reflection</h3>
                        <p>Daily reflection prompts and progress tracking for continuous improvement.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📅</div>
                        <h3>Week Agenda</h3>
                        <p>Calendar view with time-blocked tasks and intelligent scheduling suggestions.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section class="testimonials">
            <div class="container">
                <h2>What users say</h2>
                <div class="testimonial-grid">
                    <div class="testimonial">
                        <p>"My week goes from foggy to focused in one minute."</p>
                        <div class="testimonial-author">— Priya, PM</div>
                    </div>
                    <div class="testimonial">
                        <p>"Scheduling is finally the default, not a chore."</p>
                        <div class="testimonial-author">— Alex, Founder</div>
                    </div>
                    <div class="testimonial">
                        <p>"PARA + time-boxing clicked instantly."</p>
                        <div class="testimonial-author">— Rohan, Designer</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section class="pricing">
            <div class="container">
                <p class="pricing-kicker">Simple pricing</p>
                <h2>Start free. Upgrade when you're ready.</h2>
                <div class="pricing-grid">
                    <div class="pricing-card">
                        <h3>Free</h3>
                        <ul>
                            <li>AI capture (basic)</li>
                            <li>Tasks, Board/List/Calendar</li>
                            <li>Habits (weekly target)</li>
                            <li>Journal (basic)</li>
                            <li>Weekly Review (preview)</li>
                            <li>Week Agenda (read-only)</li>
                        </ul>
                        <a href="/api/redirect?to=pricing_free&src=home-pricing&plan=free&v=${variant}" class="btn btn-primary">Open Interactive Demo</a>
                    </div>
                    <div class="pricing-card">
                        <h3>Pro (coming soon)</h3>
                        <ul>
                            <li>Advanced AI capture & PARA suggestions</li>
                            <li>Auto time-boxing + reshuffle</li>
                            <li>Habits 90-day heatmap</li>
                            <li>Weekly Review → Plan next week (auto-schedule)</li>
                            <li>Export & integrations</li>
                            <li>Priority support</li>
                        </ul>
                        <a href="/api/redirect?to=pro_waitlist&src=home-pricing&v=${variant}" class="btn btn-secondary">Join Pro waitlist</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="faq">
            <div class="container">
                <h2>Frequently asked questions</h2>
                <div class="faq-list">
                    <div class="faq-item">
                        <div class="faq-question">How is this different from a to-do app?</div>
                        <div class="faq-answer">FlowState implements the PARA methodology with AI-powered capture and intelligent time-boxing. It's not just a task list - it's a complete productivity system that learns from your patterns and suggests optimal scheduling.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Can I use it without AI?</div>
                        <div class="faq-answer">Yes! You can manually organize tasks and create time blocks. The AI features are designed to enhance your workflow, not replace your decision-making.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Does it work offline?</div>
                        <div class="faq-answer">The web app requires an internet connection for AI features and sync. We're working on offline support for core task management features.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">How is my data stored?</div>
                        <div class="faq-answer">Your data is encrypted and stored securely in Supabase. You can export all your data at any time, and we never sell or share your personal information.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">What's in Pro?</div>
                        <div class="faq-answer">Pro includes advanced AI suggestions, automated time-boxing, detailed weekly review insights, habit heatmaps, priority support, and full data export capabilities.</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Product</h3>
                    <a href="/api/demo/access">Interactive Demo</a>
                    <a href="/api/demo/static">Static Preview</a>
                    <a href="/demo">All Features</a>
                </div>
                <div class="footer-section">
                    <h3>Support</h3>
                    <a href="mailto:support@theflowstateapp.com">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
                <div class="footer-section">
                    <h3>Company</h3>
                    <a href="/about">About</a>
                    <a href="/blog">Blog</a>
                    <a href="/careers">Careers</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 FlowState. All rights reserved.</p>
                <p style="margin-top: 8px; font-size: 0.9rem; color: #64748b;">Data export and account deletion available in Settings. UPI/Razorpay (IN) & PayPal (USD) supported at launch.</p>
                <small style="color: #94a3b8;">Build: ${BUILD_ID}</small>
            </div>
        </div>
    </footer>
    
    <!-- Page view tracking pixel -->
    <img src="/api/pixel?src=home&v=${variant}" alt="" width="1" height="1" style="position:absolute;left:-9999px;" />
</body>
</html>`;

    res.status(200).send(html);

  } catch (error) {
    console.error('SITE_HOME: Error generating homepage:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>FlowState - Temporarily Unavailable</title></head>
        <body style="font-family: system-ui; text-align: center; padding: 40px;">
          <h1>Site Temporarily Unavailable</h1>
          <p>We're experiencing technical difficulties. Please try our demos:</p>
          <p><a href="/api/demo/access">Interactive Demo</a> | <a href="/api/demo/static">Static Preview</a></p>
        </body>
      </html>
    `);
  }
}
