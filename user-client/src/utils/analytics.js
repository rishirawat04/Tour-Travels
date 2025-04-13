/**
 * Web Analytics Service Integration
 * This file provides utilities for tracking user interactions and page views
 */

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-MEASUREMENT_ID';

/**
 * Initialize Google Analytics
 */
export const initializeAnalytics = () => {
  // Only initialize in production or if analytics ID is provided
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    
    function gtag() {
      window.dataLayer.push(arguments);
    }
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll send page views manually
    });
    
    window.gtag = gtag;
    
    console.log('Analytics initialized');
    return true;
  }
  
  console.log('Analytics not initialized (development mode)');
  return false;
};

/**
 * Track a page view
 * @param {string} path - Current page path
 * @param {string} title - Page title
 */
export const trackPageView = (path, title) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

/**
 * Track user interaction event
 * @param {string} category - Event category (e.g., 'Engagement', 'Tour', 'User')
 * @param {string} action - Event action (e.g., 'Click', 'Submit', 'View')
 * @param {string} label - Event label (e.g., 'Tour Package', 'Signup Form')
 * @param {Object} additionalParams - Any additional parameters to track
 */
export const trackEvent = (category, action, label, additionalParams = {}) => {
  if (!window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    ...additionalParams,
  });
};

/**
 * Track user conversion (e.g., booking completion, signup)
 * @param {string} conversionId - Conversion ID
 * @param {string} label - Conversion label
 * @param {number} value - Conversion value
 */
export const trackConversion = (conversionId, label, value) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/${conversionId}`,
    value: value,
    currency: 'INR',
    transaction_id: '',
  });
};

/**
 * Set user properties
 * @param {string} userId - User ID
 * @param {Object} properties - User properties
 */
export const setUserProperties = (userId, properties = {}) => {
  if (!window.gtag) return;
  
  window.gtag('set', 'user_properties', properties);
  window.gtag('set', 'user_id', userId);
};

export default {
  initialize: initializeAnalytics,
  pageView: trackPageView,
  event: trackEvent,
  conversion: trackConversion,
  setUserProperties: setUserProperties
}; 