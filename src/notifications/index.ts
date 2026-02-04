/**
 * Push Notifications Wrapper
 * 
 * Handles push notification permissions, token management, and local reminders.
 * Uses expo-notifications for cross-platform support.
 * 
 * TODO: Implement backend endpoint to register device token
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = 'expo_push_token';
const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private pushToken: string | null = null;

  /**
   * Check if notifications are supported on this device
   */
  isSupported(): boolean {
    return Device.isDevice && Platform.OS !== 'web';
  }

  /**
   * Request notification permissions
   * @returns Permission status
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.log('Push notifications are not supported on this device');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Store that we've requested permission
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get current permission status
   */
  async getPermissionStatus(): Promise<Notifications.PermissionStatus> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  /**
   * Check if permission has been requested before
   */
  async hasRequestedPermission(): Promise<boolean> {
    const hasRequested = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
    return hasRequested === 'true';
  }

  /**
   * Get Expo push token
   * @returns Expo push token string
   */
  async getExpoPushToken(): Promise<string | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      // Check if we already have a token
      const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (storedToken) {
        this.pushToken = storedToken;
        return storedToken;
      }

      // Get new token
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // TODO: Add your Expo project ID
      });

      // Store token
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
      this.pushToken = token;

      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Get stored push token
   */
  async getStoredPushToken(): Promise<string | null> {
    return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  }

  /**
   * Register device with backend (TODO: Implement when backend is ready)
   * @param token - Expo push token
   * @param userId - User ID (optional)
   */
  async registerDevice(token: string, userId?: string): Promise<void> {
    console.log('📱 TODO: Register device token with backend');
    console.log('Token:', token);
    console.log('User ID:', userId);

    // TODO: Implement API call to register device
    // Example:
    // await apiClient.post('/notifications/register', {
    //   token,
    //   userId,
    //   platform: Platform.OS,
    //   deviceId: Device.deviceId,
    // });
  }

  /**
   * Unregister device (e.g., on logout)
   */
  async unregisterDevice(): Promise<void> {
    const token = await this.getStoredPushToken();
    if (!token) return;

    console.log('📱 TODO: Unregister device token with backend');
    console.log('Token:', token);

    // TODO: Implement API call to unregister device
    // Example:
    // await apiClient.post('/notifications/unregister', { token });

    // Clear local token
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
    this.pushToken = null;
  }

  /**
   * Schedule a local notification
   * @param title - Notification title
   * @param body - Notification body
   * @param triggerDate - When to trigger the notification
   * @param data - Additional data
   * @returns Notification identifier
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    triggerDate: Date,
    data?: Record<string, any>
  ): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: triggerDate,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Schedule appointment reminder
   * @param appointmentDate - Appointment date/time
   * @param appointmentDetails - Details for the notification
   */
  async scheduleAppointmentReminder(
    appointmentDate: Date,
    appointmentDetails: {
      doctorName?: string;
      department?: string;
      time?: string;
    }
  ): Promise<void> {
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Don't schedule if appointment is in the past
    if (timeDiff <= 0) {
      return;
    }

    let reminderDate: Date;
    let reminderText: string;

    // Schedule reminder 24 hours before if appointment is more than 24 hours away
    if (hoursDiff >= 24) {
      reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
      reminderText = 'tomorrow';
    }
    // Schedule reminder 1 hour before if appointment is more than 1 hour away
    else if (hoursDiff >= 1) {
      reminderDate = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
      reminderText = 'in 1 hour';
    }
    // Too soon, don't schedule
    else {
      return;
    }

    const title = 'Appointment Reminder';
    const body = appointmentDetails.doctorName
      ? `Your appointment with Dr. ${appointmentDetails.doctorName} is ${reminderText}`
      : `Your appointment is ${reminderText}`;

    await this.scheduleLocalNotification(title, body, reminderDate, {
      type: 'appointment_reminder',
      appointmentDate: appointmentDate.toISOString(),
      ...appointmentDetails,
    });
  }

  /**
   * Cancel a scheduled notification
   * @param identifier - Notification identifier
   */
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

// Export singleton instance
export const notifications = new NotificationService();

export default notifications;

/**
 * Usage Example:
 * 
 * 1. Request permission (e.g., in Settings screen):
 *    const granted = await notifications.requestPermission();
 *    if (granted) {
 *      const token = await notifications.getExpoPushToken();
 *      // Store token or register with backend
 *    }
 * 
 * 2. Schedule appointment reminder (after booking):
 *    await notifications.scheduleAppointmentReminder(
 *      new Date('2024-12-25T10:00:00'),
 *      {
 *        doctorName: 'Smith',
 *        department: 'Cardiology',
 *        time: '10:00 AM',
 *      }
 *    );
 * 
 * 3. On logout:
 *    await notifications.unregisterDevice();
 */
