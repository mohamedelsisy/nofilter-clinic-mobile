import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';
import { Service } from '@/api/types';
import { useFontFamily } from '@/utils/fonts';

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { getThemeColor } = useConfigStore();
  const themeColor = getThemeColor();
  const fonts = useFontFamily();

  const name = language === 'ar' ? service.name_ar : service.name;
  const description = language === 'ar' ? service.description_ar : service.description;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {service.image ? (
        <>
          <Image
            source={{ uri: service.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
        </>
      ) : (
        <LinearGradient
          colors={[themeColor, '#0a3d43']}
          style={styles.imagePlaceholder}
        >
          <Ionicons name="medical" size={50} color="#fff" />
        </LinearGradient>
      )}
      <View style={styles.content}>
        <Text style={[styles.name, { fontFamily: fonts.bold }]} numberOfLines={2}>
          {name}
        </Text>
        {description && (
          <Text style={[styles.description, { fontFamily: fonts.regular }]} numberOfLines={2}>
            {description}
          </Text>
        )}
        {service.price && (
          <View style={styles.priceContainer}>
            <View style={[styles.priceTag, { backgroundColor: themeColor }]}>
              <Text style={styles.price}>
                {service.price} {t('sar')}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={themeColor} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
