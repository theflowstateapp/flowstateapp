// Force Node.js runtime and avoid static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

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
                <h1>From scattered to scheduled in 90 seconds.</h1>
                <p class="subtitle">Capture naturally. We auto-sort with PARA and time-box your week.</p>
                
                <div class="cta-buttons">
                    <a href="/api/demo/access?utm_source=home-hero" class="btn btn-primary">Open Interactive Demo</a>
                    <a href="/api/demo/static?utm_source=home-hero" class="btn btn-secondary">See Static Preview</a>
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
                        <p>See your week at a glance with intelligent task suggestions and time blocks</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">✍️</div>
                        <h3>Capture</h3>
                        <p>Type naturally in plain language. AI understands context and urgency</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">🗂️</div>
                        <h3>Organize</h3>
                        <p>Auto-sorted with PARA methodology: Projects, Areas, Resources, Archives</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">📅</div>
                        <h3>Plan</h3>
                        <p>Intelligent time-boxing suggests optimal slots based on your patterns</p>
                    </div>
                    <div class="step">
                        <div class="step-icon">🔄</div>
                        <h3>Review</h3>
                        <p>Weekly insights and automated planning for the next week</p>
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
                        <p>Natural language processing understands context, priority, and estimates time automatically</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📋</div>
                        <h3>Tasks (Board/List/Calendar)</h3>
                        <p>Multiple views for different workflows. Drag-and-drop scheduling with consistent chips</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔥</div>
                        <h3>Habits (90-day heatmap)</h3>
                        <p>Visual progress tracking with streak visualization and weekly target badges</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Weekly Review (Plan next week)</h3>
                        <p>Automated insights and intelligent scheduling for the upcoming week</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📝</div>
                        <h3>Journal & Reflection</h3>
                        <p>Daily reflection prompts and progress tracking for continuous improvement</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📅</div>
                        <h3>Week Agenda</h3>
                        <p>Calendar view with time-blocked tasks and intelligent scheduling suggestions</p>
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
                        <p>"Finally, a system that actually understands how I work. The AI capture is incredible - I just type what I'm thinking and it figures out the rest."</p>
                        <div class="testimonial-author">— Sarah K., Product Manager</div>
                    </div>
                    <div class="testimonial">
                        <p>"The PARA organization combined with time-boxing has transformed my productivity. I actually finish what I plan now."</p>
                        <div class="testimonial-author">— Rajesh M., Software Engineer</div>
                    </div>
                    <div class="testimonial">
                        <p>"Love the weekly review feature. It's like having a personal productivity coach that actually learns from my patterns."</p>
                        <div class="testimonial-author">— Priya S., Consultant</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section class="pricing">
            <div class="container">
                <h2>Simple pricing</h2>
                <div class="pricing-grid">
                    <div class="pricing-card">
                        <h3>Free</h3>
                        <div class="price">$0</div>
                        <ul>
                            <li>Unlimited tasks and projects</li>
                            <li>Basic AI capture</li>
                            <li>PARA organization</li>
                            <li>Mobile app access</li>
                            <li>Basic analytics</li>
                        </ul>
                    </div>
                    <div class="pricing-card featured">
                        <h3>Pro</h3>
                        <div class="price">$9/month</div>
                        <ul>
                            <li>Everything in Free</li>
                            <li>Advanced AI suggestions</li>
                            <li>Automated time-boxing</li>
                            <li>Weekly review insights</li>
                            <li>Habit heatmaps</li>
                            <li>Priority support</li>
                            <li>Data export</li>
                        </ul>
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
            </div>
        </div>
    </footer>
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
