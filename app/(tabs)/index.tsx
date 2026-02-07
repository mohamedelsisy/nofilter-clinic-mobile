import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';
import { siteApi } from '@/api/endpoints';
import { specialOffersApi } from '@/api/endpoints/special-offers';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';
import { ServiceCard } from '@/components/ServiceCard';
import { DoctorCard } from '@/components/DoctorCard';
import { OfferCard } from '@/components/OfferCard';
import { Ionicons } from '@expo/vector-icons';
import { useFontFamily } from '@/utils/fonts';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width;
const ITEM_WIDTH = width - 40;

export default function HomeScreen() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { settings, setSettings, getThemeColor } = useConfigStore();
  const themeColor = getThemeColor();
  const fonts = useFontFamily();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

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

  // Fetch special offers
  const { data: specialOffersData } = useQuery({
    queryKey: ['special-offers', 'homepage'],
    queryFn: () => specialOffersApi.getSpecialOffers({ page: 1 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
            <Text style={[styles.headerTitle, { fontFamily: fonts.bold }]}>
              {clinicName || 'IMCKSA'}
            </Text>
            <Text style={[styles.headerSubtitle, { fontFamily: fonts.regular }]}>
              {t('welcome')}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Ionicons name="language" size={24} color="#fff" />
          <Text style={styles.languageText}>{language === 'ar' ? 'EN' : 'ع'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Sliders with Pagination */}
        {homepageData?.sliders && homepageData.sliders.length > 0 && (
          <View style={styles.sliderContainer}>
            <Animated.FlatList
              horizontal
              data={homepageData.sliders}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={ITEM_WIDTH + 20}
              decelerationRate="fast"
              bounces={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (ITEM_WIDTH + 20)
                );
                setActiveSlide(index);
              }}
              renderItem={({ item }) => {
                const title = language === 'ar' ? item.title_ar : item.title;
                return (
                  <View style={styles.sliderItem}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.sliderImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.sliderGradient}
                    >
                      {title && (
                        <Text style={[styles.sliderTitle, { fontFamily: fonts.bold }]}>
                          {title}
                        </Text>
                      )}
                    </LinearGradient>
                  </View>
                );
              }}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {homepageData.sliders.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeSlide && styles.paginationDotActive,
                    index === activeSlide && { backgroundColor: themeColor },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Enhanced Services Section */}
        {homepageData?.services && homepageData.services.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="medkit" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold, marginLeft: 8 }]}>
                  {t('our_services')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')} →
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={homepageData.services}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesContainer}
              renderItem={({ item }) => {
                const name = language === 'ar' ? item.name_ar : item.name;
                const description = language === 'ar' ? item.description_ar : item.description;
                return (
                  <TouchableOpacity
                    style={styles.serviceCard}
                    onPress={() => {
                      const identifier = item.slug || item.id.toString();
                      router.push(`/service/${identifier}`);
                    }}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.serviceImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <LinearGradient
                        colors={[themeColor, '#0a3d43']}
                        style={styles.serviceImagePlaceholder}
                      >
                        <Ionicons name="medical" size={40} color="#fff" />
                      </LinearGradient>
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={styles.serviceOverlay}
                    >
                      <Text style={[styles.serviceName, { fontFamily: fonts.bold }]} numberOfLines={2}>
                        {name}
                      </Text>
                      {item.price && (
                        <View style={styles.servicePriceTag}>
                          <Text style={styles.servicePriceText}>
                            {item.price} {t('sar')}
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* Special Offers */}
        {specialOffersData?.data && specialOffersData.data.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="pricetag" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold, marginLeft: 8 }]}>
                  {t('special_offers')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/special-offers')}>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')} →
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={specialOffersData.data.slice(0, 5)}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <OfferCard
                  offer={item as any}
                  onPress={() => router.push(`/special-offer/${item.id}`)}
                />
              )}
            />
          </View>
        )}

        {/* Doctors */}
        {homepageData?.doctors && homepageData.doctors.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="people" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold, marginLeft: 8 }]}>
                  {t('our_doctors')}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')} →
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={homepageData.doctors}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.doctorsContainer}
              renderItem={({ item }) => (
                <DoctorCard
                  doctor={item}
                  onPress={() => console.log('Doctor clicked:', item.id)}
                />
              )}
            />
          </View>
        )}

        {/* Regular Offers */}
        {homepageData?.offers && homepageData.offers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="gift" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold, marginLeft: 8 }]}>
                  {t('latest_offers')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/offers')}>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')} →
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={homepageData.offers.slice(0, 5)}
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

        {/* Blog Posts */}
        {homepageData?.posts && homepageData.posts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="newspaper" size={24} color={themeColor} />
                <Text style={[styles.sectionTitle, { fontFamily: fonts.bold, marginLeft: 8 }]}>
                  {t('latest_blog')}
                </Text>
              </View>
              {/* TODO: Add blog tab/screen */}
              {/* <TouchableOpacity onPress={() => router.push('/blog')}>
                <Text style={[styles.sectionLink, { color: themeColor }]}>
                  {t('view_all')} →
                </Text>
              </TouchableOpacity> */}
            </View>
            <FlatList
              horizontal
              data={homepageData.posts.slice(0, 5)}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const title = language === 'ar' ? item.title_ar : item.title;
                const excerpt = language === 'ar' ? item.excerpt_ar : item.excerpt;
                return (
                  <TouchableOpacity
                    style={styles.blogCard}
                    onPress={() => router.push(`/blog/${item.slug || item.id}`)}
                  >
                    {item.image && (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.blogImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.blogContent}>
                      <Text style={styles.blogTitle} numberOfLines={2}>
                        {title}
                      </Text>
                      {excerpt && (
                        <Text style={styles.blogExcerpt} numberOfLines={3}>
                          {excerpt}
                        </Text>
                      )}
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
    backgroundColor: '#f8f9fa',
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
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.95,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
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
  scrollContent: {
    paddingBottom: 32,
  },
  sliderContainer: {
    height: 240,
    marginTop: 16,
    marginBottom: 8,
  },
  sliderItem: {
    width: ITEM_WIDTH,
    height: 220,
    marginHorizontal: 10,
    marginLeft: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  sliderGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  sliderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  servicesContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  doctorsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  serviceCard: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: '#fff',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    minHeight: 80,
    justifyContent: 'flex-end',
  },
  serviceName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  servicePriceTag: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  servicePriceText: {
    color: '#0d525a',
    fontSize: 14,
    fontWeight: '700',
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  offerImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  offerContent: {
    padding: 14,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  offerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerOriginalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0d525a',
  },
  blogCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    width: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  blogImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  blogContent: {
    padding: 14,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 22,
  },
  blogExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
