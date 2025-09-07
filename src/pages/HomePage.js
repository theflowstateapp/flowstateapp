import React from 'react';

const HomePage = () => {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <head>
        <title>FlowState - From scattered to scheduled in 90 seconds</title>
        <meta name="description" content="Capture naturally. We auto-sort with PARA and time-box your week. AI-powered productivity platform for India." />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="FlowState - From scattered to scheduled in 90 seconds" />
        <meta property="og:description" content="Capture naturally. We auto-sort with PARA and time-box your week. AI-powered productivity platform for India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theflowstateapp.com" />
        <meta property="og:image" content="https://theflowstateapp.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FlowState - From scattered to scheduled in 90 seconds" />
        <meta name="twitter:description" content="Capture naturally. We auto-sort with PARA and time-box your week. AI-powered productivity platform for India." />
        <meta name="twitter:image" content="https://theflowstateapp.com/og-image.svg" />
      </head>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #374151; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .hero { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 80px 0; text-align: center; }
          .hero h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 24px; line-height: 1.2; }
          .hero p { font-size: 1.25rem; margin-bottom: 40px; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; }
          .cta-buttons { display: flex; gap: 16px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
          .btn { display: inline-block; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.1rem; transition: all 0.2s; border: 2px solid transparent; }
          .btn-primary { background: white; color: #3B82F6; }
          .btn-primary:hover { background: #F8FAFC; transform: translateY(-2px); }
          .btn-secondary { background: transparent; color: white; border-color: white; }
          .btn-secondary:hover { background: white; color: #3B82F6; }
          .badges { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
          .badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; }
          .section { padding: 80px 0; }
          .section h2 { font-size: 2.5rem; font-weight: 700; text-align: center; margin-bottom: 48px; color: #1F2937; }
          .how-it-works { background: #F9FAFB; }
          .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin-top: 48px; }
          .step { text-align: center; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .step-icon { font-size: 3rem; margin-bottom: 16px; display: block; }
          .step h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: #1F2937; }
          .step p { color: #6B7280; font-size: 0.9rem; }
          .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-top: 48px; }
          .feature { padding: 32px; background: white; border-radius: 12px; border: 1px solid #E5E7EB; text-align: center; }
          .feature-icon { font-size: 2.5rem; margin-bottom: 16px; display: block; }
          .feature h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 12px; color: #1F2937; }
          .feature p { color: #6B7280; line-height: 1.6; }
          .pricing { background: #F9FAFB; }
          .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-top: 48px; }
          .pricing-card { background: white; padding: 32px; border-radius: 12px; border: 2px solid #E5E7EB; text-align: center; }
          .pricing-card.featured { border-color: #3B82F6; transform: scale(1.05); }
          .pricing-card h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: #1F2937; }
          .pricing-card .price { font-size: 2.5rem; font-weight: 700; color: #3B82F6; margin-bottom: 16px; }
          .pricing-card ul { list-style: none; text-align: left; margin: 24px 0; }
          .pricing-card li { padding: 8px 0; color: #6B7280; }
          .pricing-card li::before { content: "✓ "; color: #10B981; font-weight: bold; }
          .faq { max-width: 800px; margin: 0 auto; }
          .faq-item { margin-bottom: 24px; padding: 24px; background: white; border-radius: 8px; border: 1px solid #E5E7EB; }
          .faq-item h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 12px; color: #1F2937; }
          .faq-item p { color: #6B7280; line-height: 1.6; }
          .footer { background: #1F2937; color: white; padding: 48px 0; text-align: center; }
          .footer a { color: #60A5FA; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .hero p { font-size: 1.1rem; }
            .cta-buttons { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 300px; }
            .steps { grid-template-columns: 1fr; }
            .features { grid-template-columns: 1fr; }
            .pricing-grid { grid-template-columns: 1fr; }
            .pricing-card.featured { transform: none; }
          }
        `
      }} />
      
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>From scattered to scheduled in 90 seconds.</h1>
            <p>Capture naturally. We auto-sort with PARA and time-box your week.</p>
            
            <div className="cta-buttons">
              <a href="/api/demo/access" className="btn btn-primary">Interactive Demo</a>
              <a href="/api/demo/static" className="btn btn-secondary">Static Preview</a>
            </div>
            
            <div className="badges">
              <span className="badge">Made for India</span>
              <span className="badge">UPI/PayPal</span>
              <span className="badge">Mobile-friendly</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section how-it-works">
          <div className="container">
            <h2>How it works</h2>
            <div className="steps">
              <div className="step">
                <span className="step-icon">📊</span>
                <h3>Dashboard</h3>
                <p>See your complete productivity picture at a glance</p>
              </div>
              <div className="step">
                <span className="step-icon">📝</span>
                <h3>Capture</h3>
                <p>Quickly add tasks, ideas, and thoughts with AI assistance</p>
              </div>
              <div className="step">
                <span className="step-icon">🗂️</span>
                <h3>Organize</h3>
                <p>Auto-sort using PARA methodology and priority matrix</p>
              </div>
              <div className="step">
                <span className="step-icon">📅</span>
                <h3>Plan</h3>
                <p>Time-box your week with intelligent scheduling</p>
              </div>
              <div className="step">
                <span className="step-icon">🔄</span>
                <h3>Review</h3>
                <p>Weekly reflection and continuous improvement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section">
          <div className="container">
            <h2>Everything you need to stay productive</h2>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">📋</span>
                <h3>Tasks Board & List</h3>
                <p>Visual task management with drag-and-drop boards and detailed list views</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🤖</span>
                <h3>AI Capture</h3>
                <p>Natural language processing to turn thoughts into actionable tasks</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔥</span>
                <h3>Habits & Heatmap</h3>
                <p>Track daily habits with streak counters and visual progress maps</p>
              </div>
              <div className="feature">
                <span className="feature-icon">📈</span>
                <h3>Weekly Review</h3>
                <p>Automated insights and reflection prompts for continuous improvement</p>
              </div>
              <div className="feature">
                <span className="feature-icon">📖</span>
                <h3>Journal</h3>
                <p>Daily reflection and mood tracking with AI-powered insights</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔗</span>
                <h3>Integrations</h3>
                <p>Connect with Google Calendar, Gmail, Apple Reminders, and more</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section pricing">
          <div className="container">
            <h2>Simple, transparent pricing</h2>
            <div className="pricing-grid">
              <div className="pricing-card">
                <h3>Free</h3>
                <div className="price">₹0</div>
                <ul>
                  <li>Unlimited tasks and projects</li>
                  <li>Basic habit tracking</li>
                  <li>Journal entries</li>
                  <li>Mobile app access</li>
                  <li>Community support</li>
                </ul>
              </div>
              <div className="pricing-card featured">
                <h3>Pro</h3>
                <div className="price">₹299</div>
                <p style={{color: '#6B7280', marginBottom: '16px'}}>per month</p>
                <ul>
                  <li>Everything in Free</li>
                  <li>AI-powered suggestions</li>
                  <li>Advanced analytics</li>
                  <li>Priority support</li>
                  <li>Team collaboration</li>
                  <li>Custom integrations</li>
                </ul>
              </div>
            </div>
            <p style={{textAlign: 'center', marginTop: '24px', color: '#6B7280', fontSize: '0.9rem'}}>
              UPI AutoPay & PayPal accepted • Cancel anytime
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq">
              <div className="faq-item">
                <h3>What is PARA methodology?</h3>
                <p>PARA (Projects, Areas, Resources, Archives) is a productivity system that helps you organize information by actionability. FlowState automatically sorts your tasks using this proven methodology.</p>
              </div>
              <div className="faq-item">
                <h3>How does AI assistance work?</h3>
                <p>Our AI helps you capture tasks naturally, suggests priorities based on context and deadlines, and provides intelligent scheduling recommendations for optimal productivity.</p>
              </div>
              <div className="faq-item">
                <h3>Can I use FlowState offline?</h3>
                <p>Yes! FlowState works offline on mobile devices. Your data syncs automatically when you're back online.</p>
              </div>
              <div className="faq-item">
                <h3>Is my data secure?</h3>
                <p>Absolutely. We use enterprise-grade security with end-to-end encryption. Your data is never shared with third parties.</p>
              </div>
              <div className="faq-item">
                <h3>Do you offer team plans?</h3>
                <p>Yes! Pro plans include team collaboration features. Contact us for enterprise pricing and custom solutions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            <a href="/privacy">Privacy Policy</a> • 
            <a href="/terms">Terms of Service</a> • 
            <a href="mailto:support@theflowstateapp.com">Contact Us</a>
          </p>
          <p style={{marginTop: '16px', color: '#9CA3AF'}}>
            © 2024 FlowState. Made with ❤️ in India.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;