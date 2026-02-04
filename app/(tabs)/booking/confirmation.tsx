import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '@/store/bookingStore';
import { useConfigStore } from '@/store/configStore';
import { useTField } from '@/utils/localization';

export default function BookingConfirmationScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { appointmentId, hasToken } = useLocalSearchParams<{
    appointmentId: string;
    hasToken: string;
  }>();

  const {
    selectedDepartment,
    selectedDoctor,
    selectedDate,
    selectedTime,
    preselectedService,
    resetBooking,
  } = useBookingStore();

  const handleViewAppointments = () => {
    // Reset booking
    resetBooking();
    
    if (hasToken === 'true') {
      // Navigate to appointments (will be implemented in Step 10)
      router.push('/(tabs)/account');
    } else {
      // Prompt to login or view as guest
      router.push('/(tabs)/account');
    }
  };

  const handleBackToHome = () => {
    resetBooking();
    router.push('/(tabs)');
  };

  const doctorName = selectedDoctor ? tField(selectedDoctor.name_ar, selectedDoctor.name_en) : '';
  const departmentName = selectedDepartment
    ? tField(selectedDepartment.name_ar, selectedDepartment.name_en)
    : '';
  const serviceName = preselectedService
    ? tField(preselectedService.title_ar, preselectedService.title_en)
    : '';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Success Icon */}
        <View style={[styles.successIcon, { backgroundColor: `${themeColor}20` }]}>
          <Ionicons name="checkmark-circle" size={80} color={themeColor} />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>{t('booking_confirmed')}</Text>
        <Text style={styles.subtitle}>{t('booking_confirmed_message')}</Text>

        {/* Account Activation Message */}
        {hasToken === 'true' && (
          <View style={[styles.tokenBox, { backgroundColor: `${themeColor}15` }]}>
            <Ionicons name="person-add" size={24} color={themeColor} />
            <View style={styles.tokenContent}>
              <Text style={[styles.tokenTitle, { color: themeColor }]}>
                {t('account_activated')}
              </Text>
              <Text style={styles.tokenText}>{t('account_activated_message')}</Text>
            </View>
          </View>
        )}

        {/* Appointment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>{t('appointment_details')}</Text>

          {/* Appointment ID */}
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('appointment_id')}</Text>
              <Text style={styles.detailValue}>#{appointmentId}</Text>
            </View>
          </View>

          {/* Department */}
          <View style={styles.detailRow}>
            <Ionicons name="folder-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('department')}</Text>
              <Text style={styles.detailValue}>{departmentName}</Text>
            </View>
          </View>

          {/* Doctor */}
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('doctor')}</Text>
              <Text style={styles.detailValue}>{doctorName}</Text>
            </View>
          </View>

          {/* Service (if any) */}
          {serviceName && (
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={20} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('service')}</Text>
                <Text style={styles.detailValue}>{serviceName}</Text>
              </View>
            </View>
          )}

          {/* Date */}
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('date')}</Text>
              <Text style={styles.detailValue}>
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </Text>
            </View>
          </View>

          {/* Time */}
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('time')}</Text>
              <Text style={styles.detailValue}>{selectedTime}</Text>
            </View>
          </View>

          {/* Fee */}
          {selectedDoctor?.consultation_fee && (
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('consultation_fee')}</Text>
                <Text style={[styles.detailValue, { color: themeColor, fontWeight: '700' }]}>
                  {selectedDoctor.consultation_fee} {t('sar')}
                </Text>
              </View>
            </View>
          )}

          {/* Status */}
          <View style={styles.detailRow}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('status')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${themeColor}20` }]}>
                <Text style={[styles.statusText, { color: themeColor }]}>
                  {t('pending')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="alert-circle-outline" size={20} color={themeColor} />
          <Text style={styles.infoText}>{t('booking_confirmation_info')}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: themeColor }]}
          onPress={handleViewAppointments}
        >
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>{t('view_my_appointments')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleBackToHome}>
          <Text style={[styles.secondaryButtonText, { color: themeColor }]}>
            {t('back_to_home')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  tokenBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tokenContent: {
    flex: 1,
    marginLeft: 12,
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
