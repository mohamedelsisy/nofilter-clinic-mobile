import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import apiClient from '@/api/client';

export default function AccountScreen() {
  const { t } = useTranslation();
  const { token, logout: clearToken } = useAuthStore();
  const themeColor = useConfigStore((state) => state.getThemeColor());

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      t('logout_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Try to call API logout (may fail for patient tokens, that's ok)
              await apiClient.post('/auth/logout');
            } catch (err) {
              // Ignore API errors, still clear local token
              console.log('API logout failed (expected for patient tokens):', err);
            } finally {
              // Always clear local token
              clearToken();
              Alert.alert(t('success'), t('logged_out_successfully'));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: 'appointments',
      title: t('my_appointments'),
      subtitle: t('view_cancel_appointments'),
      icon: 'calendar-outline',
      route: '/account/appointments',
      color: '#4CAF50',
    },
    {
      id: 'invoices',
      title: t('my_invoices'),
      subtitle: t('view_pay_invoices'),
      icon: 'document-text-outline',
      route: '/account/invoices',
      color: '#2196F3',
    },
    {
      id: 'points',
      title: t('loyalty_points'),
      subtitle: t('view_points_card'),
      icon: 'star-outline',
      route: '/account/points',
      color: '#FF9800',
    },
    {
      id: 'contact',
      title: t('contact_us'),
      subtitle: t('send_message_attachment'),
      icon: 'mail-outline',
      route: '/account/contact',
      color: '#9C27B0',
      public: true, // Available in guest mode
    },
    {
      id: 'settings',
      title: t('settings'),
      subtitle: t('language_api_settings'),
      icon: 'settings-outline',
      route: '/account/settings',
      color: '#607D8B',
      public: true, // Available in guest mode
    },
  ];

  // Guest Mode UI
  if (!token) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.guestContainer}>
          <Ionicons name="person-circle-outline" size={120} color="#ccc" />
          <Text style={styles.guestTitle}>{t('guest_mode')}</Text>
          <Text style={styles.guestMessage}>{t('guest_mode_message')}</Text>
          
          <TouchableOpacity
            style={[styles.guestButton, { backgroundColor: themeColor }]}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Ionicons name="log-in" size={24} color="#fff" />
            <Text style={styles.guestButtonText}>{t('login')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.guestButtonOutline, { borderColor: themeColor }]}
            onPress={() => router.push('/(tabs)/booking')}
          >
            <Ionicons name="calendar" size={22} color={themeColor} />
            <Text style={[styles.guestButtonOutlineText, { color: themeColor }]}>
              {t('book_appointment_to_create_account')}
            </Text>
          </TouchableOpacity>

          <View style={styles.guestDivider}>
            <View style={styles.guestDividerLine} />
            <Text style={styles.guestDividerText}>{t('or')}</Text>
            <View style={styles.guestDividerLine} />
          </View>

          {/* Show public menu items */}
          <Text style={styles.guestPublicTitle}>{t('available_for_guests')}</Text>
          {menuItems
            .filter((item) => item.public)
            .map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, styles.guestPublicCard]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  }

  // Authenticated UI
  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>{t('account')}</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <View style={[styles.menuIcon, { backgroundColor: '#f4433620' }]}>
            <Ionicons name="log-out-outline" size={28} color="#f44336" />
          </View>
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: '#f44336' }]}>{t('logout')}</Text>
            <Text style={styles.menuSubtitle}>{t('logout_subtitle')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Guest mode styles
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  guestMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  guestButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 16,
    width: '100%',
  },
  guestButtonOutlineText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  guestDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  guestDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  guestDividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
  },
  guestPublicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: '100%',
  },
  guestPublicCard: {
    width: '100%',
  },
});
