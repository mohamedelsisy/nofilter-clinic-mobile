import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  getCart,
  removeCartItem,
  updateCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  cartKeys,
} from '@/api/endpoints/cart';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useConfigStore } from '@/store/configStore';
import { useTField } from '@/utils/localization';
import { LoadingScreen, ErrorView } from '@/components';

export default function CartScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();
  const { pendingCouponCode, setPendingCouponCode } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const queryClient = useQueryClient();

  // Refetch cart when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        queryClient.invalidateQueries({ queryKey: cartKeys.all });
      }
    }, [token, queryClient])
  );

  const {
    data: cart,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: cartKeys.cart(pendingCouponCode || undefined),
    queryFn: () => getCart(pendingCouponCode || undefined),
    enabled: !!token,
  });

  const updateMutation = useMutation({
    mutationFn: ({ offerId, quantity }: { offerId: number; quantity: number }) =>
      updateCartItem(offerId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_update_cart'));
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_remove_item'));
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      Alert.alert(t('success'), t('cart_cleared'));
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_clear_cart'));
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      setPendingCouponCode(couponInput);
      setCouponInput('');
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      Alert.alert(t('success'), t('coupon_applied'));
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('invalid_coupon'));
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: removeCoupon,
    onSuccess: () => {
      setPendingCouponCode('');
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_remove_coupon'));
    },
  });

  const handleUpdateQuantity = (offerId: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) {
      // Remove item instead
      handleRemoveItem(offerId);
    } else {
      updateMutation.mutate({ offerId, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (offerId: number) => {
    Alert.alert(t('confirm'), t('remove_item_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('remove'),
        style: 'destructive',
        onPress: () => removeMutation.mutate(offerId),
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert(t('confirm'), t('clear_cart_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('clear'),
        style: 'destructive',
        onPress: () => clearMutation.mutate(),
      },
    ]);
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      Alert.alert(t('error'), t('enter_coupon_code'));
      return;
    }
    applyCouponMutation.mutate({ code: couponInput.trim() });
  };

  const handleRemoveCoupon = () => {
    removeCouponMutation.mutate();
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Show login required UI if no token
  if (!token) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: `${themeColor}20` }]}>
            <Ionicons name="cart-outline" size={64} color={themeColor} />
          </View>
          <Text style={styles.emptyTitle}>{t('cart_requires_account')}</Text>
          <Text style={styles.emptyMessage}>{t('cart_requires_account_message')}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColor }]}
            onPress={() => router.push('/(tabs)/booking')}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>{t('book_appointment')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ErrorView message={(error as any)?.message || t('failed_to_load_cart')} onRetry={refetch} />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>{t('cart_empty')}</Text>
          <Text style={styles.emptyMessage}>{t('cart_empty_message')}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColor }]}
            onPress={() => router.push('/(tabs)/offers')}
          >
            <Text style={styles.primaryButtonText}>{t('browse_offers')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('cart_items')} ({cart.items_count})
          </Text>
          {cart.items.map((item) => {
            const title = tField(item.offer.title_ar, item.offer.title_en);
            const image = item.offer.photo || item.offer.image;

            return (
              <View key={item.id} style={styles.cartItem}>
                {image && <Image source={{ uri: image }} style={styles.itemImage} />}
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {title}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item.price} {t('sar')} × {item.quantity}
                  </Text>
                  <Text style={[styles.itemTotal, { color: themeColor }]}>
                    {t('total')}: {item.total} {t('sar')}
                  </Text>
                </View>
                <View style={styles.itemActions}>
                  {/* Quantity Stepper */}
                  <View style={styles.quantityStepper}>
                    <TouchableOpacity
                      style={[styles.stepperButton, { borderColor: themeColor }]}
                      onPress={() => handleUpdateQuantity(item.offer_id, item.quantity, -1)}
                      disabled={updateMutation.isPending}
                    >
                      <Ionicons name="remove" size={16} color={themeColor} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.stepperButton, { borderColor: themeColor }]}
                      onPress={() => handleUpdateQuantity(item.offer_id, item.quantity, 1)}
                      disabled={updateMutation.isPending}
                    >
                      <Ionicons name="add" size={16} color={themeColor} />
                    </TouchableOpacity>
                  </View>
                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.offer_id)}
                    disabled={removeMutation.isPending}
                  >
                    <Ionicons name="trash-outline" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Coupon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('coupon_code')}</Text>
          {cart.coupon ? (
            <View style={styles.appliedCoupon}>
              <View style={styles.couponInfo}>
                <Ionicons name="pricetag" size={20} color={themeColor} />
                <Text style={styles.couponCode}>{cart.coupon.code}</Text>
                <Text style={styles.couponDiscount}>
                  -{cart.coupon.discount_amount} {t('sar')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleRemoveCoupon}
                disabled={removeCouponMutation.isPending}
              >
                <Ionicons name="close-circle" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInput}>
              <TextInput
                style={styles.couponField}
                placeholder={t('enter_coupon_code')}
                placeholderTextColor="#999"
                value={couponInput}
                onChangeText={setCouponInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: themeColor }]}
                onPress={handleApplyCoupon}
                disabled={applyCouponMutation.isPending}
              >
                {applyCouponMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.applyButtonText}>{t('apply')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('subtotal')}</Text>
            <Text style={styles.totalValue}>
              {cart.subtotal} {t('sar')}
            </Text>
          </View>
          {cart.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('discount')}</Text>
              <Text style={[styles.totalValue, { color: '#4caf50' }]}>
                -{cart.discount} {t('sar')}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('tax')}</Text>
            <Text style={styles.totalValue}>
              {cart.tax} {t('sar')}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>{t('total')}</Text>
            <Text style={[styles.grandTotalValue, { color: themeColor }]}>
              {cart.total} {t('sar')}
            </Text>
          </View>
        </View>

        {/* Clear Cart Button */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
          disabled={clearMutation.isPending}
        >
          <Text style={styles.clearButtonText}>{t('clear_cart')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: themeColor }]}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>{t('proceed_to_checkout')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponField: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  couponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
  },
  totalsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  grandTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 0,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
