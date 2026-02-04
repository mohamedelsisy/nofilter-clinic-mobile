import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';
import { siteApi } from '@/api/endpoints';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';
import { ServiceCard } from '@/components/ServiceCard';
import { DoctorCard } from '@/components/DoctorCard';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { settings, setSettings, getThemeColor } = useConfigStore();
  const themeColor = getThemeColor();

  // Fetch settings
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: siteApi.getSettings,
  });

  // Update settings in config store when data changes
  React.useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData, setSettings]);

  // Fetch homepage data
  const {
    data: homepageData,
    isLoading: isLoadingHomepage,
    error,
    refetch,
  } = useQuery({
    queryKey: ['homepage'],
    queryFn: siteApi.getHomepage,
  });

  // Show loading screen while initial data is loading
  if (isLoadingSettings || isLoadingHomepage) {
    return <LoadingScreen />;
  }

  // Show error view if there's an error
  if (error) {
    return (
      <ErrorView
        message={(error as any)?.message || t('something_went_wrong')}
        onRetry={refetch}
      />
    );
  }

  const clinicName = language === 'ar' ? settings?.clinic_name_ar : settings?.clinic_name;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <View style={styles.headerContent}>
          {settings?.logo && (
            <Image source={{ uri: settings.logo }} style={styles.logo} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{clinicName || 'IMCKSA'}</Text>
            <Text style={styles.headerSubtitle}>{t('welcome')}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Ionicons name="language" size={24} color="#fff" />
          <Text style={styles.languageText}>{language === 'ar' ? 'EN' : 'ع'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sliders */}
        {homepageData?.sliders && homepageData.sliders.length > 0 && (
          <View style={styles.sliderContainer}>
            <FlatList
              horizontal
              data={homepageData.sliders}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={width - 32}
              decelerationRate="fast"
              renderItem={({ item }) => {
                const title = language === 'ar' ? item.title_ar : item.title;
                return (
                  <View style={styles.sliderItem}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.sliderImage}
                      resizeMode="cover"
                    />
                    {title && (
                      <View style={styles.sliderOverlay}>
                        <Text style={styles.sliderTitle}>{title}</Text>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          </View>
        )}

        {/* Featured Services */}
        {homepageData?.featured_services && homepageData.featured_services.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('featured_services')}</Text>
              <TouchableOpacity onPress={() => router.push('/services')}>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')}
                </Text>
              </TouchableOpacity>
            </View>
            {homepageData.featured_services.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => {
                  const identifier = service.slug || service.id.toString();
                  router.push(`/service/${identifier}`);
                }}
              />
            ))}
          </View>
        )}

        {/* Doctors */}
        {homepageData?.doctors && homepageData.doctors.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('our_doctors')}</Text>
              <TouchableOpacity>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={homepageData.doctors}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <DoctorCard
                  doctor={item}
                  onPress={() => console.log('Doctor clicked:', item.id)}
                />
              )}
            />
          </View>
        )}

        {/* Offers */}
        {homepageData?.offers && homepageData.offers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('latest_offers')}</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/offers')}>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={homepageData.offers}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const title = language === 'ar' ? item.title_ar : item.title;
                return (
                  <TouchableOpacity
                    style={styles.offerCard}
                    onPress={() => router.push(`/offer/${item.id}`)}
                  >
                    {item.image && (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.offerImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.offerContent}>
                      <Text style={styles.offerTitle} numberOfLines={2}>
                        {title}
                      </Text>
                      <View style={styles.offerPriceContainer}>
                        {item.original_price && (
                          <Text style={styles.offerOriginalPrice}>
                            {item.original_price} {t('sar')}
                          </Text>
                        )}
                        <Text style={styles.offerPrice}>
                          {item.price} {t('sar')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  languageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  sliderContainer: {
    height: 200,
    marginTop: 16,
  },
  sliderItem: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  sliderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
  },
  sliderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  offerContent: {
    padding: 12,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  offerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d525a',
  },
});
