import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getOfferById, offersKeys } from '@/api/endpoints/offers';
import { addToCart, cartKeys } from '@/api/endpoints/cart';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { useTField } from '@/utils/localization';
import { LoadingScreen, ErrorView, PriceRow } from '@/components';
import { ShareButton } from '@/components/ShareButton';
import { ShareLinks } from '@/utils/deepLinking';

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: offer,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: offersKeys.detail(Number(id)),
    queryFn: () => getOfferById(Number(id)),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Invalidate cart queries to update badge
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      Alert.alert(t('success'), t('offer_added_to_cart'));
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_add_to_cart'));
    },
  });

  const handleAddToCart = () => {
    if (!token) {
      // Show auth modal
      setShowAuthModal(true);
    } else {
      // Add to cart with quantity 1
      addToCartMutation.mutate({
        offer_id: Number(id),
        quantity: 1,
      });
    }
  };

  const handleBookAppointment = () => {
    setShowAuthModal(false);
    router.push('/(tabs)/booking');
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !offer) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_offer')}
        onRetry={refetch}
      />
    );
  }

  const title = tField(offer.title_ar, offer.title_en);
  const description = tField(offer.description_ar, offer.description_en);
  const terms = tField(offer.terms_ar, offer.terms_en);
  const serviceName = offer.service
    ? tField(offer.service.name_ar, offer.service.name_en)
    : null;
  const imageUrl = offer.photo || offer.image;

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
            onShare={() => ShareLinks.offer(Number(id), title)}
            color="#fff"
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Image */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.placeholderImage]}>
            <Ionicons name="pricetag" size={80} color="#ccc" />
          </View>
        )}

        <View style={styles.detailsContainer}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Service Tag */}
          {serviceName && (
            <View style={styles.serviceTag}>
              <Ionicons name="medical" size={16} color={themeColor} />
              <Text style={styles.serviceText}>{serviceName}</Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <PriceRow newPrice={offer.new_price} oldPrice={offer.old_price} size="large" />
          </View>

          {/* Validity */}
          {(offer.valid_from || offer.valid_to) && (
            <View style={styles.validityContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <View style={styles.validityContent}>
                {offer.valid_from && (
                  <Text style={styles.validityText}>
                    {t('valid_from')}: {new Date(offer.valid_from).toLocaleDateString()}
                  </Text>
                )}
                {offer.valid_to && (
                  <Text style={styles.validityText}>
                    {t('valid_until')}: {new Date(offer.valid_to).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Description */}
          {description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('description')}</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          )}

          {/* Terms & Conditions */}
          {terms && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('terms_and_conditions')}</Text>
              <Text style={styles.termsText}>{terms}</Text>
            </View>
          )}

          {/* Related Offers */}
          {offer.related_offers && offer.related_offers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('related_offers')}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              >
                {offer.related_offers.map((relatedOffer) => {
                  const relatedTitle = tField(relatedOffer.title_ar, relatedOffer.title_en);
                  const relatedImage = relatedOffer.photo || relatedOffer.image;

                  return (
                    <TouchableOpacity
                      key={relatedOffer.id}
                      style={styles.relatedCard}
                      onPress={() => router.push(`/offer/${relatedOffer.id}`)}
                    >
                      {relatedImage ? (
                        <Image source={{ uri: relatedImage }} style={styles.relatedImage} />
                      ) : (
                        <View style={[styles.relatedImage, styles.placeholderImage]}>
                          <Ionicons name="pricetag" size={30} color="#ccc" />
                        </View>
                      )}
                      <Text style={styles.relatedTitle} numberOfLines={2}>
                        {relatedTitle}
                      </Text>
                      <PriceRow
                        newPrice={relatedOffer.new_price}
                        oldPrice={relatedOffer.old_price}
                        size="small"
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: themeColor }]}
          onPress={handleAddToCart}
          disabled={addToCartMutation.isPending}
        >
          {addToCartMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cart" size={20} color="#fff" />
              <Text style={styles.addToCartText}>{t('add_to_cart')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Auth Modal */}
      <Modal
        visible={showAuthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIcon, { backgroundColor: `${themeColor}20` }]}>
              <Ionicons name="lock-closed" size={40} color={themeColor} />
            </View>

            <Text style={styles.modalTitle}>{t('account_required')}</Text>
            <Text style={styles.modalMessage}>{t('account_required_message')}</Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: themeColor }]}
              onPress={handleBookAppointment}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>{t('book_appointment')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleContinueAsGuest}>
              <Text style={[styles.modalSecondaryText, { color: themeColor }]}>
                {t('continue_as_guest')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  serviceText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  priceContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  validityContent: {
    flex: 1,
    marginLeft: 12,
  },
  validityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  relatedList: {
    paddingVertical: 8,
  },
  relatedCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalSecondaryButton: {
    paddingVertical: 10,
  },
  modalSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
