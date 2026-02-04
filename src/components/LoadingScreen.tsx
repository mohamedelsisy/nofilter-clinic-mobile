import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/store/configStore';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={themeColor} />
      <Text style={styles.text}>{message || t('loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
