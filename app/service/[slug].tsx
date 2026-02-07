import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';
import { servicesApi } from '@/api/endpoints';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';
import { useFontFamily } from '@/utils/fonts';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { getThemeColor } = useConfigStore();
  const themeColor = getThemeColor();
  const fonts = useFontFamily();

  // Fetch service details
  const {
    data: serviceData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const response = await servicesApi.getService(slug as string);
      console.log('Service API response:', response);
      return response;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !serviceData) {
    return (
      <ErrorView
        message={(error as any)?.message || t('service_not_found')}
        onRetry={refetch}
      />
    );
  }

  // Handle nested API response structure: { service: {...}, gallery_images: [], sidebar_services: [] }
  const service = (serviceData as any)?.service || serviceData;
  
  const name = (language === 'ar' ? service.name_ar : service.name_en) || service.name || '';
  const description = (language === 'ar' ? service.description_ar : service.description_en) || service.description || '';
  const imageUrl = service.photo || service.image;
  const galleryImages = (serviceData as any)?.gallery_images || [];

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerShown: true,
          headerStyle: { backgroundColor: themeColor },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: fonts.bold },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Service Image or Gallery */}
        {galleryImages.length > 0 ? (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}
            >
              {galleryImages.map((img: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
          </View>
        ) : imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
          </View>
        ) : (
          <LinearGradient
            colors={[themeColor, '#0a3d43']}
            style={styles.imagePlaceholder}
          >
            <Ionicons name="medical" size={80} color="#fff" />
          </LinearGradient>
        )}

        {/* Service Info */}
        <View style={styles.content}>
          {/* Service Name */}
          <Text style={[styles.name, { fontFamily: fonts.bold }]}>{name}</Text>

          {/* Price & Duration */}
          {(service.price || service.duration) && (
            <View style={styles.infoRow}>
              {service.price && (
                <View style={[styles.infoCard, { backgroundColor: themeColor }]}>
                  <Ionicons name="cash-outline" size={24} color="#fff" />
                  <Text style={styles.infoLabel}>{t('price')}</Text>
                  <Text style={styles.infoValue}>
                    {service.price} {t('sar')}
                  </Text>
                </View>
              )}
              {service.duration && (
                <View style={[styles.infoCard, { backgroundColor: '#666' }]}>
                  <Ionicons name="time-outline" size={24} color="#fff" />
                  <Text style={styles.infoLabel}>{t('duration')}</Text>
                  <Text style={styles.infoValue}>
                    {service.duration} {t('minutes')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Description */}
          {description && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold }]}>
                  {t('description')}
                </Text>
              </View>
              <Text style={[styles.description, { fontFamily: fonts.regular }]}>
                {description}
              </Text>
            </View>
          )}

          {/* Sub Services */}
          {service.sub_services && service.sub_services.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold }]}>
                  {t('sub_services')}
                </Text>
              </View>
              {service.sub_services.map((subService, index) => {
                const subName = (language === 'ar' ? subService.name_ar : subService.name_en) || subService.name || '';
                const subDesc = (language === 'ar' ? subService.description_ar : subService.description_en) || subService.description || '';
                return (
                  <View key={subService.id} style={styles.subServiceCard}>
                    <View style={styles.subServiceHeader}>
                      <View style={[styles.subServiceNumber, { backgroundColor: themeColor }]}>
                        <Text style={styles.subServiceNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.subServiceName, { fontFamily: fonts.bold }]}>
                        {subName}
                      </Text>
                    </View>
                    {subDesc && (
                      <Text style={[styles.subServiceDesc, { fontFamily: fonts.regular }]}>
                        {subDesc}
                      </Text>
                    )}
                    {subService.price && (
                      <View style={styles.subServicePrice}>
                        <Ionicons name="cash" size={16} color={themeColor} />
                        <Text style={[styles.subServicePriceText, { color: themeColor }]}>
                          {subService.price} {t('sar')}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Book Now Button */}
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: themeColor }]}
            onPress={() => router.push('/(tabs)/booking')}
            activeOpacity={0.9}
          >
            <Ionicons name="calendar" size={24} color="#fff" />
            <Text style={[styles.bookButtonText, { fontFamily: fonts.bold }]}>
              {t('book_now')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  galleryScroll: {
    width: '100%',
    height: 300,
  },
  image: {
    width: width,
    height: 300,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    lineHeight: 36,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.9,
  },
  infoValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
  },
  subServiceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  subServiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subServiceNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subServiceNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  subServiceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  subServiceDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  subServicePrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subServicePriceText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
});
