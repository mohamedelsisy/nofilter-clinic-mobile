import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useConfigStore } from '@/store/configStore';
import { useBookingStore } from '@/store/bookingStore';
import { getServiceBySlug, servicesKeys } from '@/api/endpoints/services';
import { useTField } from '@/utils/localization';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';
import { ShareButton } from '@/components/ShareButton';
import { ShareLinks } from '@/utils/deepLinking';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { setPreselectedService } = useBookingStore();

  const {
    data: service,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: servicesKeys.detail(slug as string),
    queryFn: () => getServiceBySlug(slug as string),
    enabled: !!slug,
  });

  const handleBookAppointment = () => {
    // Store the service for prefilling in booking flow
    if (service) {
      setPreselectedService({
        id: service.id,
        slug: service.slug,
        title: service.title,
        title_ar: service.title_ar,
        title_en: service.title_en,
        description: service.description,
        description_ar: service.description_ar,
        description_en: service.description_en,
        image: service.image,
        price: service.price,
        duration: service.duration,
        category_id: service.category_id,
        is_featured: service.is_featured,
      });
    }
    
    // Navigate to booking flow
    router.push('/(tabs)/booking');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !service) {
    return (
      <ErrorView
        message={(error as any)?.message || t('service_not_found')}
        onRetry={refetch}
      />
    );
  }

  const title = tField(service.title_ar, service.title_en);
  const description = tField(service.description_ar, service.description_en);
  const content = tField(service.content_ar, service.content_en);
  const categoryName = service.category
    ? tField(service.category.name_ar, service.category.name_en)
    : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerRight}>
          <ShareButton
            onShare={() => ShareLinks.service(slug as string, title)}
            color="#fff"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Image/Gallery */}
        {service.images && service.images.length > 0 ? (
          <View style={styles.imageGallery}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {service.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        ) : service.image ? (
          <Image
            source={{ uri: service.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}

        {/* Service Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{title}</Text>

          {/* Category */}
          {categoryName && (
            <View style={styles.categoryContainer}>
              <Ionicons name="folder-outline" size={16} color="#666" />
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          )}

          {/* Price and Duration */}
          <View style={styles.metaContainer}>
            {service.price && (
              <View style={styles.metaItem}>
                <Ionicons name="cash-outline" size={20} color={themeColor} />
                <Text style={[styles.metaLabel, { color: themeColor }]}>
                  {t('price')}:
                </Text>
                <Text style={styles.metaValue}>
                  {service.price} {t('sar')}
                </Text>
              </View>
            )}

            {service.duration && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={20} color={themeColor} />
                <Text style={[styles.metaLabel, { color: themeColor }]}>
                  {t('duration')}:
                </Text>
                <Text style={styles.metaValue}>
                  {service.duration} {t('minutes')}
                </Text>
              </View>
            )}
          </View>

          {/* Short Description */}
          {description && (
            <View style={styles.section}>
              <Text style={styles.description}>{description}</Text>
            </View>
          )}

          {/* Full Content */}
          {content && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('description')}</Text>
              <Text style={styles.contentText}>{content}</Text>
            </View>
          )}

          {/* Sub Services */}
          {service.sub_services && service.sub_services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('sub_services')}</Text>
              {service.sub_services.map((subService) => {
                const subName = tField(subService.name_ar, subService.name_en);
                const subDesc = tField(subService.description_ar, subService.description_en);
                
                return (
                  <View key={subService.id} style={styles.subServiceCard}>
                    <View style={styles.subServiceHeader}>
                      <Text style={styles.subServiceName}>{subName}</Text>
                      {subService.price && (
                        <Text style={styles.subServicePrice}>
                          {subService.price} {t('sar')}
                        </Text>
                      )}
                    </View>
                    {subDesc && (
                      <Text style={styles.subServiceDesc}>{subDesc}</Text>
                    )}
                    {subService.duration && (
                      <Text style={styles.subServiceDuration}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        {' '}{subService.duration} {t('minutes')}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Related Services */}
          {service.related_services && service.related_services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('related_services')}</Text>
              {service.related_services.map((relatedService) => {
                const relatedTitle = tField(relatedService.title_ar, relatedService.title_en);
                
                return (
                  <TouchableOpacity
                    key={relatedService.id}
                    style={styles.relatedCard}
                    onPress={() => router.push(`/service/${relatedService.slug}`)}
                  >
                    {relatedService.image && (
                      <Image
                        source={{ uri: relatedService.image }}
                        style={styles.relatedImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.relatedContent}>
                      <Text style={styles.relatedTitle} numberOfLines={2}>
                        {relatedTitle}
                      </Text>
                      {relatedService.price && (
                        <Text style={styles.relatedPrice}>
                          {relatedService.price} {t('sar')}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: themeColor }]}
          onPress={handleBookAppointment}
        >
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.bookButtonText}>{t('book_appointment')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  imageGallery: {
    width: width,
    height: width * 0.6,
  },
  image: {
    width: width,
    height: width * 0.6,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  subServiceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  subServiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subServiceName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subServicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d525a',
    marginLeft: 8,
  },
  subServiceDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  subServiceDuration: {
    fontSize: 12,
    color: '#666',
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  relatedImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  relatedContent: {
    flex: 1,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0d525a',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
