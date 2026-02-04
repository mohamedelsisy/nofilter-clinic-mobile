/**
 * Toast/Snackbar Utility
 * 
 * Unified toast system for consistent user feedback across the app.
 * Uses React Native's Alert for simplicity (can be replaced with a custom toast library).
 * 
 * For a better UX, consider using:
 * - react-native-toast-message
 * - react-native-paper's Snackbar
 * - Custom animated toast component
 */

import { Alert, Platform } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    text: string;
    onPress: () => void;
  };
}

class ToastService {
  /**
   * Show a success toast
   */
  success(message: string, title?: string): void {
    this.show({
      message,
      title: title || '✅ Success',
      type: 'success',
    });
  }

  /**
   * Show an error toast
   */
  error(message: string, title?: string): void {
    this.show({
      message,
      title: title || '❌ Error',
      type: 'error',
    });
  }

  /**
   * Show an info toast
   */
  info(message: string, title?: string): void {
    this.show({
      message,
      title: title || 'ℹ️ Info',
      type: 'info',
    });
  }

  /**
   * Show a warning toast
   */
  warning(message: string, title?: string): void {
    this.show({
      message,
      title: title || '⚠️ Warning',
      type: 'warning',
    });
  }

  /**
   * Show a generic toast
   */
  show(options: ToastOptions): void {
    const { title, message, action } = options;

    if (action) {
      Alert.alert(
        title || 'Notification',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: action.text, onPress: action.onPress },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        title || 'Notification',
        message,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    }

    // TODO: Replace with a better toast library for non-blocking notifications
    // Example with react-native-toast-message:
    // import Toast from 'react-native-toast-message';
    // Toast.show({
    //   type: options.type || 'info',
    //   text1: title || 'Notification',
    //   text2: message,
    //   visibilityTime: options.duration || 3000,
    //   autoHide: true,
    //   topOffset: 60,
    // });
  }

  /**
   * Show network error toast
   */
  networkError(): void {
    this.error(
      'Please check your internet connection and try again.',
      'Network Error'
    );
  }

  /**
   * Show authentication error toast
   */
  authError(): void {
    this.error(
      'Your session has expired. Please log in again.',
      'Authentication Required'
    );
  }

  /**
   * Show validation error toast
   */
  validationError(message?: string): void {
    this.error(
      message || 'Please check your input and try again.',
      'Validation Error'
    );
  }

  /**
   * Show server error toast
   */
  serverError(): void {
    this.error(
      'Something went wrong on our end. Please try again later.',
      'Server Error'
    );
  }

  /**
   * Show permission denied error
   */
  permissionDenied(): void {
    this.error(
      'You do not have permission to perform this action.',
      'Permission Denied'
    );
  }
}

// Export singleton instance
export const toast = new ToastService();

export default toast;

/**
 * Usage Example:
 * 
 * import { toast } from '@/utils/toast';
 * 
 * // Success
 * toast.success('Booking confirmed!');
 * 
 * // Error
 * toast.error('Failed to load data');
 * 
 * // With action
 * toast.show({
 *   title: 'Item Added',
 *   message: 'Would you like to view your cart?',
 *   type: 'success',
 *   action: {
 *     text: 'View Cart',
 *     onPress: () => router.push('/cart'),
 *   },
 * });
 * 
 * // Predefined errors
 * toast.networkError();
 * toast.authError();
 * toast.serverError();
 */
