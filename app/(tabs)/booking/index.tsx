import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '@/store/bookingStore';
import { useConfigStore } from '@/store/configStore';
import { useTField } from '@/utils/localization';

export default function BookingStartScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { preselectedService, resetBooking } = useBookingStore();

  // Reset booking when starting fresh
  React.useEffect(() => {
    // Only reset if no preselected service (coming from tab, not from service)
    if (!preselectedService) {
      resetBooking();
    }
  }, []);

  const handleStartBooking = () => {
    router.push('/(tabs)/booking/departments');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>{t('book_appointment')}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Selected Service Display */}
        {preselectedService && (
          <View style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Ionicons name="medical" size={24} color={themeColor} />
              <Text style={styles.serviceLabel}>{t('selected_service')}</Text>
            </View>
            <Text style={styles.serviceName}>
              {tField(preselectedService.title_ar, preselectedService.title_en)}
            </Text>
            {preselectedService.price && (
              <Text style={styles.servicePrice}>
                {preselectedService.price} {t('sar')}
              </Text>
            )}
          </View>
        )}

        {/* Booking Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>{t('booking_steps')}</Text>
          
          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: themeColor }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('select_department')}</Text>
              <Text style={styles.stepDescription}>{t('select_department_desc')}</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: themeColor }]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('select_doctor')}</Text>
              <Text style={styles.stepDescription}>{t('select_doctor_desc')}</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: themeColor }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('select_date_time')}</Text>
              <Text style={styles.stepDescription}>{t('select_date_time_desc')}</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: themeColor }]}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('patient_information')}</Text>
              <Text style={styles.stepDescription}>{t('patient_information_desc')}</Text>
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={themeColor} />
          <Text style={styles.infoText}>{t('booking_info_text')}</Text>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: themeColor }]}
          onPress={handleStartBooking}
        >
          <Text style={styles.startButtonText}>{t('start_booking')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '600',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d525a',
  },
  stepsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
