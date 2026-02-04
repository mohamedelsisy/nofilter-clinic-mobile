import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useBookingStore } from '@/store/bookingStore';
import { useConfigStore } from '@/store/configStore';
import { getTimeSlots, bookingKeys } from '@/api/endpoints/booking';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';

export default function BookingDateSlotsScreen() {
  const { t } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const {
    selectedDoctor,
    selectedDate,
    selectedTime,
    duration,
    setDate,
    setTime,
  } = useBookingStore();

  const [localDate, setLocalDate] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [localTime, setLocalTime] = useState<string | null>(selectedTime);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formattedDate = localDate.toISOString().split('T')[0]; // YYYY-MM-DD

  const {
    data: slotsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: bookingKeys.slots(selectedDoctor?.id || 0, formattedDate),
    queryFn: () =>
      getTimeSlots({
        doctor_id: selectedDoctor?.id || 0,
        date: formattedDate,
        duration,
      }),
    enabled: !!selectedDoctor,
  });

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setLocalDate(date);
      setLocalTime(null); // Reset time when date changes
    }
  };

  const handleSelectTime = (time: string) => {
    setLocalTime(time);
  };

  const handleNext = () => {
    if (localTime) {
      setDate(formattedDate);
      setTime(localTime);
      router.push('/(tabs)/booking/patient-info');
    }
  };

  if (!selectedDoctor) {
    router.back();
    return null;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !slotsResponse) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_slots')}
        onRetry={refetch}
      />
    );
  }

  const availableSlots = slotsResponse.slots.filter((slot) => slot.available);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Date Picker Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('select_date')}</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={24} color={themeColor} />
            <Text style={styles.dateText}>
              {localDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={localDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Working Hours Info */}
        {slotsResponse.working_hours && (
          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={20} color={themeColor} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('working_hours')}</Text>
              <Text style={styles.infoValue}>{slotsResponse.working_hours}</Text>
            </View>
          </View>
        )}

        {/* Working Status */}
        {!slotsResponse.working && (
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#ff9800" />
            <Text style={styles.warningText}>{t('doctor_not_working_this_day')}</Text>
          </View>
        )}

        {/* Time Slots */}
        {slotsResponse.working && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('select_time')} ({availableSlots.length} {t('available_slots')})
            </Text>
            {availableSlots.length === 0 ? (
              <View style={styles.emptySlots}>
                <Ionicons name="calendar-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>{t('no_available_slots')}</Text>
              </View>
            ) : (
              <View style={styles.slotsGrid}>
                {slotsResponse.slots.map((slot) => {
                  const isSelected = localTime === slot.time;
                  const displayTime = slot.display || slot.time;

                  return (
                    <TouchableOpacity
                      key={slot.time}
                      style={[
                        styles.slotButton,
                        !slot.available && styles.slotDisabled,
                        isSelected && { backgroundColor: themeColor, borderColor: themeColor },
                      ]}
                      onPress={() => handleSelectTime(slot.time)}
                      disabled={!slot.available}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          !slot.available && styles.slotTextDisabled,
                          isSelected && styles.slotTextSelected,
                        ]}
                      >
                        {displayTime}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: localTime ? themeColor : '#ccc' },
          ]}
          onPress={handleNext}
          disabled={!localTime}
        >
          <Text style={styles.nextButtonText}>{t('next')}</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  slotButton: {
    width: '31%',
    margin: '1%',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  slotDisabled: {
    opacity: 0.4,
    backgroundColor: '#f5f5f5',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  slotTextDisabled: {
    color: '#999',
  },
  slotTextSelected: {
    color: '#fff',
  },
  emptySlots: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
