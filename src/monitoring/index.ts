/**
 * Error Monitoring Wrapper
 * 
 * Pluggable error monitoring system that can be easily integrated
 * with Sentry, Bugsnag, or any other error tracking service.
 * 
 * Current implementation: Console logging
 * TODO: Integrate with Sentry or your preferred error monitoring service
 */

const isDev = __DEV__;

interface ErrorContext {
  [key: string]: any;
}

class ErrorMonitoring {
  /**
   * Capture an exception
   * @param error - The error object
   * @param context - Additional context about the error
   */
  captureException(error: Error | unknown, context?: ErrorContext): void {
    if (isDev) {
      console.error('🔴 Error Captured:', error);
      if (context) {
        console.error('Context:', context);
      }
    }
    
    // TODO: Integrate with Sentry
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.captureException(error, {
    //   contexts: { custom: context },
    // });
  }

  /**
   * Capture a message (non-error event)
   * @param message - The message to capture
   * @param level - Severity level
   * @param context - Additional context
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
  ): void {
    if (isDev) {
      const emoji = level === 'error' ? '🔴' : level === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${emoji} Message [${level}]:`, message);
      if (context) {
        console.log('Context:', context);
      }
    }
    
    // TODO: Integrate with Sentry
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.captureMessage(message, {
    //   level,
    //   contexts: { custom: context },
    // });
  }

  /**
   * Set user context for error reports
   * @param userId - User identifier
   * @param email - User email (optional)
   * @param username - Username (optional)
   */
  setUser(userId: string, email?: string, username?: string): void {
    if (isDev) {
      console.log('👤 Error Monitoring - User Set:', { userId, email, username });
    }
    
    // TODO: Integrate with Sentry
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.setUser({ id: userId, email, username });
  }

  /**
   * Clear user context (e.g., on logout)
   */
  clearUser(): void {
    if (isDev) {
      console.log('🔄 Error Monitoring - User Cleared');
    }
    
    // TODO: Integrate with Sentry
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.setUser(null);
  }

  /**
   * Add breadcrumb for debugging
   * @param message - Breadcrumb message
   * @param category - Category of the breadcrumb
   * @param data - Additional data
   */
  addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void {
    if (isDev) {
      console.log('🍞 Breadcrumb:', message, { category, data });
    }
    
    // TODO: Integrate with Sentry
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.addBreadcrumb({
    //   message,
    //   category,
    //   data,
    //   level: 'info',
    // });
  }

  /**
   * Set custom context/tags
   * @param key - Context key
   * @param value - Context value
   */
  setContext(key: string, value: any): void {
    if (isDev) {
      console.log(`🏷 Context Set [${key}]:`, value);
    }
    
    // TODO: Integrate with Sentry
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.setContext(key, value);
  }
}

// Export singleton instance
export const monitoring = new ErrorMonitoring();

// Convenience exports
export const captureException = monitoring.captureException.bind(monitoring);
export const captureMessage = monitoring.captureMessage.bind(monitoring);
export const setUser = monitoring.setUser.bind(monitoring);
export const clearUser = monitoring.clearUser.bind(monitoring);
export const addBreadcrumb = monitoring.addBreadcrumb.bind(monitoring);
export const setContext = monitoring.setContext.bind(monitoring);

export default monitoring;

/**
 * Integration Guide:
 * 
 * 1. Install Sentry:
 *    npm install @sentry/react-native
 * 
 * 2. Configure in app/_layout.tsx:
 *    import * as Sentry from '@sentry/react-native';
 *    
 *    Sentry.init({
 *      dsn: 'YOUR_SENTRY_DSN',
 *      environment: __DEV__ ? 'development' : 'production',
 *      tracesSampleRate: 1.0,
 *      enableAutoSessionTracking: true,
 *    });
 * 
 * 3. Uncomment the Sentry code in this file
 * 
 * 4. Wrap your root component:
 *    export default Sentry.wrap(YourRootComponent);
 */
