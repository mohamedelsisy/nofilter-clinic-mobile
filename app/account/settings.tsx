import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { apiBaseUrl, setApiBaseUrl, getThemeColor } = useConfigStore();
  const themeColor = getThemeColor();

  const [apiUrlInput, setApiUrlInput] = useState(apiBaseUrl || '');
  const [showApiUrlInput, setShowApiUrlInput] = useState(false);

  const handleChangeLanguage = (lang: 'ar' | 'en') => {
    Alert.alert(
      t('change_language'),
      t('change_language_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            setLanguage(lang);
            Alert.alert(t('success'), t('language_changed_successfully'));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveApiUrl = () => {
    if (!apiUrlInput.trim()) {
      Alert.alert(t('error'), t('api_url_cannot_be_empty'));
      return;
    }

    // Basic URL validation
    try {
      new URL(apiUrlInput);
    } catch (err) {
      Alert.alert(t('error'), t('invalid_api_url'));
      return;
    }

    Alert.alert(
      t('change_api_url'),
      t('change_api_url_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            setApiBaseUrl(apiUrlInput);
            Alert.alert(
              t('success'),
              t('api_url_changed_successfully'),
              [
                {
                  text: t('ok'),
                  onPress: () => {
                    // Optionally reload app or navigate back
                    router.back();
                  },
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleResetApiUrl = () => {
    Alert.alert(
      t('reset_api_url'),
      t('reset_api_url_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: () => {
            setApiBaseUrl(''); // Reset to default from env
            setApiUrlInput('');
            Alert.alert(t('success'), t('api_url_reset_successfully'));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={24} color={themeColor} />
            <Text style={styles.sectionTitle}>{t('language')}</Text>
          </View>

          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'ar' && [
                  styles.languageOptionActive,
                  { borderColor: themeColor },
                ],
              ]}
              onPress={() => handleChangeLanguage('ar')}
            >
              <View style={styles.languageInfo}>
                <Text
                  style={[
                    styles.languageLabel,
                    language === 'ar' && { color: themeColor, fontWeight: '700' },
                  ]}
                >
                  العربية
                </Text>
                <Text style={styles.languageSubtext}>Arabic (RTL)</Text>
              </View>
              {language === 'ar' && (
                <Ionicons name="checkmark-circle" size={24} color={themeColor} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && [
                  styles.languageOptionActive,
                  { borderColor: themeColor },
                ],
              ]}
              onPress={() => handleChangeLanguage('en')}
            >
              <View style={styles.languageInfo}>
                <Text
                  style={[
                    styles.languageLabel,
                    language === 'en' && { color: themeColor, fontWeight: '700' },
                  ]}
                >
                  English
                </Text>
                <Text style={styles.languageSubtext}>English (LTR)</Text>
              </View>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={24} color={themeColor} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* API Configuration Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="server" size={24} color={themeColor} />
            <Text style={styles.sectionTitle}>{t('api_configuration')}</Text>
          </View>

          <View style={styles.apiInfo}>
            <Text style={styles.apiLabel}>{t('current_api_url')}:</Text>
            <Text style={styles.apiValue} numberOfLines={2}>
              {apiBaseUrl || t('using_default_from_env')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowApiUrlInput(!showApiUrlInput)}
          >
            <Text style={[styles.toggleButtonText, { color: themeColor }]}>
              {showApiUrlInput ? t('hide_api_settings') : t('change_api_url')}
            </Text>
            <Ionicons
              name={showApiUrlInput ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={themeColor}
            />
          </TouchableOpacity>

          {showApiUrlInput && (
            <View style={styles.apiInputSection}>
              <Text style={styles.inputLabel}>{t('api_base_url')}:</Text>
              <TextInput
                style={styles.apiInput}
                placeholder="https://your-domain.com/api/v1"
                placeholderTextColor="#999"
                value={apiUrlInput}
                onChangeText={setApiUrlInput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <Text style={styles.inputHint}>{t('api_url_hint')}</Text>

              <View style={styles.apiActions}>
                <TouchableOpacity
                  style={[styles.apiButton, styles.resetButton]}
                  onPress={handleResetApiUrl}
                >
                  <Ionicons name="refresh" size={18} color="#f44336" />
                  <Text style={[styles.apiButtonText, { color: '#f44336' }]}>
                    {t('reset')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.apiButton, { backgroundColor: themeColor }]}
                  onPress={handleSaveApiUrl}
                >
                  <Ionicons name="save" size={18} color="#fff" />
                  <Text style={[styles.apiButtonText, { color: '#fff' }]}>
                    {t('save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color="#FF9800" />
            <Text style={styles.warningText}>{t('api_url_warning')}</Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color={themeColor} />
            <Text style={styles.sectionTitle}>{t('app_info')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('version')}:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('theme_color')}:</Text>
            <View style={styles.colorPreview}>
              <View style={[styles.colorDot, { backgroundColor: themeColor }]} />
              <Text style={styles.infoValue}>{themeColor}</Text>
            </View>
          </View>
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
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  languageOptions: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  languageOptionActive: {
    backgroundColor: '#fff',
  },
  languageInfo: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  languageSubtext: {
    fontSize: 13,
    color: '#666',
  },
  apiInfo: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  apiLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  apiValue: {
    fontSize: 14,
    color: '#333',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0d525a',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
  apiInputSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  apiInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  inputHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginBottom: 12,
  },
  apiActions: {
    flexDirection: 'row',
    gap: 12,
  },
  apiButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#ffebee',
  },
  apiButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    marginLeft: 10,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
