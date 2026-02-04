/**
 * Deep Linking Utilities
 * 
 * Helper functions for generating and sharing deep links within the app.
 * Uses the app scheme: nofilterclinic://
 */

import * as Linking from 'expo-linking';
import { Share, Platform } from 'react-native';

const APP_SCHEME = 'nofilterclinic';
const WEB_DOMAIN = 'https://nofilter.clinic';

/**
 * Generate a deep link URL
 * @param path - The path within the app (e.g., 'services/consultation')
 * @param params - Query parameters (optional)
 * @returns Deep link URL
 */
export function generateDeepLink(path: string, params?: Record<string, string>): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  let url = `${APP_SCHEME}://${cleanPath}`;
  
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    url += `?${queryString}`;
  }
  
  return url;
}

/**
 * Generate a web URL fallback for sharing
 * @param path - The path within the app
 * @returns Web URL
 */
export function generateWebUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${WEB_DOMAIN}/${cleanPath}`;
}

/**
 * Share a deep link with fallback to web URL
 * @param path - The path to share
 * @param title - Share dialog title
 * @param message - Optional message to include
 * @returns Promise that resolves when share is complete
 */
export async function shareDeepLink(
  path: string,
  title: string,
  message?: string
): Promise<{ success: boolean }> {
  try {
    const deepLink = generateDeepLink(path);
    const webUrl = generateWebUrl(path);
    
    // Prefer web URL for sharing as it's more universal
    const shareUrl = webUrl;
    
    const shareContent: any = {
      title,
      url: shareUrl,
    };
    
    if (message) {
      shareContent.message = Platform.OS === 'android' 
        ? `${message}\n\n${shareUrl}` 
        : message;
    }
    
    const result = await Share.share(shareContent);
    
    return {
      success: result.action === Share.sharedAction,
    };
  } catch (error) {
    console.error('Error sharing deep link:', error);
    return { success: false };
  }
}

/**
 * Open a deep link within the app
 * @param path - The path to open
 */
export function openDeepLink(path: string): void {
  const deepLink = generateDeepLink(path);
  Linking.openURL(deepLink);
}

/**
 * Check if a URL can be opened
 * @param url - URL to check
 * @returns Promise that resolves to boolean
 */
export async function canOpenURL(url: string): Promise<boolean> {
  try {
    return await Linking.canOpenURL(url);
  } catch (error) {
    console.error('Error checking if URL can be opened:', error);
    return false;
  }
}

/**
 * Parse a deep link URL and extract path and params
 * @param url - Deep link URL
 * @returns Parsed URL object
 */
export function parseDeepLink(url: string): { path: string; params: Record<string, string> } {
  const parsed = Linking.parse(url);
  return {
    path: parsed.path || '',
    params: parsed.queryParams as Record<string, string> || {},
  };
}

// Predefined deep link generators for common screens
export const DeepLinks = {
  /**
   * Generate service detail deep link
   */
  service: (slug: string) => generateDeepLink(`services/${slug}`),
  
  /**
   * Generate offer detail deep link
   */
  offer: (id: number) => generateDeepLink(`offers/${id}`),
  
  /**
   * Generate doctor detail deep link
   */
  doctor: (id: number) => generateDeepLink(`doctors/${id}`),
  
  /**
   * Generate blog post deep link
   */
  blogPost: (slug: string) => generateDeepLink(`blog/${slug}`),
  
  /**
   * Generate booking flow deep link
   */
  booking: () => generateDeepLink('booking'),
  
  /**
   * Generate cart deep link
   */
  cart: () => generateDeepLink('cart'),
  
  /**
   * Generate home deep link
   */
  home: () => generateDeepLink(''),
};

// Share helpers for common screens
export const ShareLinks = {
  /**
   * Share a service
   */
  service: async (slug: string, title: string) => {
    return shareDeepLink(`services/${slug}`, title, `Check out this service: ${title}`);
  },
  
  /**
   * Share an offer
   */
  offer: async (id: number, title: string) => {
    return shareDeepLink(`offers/${id}`, title, `Check out this offer: ${title}`);
  },
  
  /**
   * Share a doctor profile
   */
  doctor: async (id: number, name: string) => {
    return shareDeepLink(`doctors/${id}`, name, `Check out Dr. ${name}'s profile`);
  },
  
  /**
   * Share a blog post
   */
  blogPost: async (slug: string, title: string) => {
    return shareDeepLink(`blog/${slug}`, title, `Read: ${title}`);
  },
};

export default {
  generateDeepLink,
  generateWebUrl,
  shareDeepLink,
  openDeepLink,
  canOpenURL,
  parseDeepLink,
  DeepLinks,
  ShareLinks,
};
