import React, { useState } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { submitContactForm } from '@/api/endpoints/contact';
import { useConfigStore } from '@/store/configStore';

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactScreen() {
  const { t } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const [attachment, setAttachment] = useState<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      Alert.alert(t('success'), t('message_sent_successfully'));
      reset();
      setAttachment(null);
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_send_message'));
    },
  });

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Check file size (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size && file.size > MAX_SIZE) {
        Alert.alert(t('error'), t('file_too_large'));
        return;
      }

      setAttachment(file);
    } catch (err: any) {
      Alert.alert(t('error'), err.message || t('failed_to_pick_file'));
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const onSubmit = (data: ContactFormData) => {
    const formData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    };

    if (attachment) {
      // Create file object for FormData
      const file = {
        uri: attachment.uri,
        type: attachment.mimeType || 'application/octet-stream',
        name: attachment.name || 'attachment',
      };
      formData.attachment = file as any;
    }

    submitMutation.mutate(formData);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('contact_us')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={themeColor} />
          <Text style={styles.infoText}>{t('contact_form_help')}</Text>
        </View>

        <View style={styles.formCard}>
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('name')} <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder={t('enter_full_name')}
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('email')} <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder={t('your_email')}
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('phone')} <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder={t('phone_format_help')}
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone.message}</Text>
            )}
          </View>

          {/* Subject */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('subject')} <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="subject"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.subject && styles.inputError]}
                  placeholder={t('message_subject')}
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.subject && (
              <Text style={styles.errorText}>{errors.subject.message}</Text>
            )}
          </View>

          {/* Message */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('message')} <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="message"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.textArea, errors.message && styles.inputError]}
                  placeholder={t('your_message')}
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              )}
            />
            {errors.message && (
              <Text style={styles.errorText}>{errors.message.message}</Text>
            )}
          </View>

          {/* Attachment */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('attachment')} <Text style={styles.optional}>({t('optional')})</Text>
            </Text>
            {attachment ? (
              <View style={styles.attachmentPreview}>
                <View style={styles.attachmentInfo}>
                  <Ionicons name="document-attach" size={24} color={themeColor} />
                  <View style={styles.attachmentDetails}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {attachment.name}
                    </Text>
                    <Text style={styles.attachmentSize}>
                      {((attachment.size || 0) / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleRemoveAttachment}>
                  <Ionicons name="close-circle" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={handlePickDocument}
              >
                <Ionicons name="attach" size={20} color={themeColor} />
                <Text style={[styles.attachmentButtonText, { color: themeColor }]}>
                  {t('attach_file')}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.attachmentHint}>{t('max_file_size_5mb')}</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: themeColor },
              submitMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>{t('send_message')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#f44336',
  },
  optional: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#999',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    fontSize: 13,
    color: '#f44336',
    marginTop: 4,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0d525a',
    borderRadius: 8,
    paddingVertical: 12,
    borderStyle: 'dashed',
  },
  attachmentButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  attachmentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#666',
  },
  attachmentHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
