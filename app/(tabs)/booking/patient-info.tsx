import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { submitBooking } from '@/api/endpoints/booking';
import { isValidSaudiPhone, normalizeSaudiPhone } from '@/utils/phoneValidation';

export default function BookingPatientInfoScreen() {
  const { t } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { setAuth } = useAuthStore();
  const {
    selectedDepartment,
    selectedDoctor,
    selectedDate,
    selectedTime,
    preselectedService,
  } = useBookingStore();

  // Validation schema
  const schema = z.object({
    name: z.string().min(2, t('name_min_length')),
    phone: z.string().refine(isValidSaudiPhone, t('phone_invalid_format')),
    national_identity_number: z.string().min(8, t('national_id_min_length')),
    reason_for_visit: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      national_identity_number: '',
      reason_for_visit: '',
    },
  });

  const bookingMutation = useMutation({
    mutationFn: submitBooking,
    onSuccess: (data) => {
      // Store token if returned (patient auto-registered)
      if (data.token) {
        setAuth(data.token, {
          id: data.patient.id,
          name: data.patient.name,
          email: data.patient.email || '',
          phone: data.patient.phone,
        });
      }

      // Navigate to confirmation
      router.push({
        pathname: '/(tabs)/booking/confirmation',
        params: {
          appointmentId: data.appointment.id.toString(),
          hasToken: data.token ? 'true' : 'false',
        },
      });
    },
    onError: (error: any) => {
      // Handle 422 validation errors
      if (error.status === 422 && error.errors) {
        Object.keys(error.errors).forEach((field) => {
          setError(field as keyof FormData, {
            message: error.errors[field][0],
          });
        });
      } else {
        // Show generic error
        Alert.alert(t('error'), error.message || t('booking_failed'));
      }
    },
  });

  const onSubmit = (data: FormData) => {
    if (!selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime) {
      Alert.alert(t('error'), t('please_complete_all_steps'));
      return;
    }

    // Normalize phone
    const normalizedPhone = normalizeSaudiPhone(data.phone);

    // Submit booking
    bookingMutation.mutate({
      doctor_id: selectedDoctor.id,
      department_id: selectedDepartment.id,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      name: data.name,
      phone: normalizedPhone,
      national_identity_number: data.national_identity_number,
      reason_for_visit: data.reason_for_visit || '',
      service_id: preselectedService?.id,
    });
  };

  if (!selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={themeColor} />
          <Text style={styles.infoText}>{t('patient_info_help_text')}</Text>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {t('full_name')} <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder={t('enter_full_name')}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {t('phone')} <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="05XXXXXXXX"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}
          <Text style={styles.helperText}>{t('phone_format_help')}</Text>
        </View>

        {/* National ID Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {t('national_identity_number')} <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="national_identity_number"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.national_identity_number && styles.inputError]}
                placeholder={t('enter_national_id')}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
              />
            )}
          />
          {errors.national_identity_number && (
            <Text style={styles.errorText}>
              {errors.national_identity_number.message}
            </Text>
          )}
        </View>

        {/* Reason for Visit Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t('reason_for_visit')}</Text>
          <Controller
            control={control}
            name="reason_for_visit"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('enter_reason_for_visit')}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
          {errors.reason_for_visit && (
            <Text style={styles.errorText}>
              {errors.reason_for_visit.message}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: themeColor }]}
          onPress={handleSubmit(onSubmit)}
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>{t('confirm_booking')}</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </>
          )}
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#f44336',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#f44336',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
