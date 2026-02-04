import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { OfferListItem } from '@/api/types/offers';
import { useTField } from '@/utils/localization';
import { PriceRow } from './PriceRow';

interface OfferCardProps {
  offer: OfferListItem;
  onPress: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
  const { t } = useTranslation();
  const tField = useTField();

  const title = tField(offer.title_ar, offer.title_en);
  const serviceName = offer.service
    ? tField(offer.service.name_ar, offer.service.name_en)
    : null;
  const imageUrl = offer.photo || offer.image;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Image */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="pricetag" size={40} color="#ccc" />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Service Tag */}
        {serviceName && (
          <View style={styles.serviceTag}>
            <Ionicons name="medical" size={14} color="#666" />
            <Text style={styles.serviceText} numberOfLines={1}>
              {serviceName}
            </Text>
          </View>
        )}

        {/* Price Row */}
        <PriceRow newPrice={offer.new_price} oldPrice={offer.old_price} size="medium" />

        {/* Status Badge */}
        {offer.is_active === false && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveText}>{t('offer_inactive')}</Text>
          </View>
        )}

        {/* Valid Until */}
        {offer.valid_to && (
          <View style={styles.validityRow}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.validityText}>
              {t('valid_until')}: {new Date(offer.valid_to).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* Arrow */}
      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 140,
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  inactiveBadge: {
    backgroundColor: '#ffebee',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  inactiveText: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  validityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  arrow: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
