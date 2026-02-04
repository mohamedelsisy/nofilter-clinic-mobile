/**
 * Analytics Wrapper
 * 
 * Pluggable analytics system that can be easily swapped with
 * Firebase Analytics, Segment, Mixpanel, or any other provider.
 * 
 * Current implementation: Console logging in dev, no-op in production
 * TODO: Integrate with your analytics provider (Firebase, Segment, etc.)
 */

const isDev = __DEV__;

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

interface UserTraits {
  userId?: string;
  [key: string]: any;
}

class Analytics {
  private userId: string | null = null;
  private userProperties: Record<string, any> = {};

  /**
   * Track an event
   * @param eventName - Name of the event
   * @param properties - Additional properties for the event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (isDev) {
      console.log('📊 Analytics Event:', eventName, properties);
    }
    
    // TODO: Integrate with your analytics provider
    // Example for Firebase:
    // import analytics from '@react-native-firebase/analytics';
    // analytics().logEvent(eventName, properties);
    
    // Example for Segment:
    // import analytics from '@segment/analytics-react-native';
    // analytics.track(eventName, properties);
  }

  /**
   * Identify a user
   * @param userId - Unique user identifier
   * @param traits - User traits/properties
   */
  identify(userId: string, traits?: UserTraits): void {
    this.userId = userId;
    
    if (isDev) {
      console.log('👤 Analytics Identify:', userId, traits);
    }
    
    // TODO: Integrate with your analytics provider
    // Example for Firebase:
    // import analytics from '@react-native-firebase/analytics';
    // analytics().setUserId(userId);
    // if (traits) {
    //   Object.entries(traits).forEach(([key, value]) => {
    //     analytics().setUserProperty(key, String(value));
    //   });
    // }
  }

  /**
   * Set user properties
   * @param properties - User properties to set
   */
  setUserProperties(properties: Record<string, any>): void {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (isDev) {
      console.log('🔧 Analytics User Properties:', properties);
    }
    
    // TODO: Integrate with your analytics provider
    // Example for Firebase:
    // import analytics from '@react-native-firebase/analytics';
    // Object.entries(properties).forEach(([key, value]) => {
    //   analytics().setUserProperty(key, String(value));
    // });
  }

  /**
   * Track screen view
   * @param screenName - Name of the screen
   * @param properties - Additional properties
   */
  screen(screenName: string, properties?: Record<string, any>): void {
    if (isDev) {
      console.log('📱 Analytics Screen:', screenName, properties);
    }
    
    // TODO: Integrate with your analytics provider
    // Example for Firebase:
    // import analytics from '@react-native-firebase/analytics';
    // analytics().logScreenView({
    //   screen_name: screenName,
    //   screen_class: screenName,
    //   ...properties,
    // });
  }

  /**
   * Reset analytics (e.g., on logout)
   */
  reset(): void {
    this.userId = null;
    this.userProperties = {};
    
    if (isDev) {
      console.log('🔄 Analytics Reset');
    }
    
    // TODO: Integrate with your analytics provider
    // Example for Firebase:
    // import analytics from '@react-native-firebase/analytics';
    // analytics().resetAnalyticsData();
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience exports
export const track = analytics.track.bind(analytics);
export const identify = analytics.identify.bind(analytics);
export const setUserProperties = analytics.setUserProperties.bind(analytics);
export const screen = analytics.screen.bind(analytics);
export const reset = analytics.reset.bind(analytics);

// Event names (for consistency)
export const AnalyticsEvents = {
  // App lifecycle
  APP_OPEN: 'app_open',
  APP_BACKGROUND: 'app_background',
  APP_FOREGROUND: 'app_foreground',
  
  // Language
  LANGUAGE_CHANGED: 'language_changed',
  
  // Services
  SERVICE_LIST_VIEWED: 'service_list_viewed',
  SERVICE_VIEWED: 'service_viewed',
  SERVICE_SEARCHED: 'service_searched',
  
  // Offers
  OFFER_LIST_VIEWED: 'offer_list_viewed',
  OFFER_VIEWED: 'offer_viewed',
  
  // Doctors
  DOCTOR_LIST_VIEWED: 'doctor_list_viewed',
  DOCTOR_VIEWED: 'doctor_viewed',
  
  // Blog
  BLOG_LIST_VIEWED: 'blog_list_viewed',
  BLOG_POST_VIEWED: 'blog_post_viewed',
  BLOG_SEARCHED: 'blog_searched',
  COMMENT_SUBMITTED: 'comment_submitted',
  REPLY_SUBMITTED: 'reply_submitted',
  
  // Cart & Checkout
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  CART_VIEWED: 'cart_viewed',
  COUPON_APPLIED: 'coupon_applied',
  COUPON_REMOVED: 'coupon_removed',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  PAYMENT_REDIRECT_OPENED: 'payment_redirect_opened',
  
  // Booking
  BOOKING_STARTED: 'booking_started',
  BOOKING_DEPARTMENT_SELECTED: 'booking_department_selected',
  BOOKING_DOCTOR_SELECTED: 'booking_doctor_selected',
  BOOKING_DATE_SELECTED: 'booking_date_selected',
  BOOKING_TIME_SELECTED: 'booking_time_selected',
  BOOKING_SUBMITTED: 'booking_submitted',
  BOOKING_SUCCESS: 'booking_success',
  BOOKING_FAILED: 'booking_failed',
  
  // Account
  APPOINTMENTS_VIEWED: 'appointments_viewed',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  INVOICE_VIEWED: 'invoice_viewed',
  INVOICE_PDF_DOWNLOADED: 'invoice_pdf_downloaded',
  INVOICE_PAYMENT_STARTED: 'invoice_payment_started',
  POINTS_VIEWED: 'points_viewed',
  POINTS_CARD_DOWNLOADED: 'points_card_downloaded',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  
  // Auth
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  
  // Settings
  SETTINGS_VIEWED: 'settings_viewed',
  API_URL_CHANGED: 'api_url_changed',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  NETWORK_ERROR: 'network_error',
} as const;

export default analytics;
