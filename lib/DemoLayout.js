import { getSharedCSS, escapeHtml } from '../../lib/ssrHtml.js';

const DemoLayout = ({ children, title, description }) => {
  const css = getSharedCSS();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} - FlowState Demo</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index,follow">
    <meta property="og:title" content="${escapeHtml(title)} - FlowState Demo">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="https://theflowstateapp.com/og-image.svg">
    <meta property="og:url" content="https://theflowstateapp.com/demo">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)} - FlowState Demo">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="https://theflowstateapp.com/og-image.svg">
    <style>${css}</style>
</head>
<body>
    <header>
        <div class="container">
            <h1>FlowState Demo</h1>
            <div class="nav-links">
                <a href="/demo">Overview</a> | 
                <a href="/demo/tasks">Tasks</a> | 
                <a href="/demo/habits">Habits</a> | 
                <a href="/demo/journal">Journal</a> | 
                <a href="/demo/review">Review</a> | 
                <a href="/demo/agenda">Week Agenda</a> | 
                <a href="/demo/settings">Settings</a> | 
                <a href="/api/demo/access">Open Interactive Demo →</a>
            </div>
            <p><small>Read-only snapshots. Data resets periodically.</small></p>
        </div>
    </header>
    
    <main class="container">
        ${children}
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} FlowState. All rights reserved.</p>
        <p><a href="/privacy" style="color: #0284c7; text-decoration: none;">Privacy Policy</a> | 
           <a href="mailto:support@theflowstateapp.com" style="color: #0284c7; text-decoration: none;">Contact Us</a></p>
        <p><small>Data resets periodically. Demo only.</small></p>
    </footer>
</body>
</html>`;
};

export default DemoLayout;
