// FlowState Brand Guidelines and Theme System
export const FlowStateTheme = {
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE', 
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E3A8A', // Deep Ocean - Primary
      900: '#1E40AF',
      950: '#172554'
    },
    
    // Secondary Brand Colors  
    secondary: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4', // Electric Cyan - Secondary
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
      950: '#083344'
    },
    
    // Accent Colors
    accent: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Golden Amber - Accent
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03'
    },
    
    // Neutral Colors
    neutral: {
      50: '#F8FAFC', // Pure White
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A', // Midnight
      950: '#020617'
    },
    
    // Semantic Colors
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981', // Emerald
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      950: '#022C22'
    },
    
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Amber
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03'
    },
    
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444', // Coral
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      950: '#450A0A'
    }
  },
  
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      secondary: ['Poppins', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem'
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #1E3A8A 0%, #06B6D4 100%)',
    secondary: 'linear-gradient(135deg, #06B6D4 0%, #F59E0B 100%)',
    accent: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
    neutral: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    dark: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
  }
};

// Brand Voice and Messaging
export const FlowStateBrand = {
  name: 'FlowState',
  tagline: 'Where Productivity Meets Flow',
  description: 'Transform your scattered thoughts into focused action with AI-powered life management.',
  
  messaging: {
    hero: 'Achieve Peak Performance in Every Area of Life',
    subtext: 'FlowState combines the power of AI with proven productivity methods to help you reach your flow state faster.',
    cta: 'Start Your Flow Journey',
    features: {
      ai: 'AI-Powered Intelligence',
      voice: 'Voice-First Capture',
      flow: 'Flow State Optimization',
      insights: 'Deep Life Insights'
    }
  },
  
  tone: {
    primary: 'Intelligent yet approachable',
    secondary: 'Empowering and confident',
    tertiary: 'Premium but accessible'
  }
};

export default FlowStateTheme;



