// SEO optimization utilities
export const seoConfig = {
  // Default meta tags
  defaultMeta: {
    title: 'FlowState - AI-powered productivity platform',
    description: 'Organize your life with AI-powered productivity using the P.A.R.A. method. Projects, Areas, Resources, Archives - all in one intelligent platform.',
    keywords: 'productivity, AI, P.A.R.A., task management, life organization, flow state, peak performance',
    author: 'FlowState App',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1'
  },
  
  // Page-specific SEO
  pages: {
    landing: {
      title: 'FlowState - AI-powered productivity platform',
      description: 'Transform your productivity with AI-powered organization using the P.A.R.A. method. Projects, Areas, Resources, Archives - all intelligently managed.',
      keywords: 'productivity app, AI productivity, P.A.R.A. method, task management, life organization'
    },
    login: {
      title: 'Login - FlowState',
      description: 'Sign in to your FlowState account and continue organizing your life with AI-powered productivity.',
      keywords: 'login, sign in, FlowState account, productivity platform'
    },
    register: {
      title: 'Sign Up - FlowState',
      description: 'Create your FlowState account and start organizing your life with AI-powered productivity using the P.A.R.A. method.',
      keywords: 'sign up, register, create account, FlowState, productivity platform'
    },
    dashboard: {
      title: 'Dashboard - FlowState',
      description: 'Your personal productivity dashboard. Manage projects, areas, resources, and archives with AI assistance.',
      keywords: 'dashboard, productivity dashboard, project management, life organization'
    },
    projects: {
      title: 'Projects - FlowState',
      description: 'Manage your projects with AI-powered insights and organization using the P.A.R.A. method.',
      keywords: 'projects, project management, AI insights, productivity'
    },
    areas: {
      title: 'Areas - FlowState',
      description: 'Organize your life areas with intelligent categorization and AI-powered recommendations.',
      keywords: 'life areas, organization, AI recommendations, productivity'
    },
    resources: {
      title: 'Resources - FlowState',
      description: 'Store and organize your resources with AI-powered tagging and intelligent search.',
      keywords: 'resources, resource management, AI tagging, intelligent search'
    },
    archives: {
      title: 'Archives - FlowState',
      description: 'Archive completed projects and resources with AI-powered organization and easy retrieval.',
      keywords: 'archives, completed projects, resource storage, AI organization'
    }
  }
};

// Update page title and meta tags
export const updateSEO = (pageKey, customMeta = {}) => {
  const pageSEO = seoConfig.pages[pageKey] || seoConfig.defaultMeta;
  const meta = { ...pageSEO, ...customMeta };
  
  // Update title
  document.title = meta.title;
  
  // Update meta description
  updateMetaTag('description', meta.description);
  
  // Update meta keywords
  updateMetaTag('keywords', meta.keywords);
  
  // Update meta author
  updateMetaTag('author', meta.author);
  
  // Update robots
  updateMetaTag('robots', meta.robots);
  
  // Update Open Graph tags
  updateMetaTag('og:title', meta.title, 'property');
  updateMetaTag('og:description', meta.description, 'property');
  updateMetaTag('og:type', 'website', 'property');
  updateMetaTag('og:url', window.location.href, 'property');
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', meta.title);
  updateMetaTag('twitter:description', meta.description);
};

// Helper function to update meta tags
const updateMetaTag = (name, content, attribute = 'name') => {
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
};

// Generate structured data for SEO
export const generateStructuredData = (pageData = {}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FlowState",
    "description": "AI-powered productivity platform using the P.A.R.A. method",
    "url": "https://theflowstateapp.com",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "FlowState App"
    },
    "featureList": [
      "AI-powered task management",
      "P.A.R.A. method organization",
      "Project management",
      "Resource organization",
      "Archive system",
      "Voice capture",
      "Apple Reminders integration"
    ],
    ...pageData
  };
  
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

// Generate sitemap data
export const generateSitemapData = () => {
  const baseUrl = 'https://theflowstateapp.com';
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/login', priority: '0.8', changefreq: 'monthly' },
    { url: '/register', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/dashboard', priority: '0.9', changefreq: 'daily' },
    { url: '/projects', priority: '0.8', changefreq: 'daily' },
    { url: '/areas', priority: '0.8', changefreq: 'daily' },
    { url: '/resources', priority: '0.8', changefreq: 'daily' },
    { url: '/archives', priority: '0.7', changefreq: 'weekly' }
  ];
  
  return pages.map(page => ({
    ...page,
    url: `${baseUrl}${page.url}`,
    lastmod: new Date().toISOString().split('T')[0]
  }));
};

// Initialize SEO for the app
export const initSEO = () => {
  // Set default SEO
  updateSEO('landing');
  
  // Generate initial structured data
  generateStructuredData();
  
  // Track page changes for SEO updates
  let currentPath = window.location.pathname;
  
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      updateSEOForPath(currentPath);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
};

// Update SEO based on current path
const updateSEOForPath = (path) => {
  const pathMap = {
    '/': 'landing',
    '/login': 'login',
    '/register': 'register',
    '/dashboard': 'dashboard',
    '/projects': 'projects',
    '/areas': 'areas',
    '/resources': 'resources',
    '/archives': 'archives'
  };
  
  const pageKey = pathMap[path] || 'landing';
  updateSEO(pageKey);
};
