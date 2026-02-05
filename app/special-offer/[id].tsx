import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getSpecialOfferById, specialOffersKeys } from '@/api/endpoints/specialOffers';
import { useConfigStore } from '@/store/configStore';
import { useAuthStore } from '@/store/authStore';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';
import { ShareButton } from '@/components/ShareButton';

const { width } = Dimensions.get('window');

export default function SpecialOfferDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();

  const {
    data: specialOffer,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: specialOffersKeys.detail(Number(id)),
    queryFn: () => getSpecialOfferById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !specialOffer) {
    return (
      <ErrorView message={t('special_offer_not_found')} onRetry={refetch} />
    );
  }

  const title = i18n.language === 'ar' ? specialOffer.title_ar : specialOffer.title;
  const description = i18n.language === 'ar' 
    ? specialOffer.description_ar 
    : specialOffer.description;
  const terms = i18n.language === 'ar'
    ? specialOffer.terms_conditions_ar
    : specialOffer.terms_conditions;

  const timeRemaining = specialOffer.time_remaining;
  const isExpired = timeRemaining?.expired;
  const isOutOfStock = specialOffer.remaining_quantity === 0;
  const canPurchase = !isExpired && !isOutOfStock;

  const handleAddToCart = () => {
    if (!token) {
      Alert.alert(
        t('login_required'),
        t('please_login_to_add_to_cart'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('login'), onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }

    // TODO: Implement add to cart for special offers
    // This might need a different cart endpoint or flag
    Alert.alert(t('success'), t('added_to_cart'));
  };

  const handleBuyNow = () => {
    if (!token) {
      Alert.alert(
        t('login_required'),
        t('please_login_to_buy_now'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('login'), onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }

    // TODO: Implement direct checkout for special offers
    Alert.alert(t('buy_now'), t('redirect_to_checkout'));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerRight}>
          <ShareButton
            path={`special-offer/${specialOffer.id}`}
            title={title}
            message={description}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: specialOffer.image }} style={styles.image} resizeMode="cover" />
          
          {/* Discount badge */}
          {specialOffer.discount_percentage > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: themeColor }]}>
              <Text style={styles.discountText}>-{specialOffer.discount_percentage}%</Text>
            </View>
          )}

          {/* Status badges */}
          {isExpired && (
            <View style={[styles.statusBadge, { backgroundColor: '#999' }]}>
              <Ionicons name="close-circle" size={16} color="#fff" />
              <Text style={styles.statusText}>{t('expired')}</Text>
            </View>
          )}
          {isOutOfStock && !isExpired && (
            <View style={[styles.statusBadge, { backgroundColor: '#f44336' }]}>
              <Ionicons name="ban" size={16} color="#fff" />
              <Text style={styles.statusText}>{t('sold_out')}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.discountPrice, { color: themeColor }]}>
              {specialOffer.discount_price} {t('sar')}
            </Text>
            {specialOffer.original_price !== specialOffer.discount_price && (
              <Text style={styles.originalPrice}>
                {specialOffer.original_price} {t('sar')}
              </Text>
            )}
            {specialOffer.discount_percentage > 0 && (
              <Text style={styles.savings}>
                {t('save')} {specialOffer.original_price - specialOffer.discount_price} {t('sar')}
              </Text>
            )}
          </View>

          {/* Time remaining */}
          {!isExpired && timeRemaining && (
            <View style={[styles.timeCard, { borderColor: themeColor }]}>
              <View style={styles.timeIcon}>
                <Ionicons name="timer" size={24} color={themeColor} />
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>{t('offer_ends_in')}</Text>
                <View style={styles.countdown}>
                  {timeRemaining.days > 0 && (
                    <View style={styles.countdownItem}>
                      <Text style={[styles.countdownValue, { color: themeColor }]}>
                        {timeRemaining.days}
                      </Text>
                      <Text style={styles.countdownLabel}>{t('days')}</Text>
                    </View>
                  )}
                  <View style={styles.countdownItem}>
                    <Text style={[styles.countdownValue, { color: themeColor }]}>
                      {timeRemaining.hours}
                    </Text>
                    <Text style={styles.countdownLabel}>{t('hours')}</Text>
                  </View>
                  <View style={styles.countdownItem}>
                    <Text style={[styles.countdownValue, { color: themeColor }]}>
                      {timeRemaining.minutes}
                    </Text>
                    <Text style={styles.countdownLabel}>{t('minutes')}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Stock info */}
          {specialOffer.remaining_quantity !== null && specialOffer.remaining_quantity !== undefined && (
            <View style={styles.stockCard}>
              <Ionicons 
                name={isOutOfStock ? "alert-circle" : "pricetag"} 
                size={20} 
                color={isOutOfStock ? "#f44336" : themeColor} 
              />
              <Text style={[styles.stockText, isOutOfStock && { color: '#f44336' }]}>
                {isOutOfStock 
                  ? t('sold_out')
                  : `${t('only')} ${specialOffer.remaining_quantity} ${t('left')}`
                }
              </Text>
            </View>
          )}

          {/* Max per customer */}
          {specialOffer.max_per_customer && (
            <View style={styles.infoCard}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.infoText}>
                {t('max_per_customer')}: {specialOffer.max_per_customer}
              </Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('description')}</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          {/* Terms & Conditions */}
          {terms && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('terms_conditions')}</Text>
              <Text style={styles.termsText}>{terms}</Text>
            </View>
          )}

          {/* Validity period */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('validity_period')}</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>{t('starts')}</Text>
                <Text style={styles.dateValue}>
                  {new Date(specialOffer.start_date).toLocaleDateString(
                    i18n.language === 'ar' ? 'ar-SA' : 'en-US'
                  )}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#666" />
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>{t('ends')}</Text>
                <Text style={styles.dateValue}>
                  {new Date(specialOffer.end_date).toLocaleDateString(
                    i18n.language === 'ar' ? 'ar-SA' : 'en-US'
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action buttons */}
      {canPurchase && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.addToCartButton, { borderColor: themeColor }]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color={themeColor} />
            <Text style={[styles.addToCartText, { color: themeColor }]}>
              {t('add_to_cart')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.buyNowButton, { backgroundColor: themeColor }]}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyNowText}>{t('buy_now')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!canPurchase && (
        <View style={styles.footer}>
          <View style={styles.unavailableButton}>
            <Text style={styles.unavailableText}>
              {isExpired ? t('offer_expired') : t('out_of_stock')}
            </Text>
          </View>
        </View>
      )}
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
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  discountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  discountPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  timeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    gap: 12,
  },
  timeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  countdown: {
    flexDirection: 'row',
    gap: 16,
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unavailableButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  unavailableText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
