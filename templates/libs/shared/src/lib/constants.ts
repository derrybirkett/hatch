/**
 * API routes
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
  BILLING: {
    SUBSCRIPTIONS: '/billing/subscriptions',
    INVOICES: '/billing/invoices',
    PAYMENT_METHODS: '/billing/payment-methods',
    CHECKOUT: '/billing/checkout',
  },
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

/**
 * Application  routes
 */
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  BILLING: '/dashboard/billing',
} as const;

/**
 * Subscription plan limits
 */
export const PLAN_LIMITS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basic features', 'Community support', '1 user'],
  },
  basic: {
    name: 'Basic',
    price: 9,
    features: ['All Free features', 'Email support', 'Up to 5 users'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['All Basic features', 'Priority support', 'Unlimited users', 'Advanced analytics'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: ['All Pro features', 'Dedicated support', 'Custom integrations', 'SLA'],
  },
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Date format strings
 */
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;
