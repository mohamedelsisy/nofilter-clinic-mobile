import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { getCheckoutSummary, processCheckout, cartKeys } from '@/api/endpoints/cart';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useConfigStore } from '@/store/configStore';
import { useTField } from '@/utils/localization';
import { LoadingScreen, ErrorView } from '@/components';

type PaymentMethod = 'myfatoorah' | 'tabby' | 'tamara';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();
  const { pendingCouponCode, selectedPaymentMethod, setPaymentMethod } = useCartStore();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: cartKeys.checkoutSummary(pendingCouponCode || undefined),
    queryFn: () => getCheckoutSummary(pendingCouponCode || undefined),
    enabled: !!token,
  });

  const checkoutMutation = useMutation({
    mutationFn: processCheckout,
    onSuccess: async (data) => {
      // Open payment URL in browser
      try {
        const result = await WebBrowser.openBrowserAsync(data.redirect_url);
        
        // After user returns from payment (closed browser)
        if (result.type === 'cancel' || result.type === 'dismiss') {
          // Show success screen with refresh option
          setShowPaymentSuccess(true);
        }
      } catch (err) {
        Alert.alert(t('error'), t('failed_to_open_payment'));
      }
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('checkout_failed'));
    },
  });

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      Alert.alert(t('error'), t('select_payment_method'));
      return;
    }

    checkoutMutation.mutate({
      payment_method: selectedPaymentMethod,
      coupon_code: pendingCouponCode || undefined,
    });
  };

  const handleRefreshAfterPayment = async () => {
    // Invalidate cart queries
    await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    
    // Refetch checkout summary to see if cart is empty
    const freshSummary = await refetch();
    
    if (freshSummary.data?.items.length === 0) {
      // Cart is empty - order created!
      Alert.alert(
        t('success'),
        t('order_created_successfully'),
        [
          {
            text: t('ok'),
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } else {
      setShowPaymentSuccess(false);
    }
  };

  // Redirect to booking if no token
  if (!token) {
    router.replace('/(tabs)/booking');
    return null;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_checkout')}
        onRetry={refetch}
      />
    );
  }

  if (!summary || summary.items.length === 0) {
    // Cart is empty
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>{t('cart_empty')}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColor }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>{t('back_to_cart')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show payment success screen
  if (showPaymentSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: `${themeColor}20` }]}>
            <Ionicons name="checkmark-circle" size={64} color={themeColor} />
          </View>
          <Text style={styles.successTitle}>{t('payment_completed_question')}</Text>
          <Text style={styles.successMessage}>{t('payment_completed_message')}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: themeColor }]}
            onPress={handleRefreshAfterPayment}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>{t('refresh')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={[styles.secondaryButtonText, { color: themeColor }]}>
              {t('back_to_home')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const paymentMethods: { id: PaymentMethod; name: string; icon: string }[] = [
    { id: 'myfatoorah', name: 'MyFatoorah', icon: 'card-outline' },
    { id: 'tabby', name: 'Tabby', icon: 'wallet-outline' },
    { id: 'tamara', name: 'Tamara', icon: 'cash-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Patient Info */}
        {summary.patient && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('patient_information')}</Text>
            <View style={styles.patientCard}>
              <View style={styles.patientRow}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.patientText}>{summary.patient.name}</Text>
              </View>
              <View style={styles.patientRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.patientText}>{summary.patient.phone}</Text>
              </View>
              {summary.patient.email && (
                <View style={styles.patientRow}>
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <Text style={styles.patientText}>{summary.patient.email}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('order_items')} ({summary.items.length})
          </Text>
          {summary.items.map((item) => {
            const title = tField(item.offer.title_ar, item.offer.title_en);
            return (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemTitle}>{title}</Text>
                  <Text style={styles.orderItemQuantity}>
                    {t('quantity')}: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  {item.total} {t('sar')}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('payment_method')}</Text>
          {paymentMethods.map((method) => {
            const isSelected = selectedPaymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  isSelected && { borderColor: themeColor, borderWidth: 2 },
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <View style={styles.paymentMethodContent}>
                  <View style={[styles.radioOuter, isSelected && { borderColor: themeColor }]}>
                    {isSelected && <View style={[styles.radioInner, { backgroundColor: themeColor }]} />}
                  </View>
                  <Ionicons name={method.icon as any} size={24} color={isSelected ? themeColor : '#666'} />
                  <Text style={[styles.paymentMethodName, isSelected && { color: themeColor }]}>
                    {method.name}
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color={themeColor} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>{t('order_summary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
            <Text style={styles.summaryValue}>
              {summary.subtotal} {t('sar')}
            </Text>
          </View>
          {summary.discount > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('discount')}</Text>
                <Text style={[styles.summaryValue, { color: '#4caf50' }]}>
                  -{summary.discount} {t('sar')}
                </Text>
              </View>
              {summary.coupon && (
                <View style={styles.couponBadge}>
                  <Ionicons name="pricetag" size={16} color={themeColor} />
                  <Text style={styles.couponBadgeText}>{summary.coupon.code}</Text>
                </View>
              )}
            </>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('tax')}</Text>
            <Text style={styles.summaryValue}>
              {summary.tax} {t('sar')}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>{t('total')}</Text>
            <Text style={[styles.grandTotalValue, { color: themeColor }]}>
              {summary.total} {t('sar')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: themeColor }]}
          onPress={handlePayNow}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="card" size={20} color="#fff" />
              <Text style={styles.payButtonText}>
                {t('pay_now')} - {summary.total} {t('sar')}
              </Text>
            </>
          )}
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
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d525a',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  couponBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  couponBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
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
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  secondaryButton: {
    paddingVertical: 12,
    marginTop: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
