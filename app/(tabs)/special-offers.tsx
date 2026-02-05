import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSpecialOffers, specialOffersKeys } from '@/api/endpoints/specialOffers';
import { useConfigStore } from '@/store/configStore';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function SpecialOffersScreen() {
  const { t, i18n } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const isRTL = i18n.language === 'ar';

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: specialOffersKeys.list(1, { active_only: true }),
    queryFn: () => getSpecialOffers({ page: 1, per_page: 20, active_only: true }),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorView message={t('failed_to_load_special_offers')} onRetry={refetch} />;
  }

  const specialOffers = data?.data || [];

  const renderSpecialOfferCard = ({ item }: any) => {
    const title = i18n.language === 'ar' ? item.title_ar : item.title;
    const description = i18n.language === 'ar' ? item.description_ar : item.description;
    const timeRemaining = item.time_remaining;
    const isExpired = timeRemaining?.expired;

    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: themeColor }]}
        onPress={() => router.push(`/special-offer/${item.id}` as any)}
        activeOpacity={0.7}
      >
        {/* Badge for urgent/limited */}
        {!isExpired && timeRemaining && timeRemaining.days <= 2 && (
          <View style={[styles.urgentBadge, { backgroundColor: '#f44336' }]}>
            <Ionicons name="flash" size={14} color="#fff" />
            <Text style={styles.urgentText}>
              {timeRemaining.days > 0
                ? `${timeRemaining.days}d ${timeRemaining.hours}h`
                : `${timeRemaining.hours}h ${timeRemaining.minutes}m`}
            </Text>
          </View>
        )}

        {/* Expired badge */}
        {isExpired && (
          <View style={[styles.expiredBadge, { backgroundColor: '#999' }]}>
            <Text style={styles.expiredText}>{t('expired')}</Text>
          </View>
        )}

        {/* Image */}
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        {/* Discount badge */}
        {item.discount_percentage > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: themeColor }]}>
            <Text style={styles.discountText}>-{item.discount_percentage}%</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.discountPrice, { color: themeColor }]}>
              {item.discount_price} {t('sar')}
            </Text>
            {item.original_price !== item.discount_price && (
              <Text style={styles.originalPrice}>{item.original_price} {t('sar')}</Text>
            )}
          </View>

          {/* Stock info */}
          {item.remaining_quantity !== null && item.remaining_quantity !== undefined && (
            <View style={styles.stockRow}>
              <Ionicons name="pricetag" size={14} color="#666" />
              <Text style={styles.stockText}>
                {t('remaining')}: {item.remaining_quantity}
              </Text>
            </View>
          )}

          {/* Time remaining (if not expired) */}
          {!isExpired && timeRemaining && (
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={themeColor} />
              <Text style={[styles.timeText, { color: themeColor }]}>
                {t('ends_in')}: {timeRemaining.days > 0 && `${timeRemaining.days}${t('days_short')} `}
                {timeRemaining.hours}h {timeRemaining.minutes}m
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>{t('special_offers')}</Text>
        <View style={styles.headerIcon}>
          <Ionicons name="flash" size={24} color="#fff" />
        </View>
      </View>

      {/* Info banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color={themeColor} />
        <Text style={styles.infoText}>{t('special_offers_info')}</Text>
      </View>

      {/* List */}
      <FlatList
        data={specialOffers}
        renderItem={renderSpecialOfferCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={themeColor} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="flash-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{t('no_special_offers')}</Text>
            <Text style={styles.emptySubtext}>{t('check_back_soon')}</Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    gap: 4,
  },
  urgentText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  expiredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  expiredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  stockText: {
    fontSize: 13,
    color: '#666',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
});
