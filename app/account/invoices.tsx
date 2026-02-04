import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import {
  getInvoice,
  downloadInvoicePdf,
  payInvoice,
  invoicesKeys,
} from '@/api/endpoints/invoices';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { LoadingScreen, ErrorView } from '@/components';
import { useTField } from '@/utils/localization';

export default function MyInvoicesScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();
  const [invoiceId, setInvoiceId] = useState('');
  const [loadedInvoiceId, setLoadedInvoiceId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('myfatoorah');

  // Redirect if no token
  if (!token) {
    router.replace('/(tabs)/booking');
    return null;
  }

  const {
    data: invoice,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: invoicesKeys.detail(loadedInvoiceId!),
    queryFn: () => getInvoice(loadedInvoiceId!),
    enabled: loadedInvoiceId !== null,
  });

  const downloadPdfMutation = useMutation({
    mutationFn: downloadInvoicePdf,
    onSuccess: async (data, invoiceId) => {
      try {
        const fileUri = `${FileSystem.cacheDirectory}invoice_${invoiceId}.pdf`;
        const base64 = btoa(
          new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: t('invoice_pdf'),
          });
        } else {
          Alert.alert(t('success'), t('pdf_saved_to_cache'));
        }
      } catch (err: any) {
        Alert.alert(t('error'), err.message || t('failed_to_save_pdf'));
      }
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_download_pdf'));
    },
  });

  const payInvoiceMutation = useMutation({
    mutationFn: ({ id, method }: { id: number; method: string }) => payInvoice(id, method),
    onSuccess: async (data) => {
      if (data.redirect_url) {
        await WebBrowser.openBrowserAsync(data.redirect_url);
        Alert.alert(
          t('payment_status'),
          t('payment_completed_question'),
          [
            {
              text: t('refresh'),
              onPress: () => refetch(),
            },
          ],
          { cancelable: true }
        );
      } else {
        Alert.alert(t('success'), t('payment_initiated'));
        refetch();
      }
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_initiate_payment'));
    },
  });

  const handleLoadInvoice = () => {
    const id = parseInt(invoiceId, 10);
    if (isNaN(id) || id <= 0) {
      Alert.alert(t('error'), t('invalid_invoice_id'));
      return;
    }
    setLoadedInvoiceId(id);
  };

  const handleDownloadPdf = () => {
    if (loadedInvoiceId) {
      downloadPdfMutation.mutate(loadedInvoiceId);
    }
  };

  const handlePayInvoice = () => {
    if (loadedInvoiceId) {
      payInvoiceMutation.mutate({ id: loadedInvoiceId, method: selectedPaymentMethod });
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'unpaid':
        return '#f44336';
      case 'partially_paid':
        return '#FF9800';
      case 'pending':
        return '#2196F3';
      case 'refunded':
        return '#9C27B0';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('my_invoices')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>{t('enter_invoice_id')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={t('invoice_id_placeholder')}
              placeholderTextColor="#999"
              value={invoiceId}
              onChangeText={setInvoiceId}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.loadButton, { backgroundColor: themeColor }]}
              onPress={handleLoadInvoice}
              disabled={!invoiceId.trim()}
            >
              <Text style={styles.loadButtonText}>{t('load')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>{t('invoice_id_hint')}</Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColor} />
            <Text style={styles.loadingText}>{t('loading_invoice')}</Text>
          </View>
        )}

        {/* Error State */}
        {isError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
            <Text style={styles.errorText}>
              {(error as any)?.message || t('failed_to_load_invoice')}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: themeColor }]}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>{t('retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Invoice Detail */}
        {invoice && (
          <View style={styles.invoiceContainer}>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceNumber}>
                {t('invoice')} #{invoice.invoice_number}
              </Text>
              <View
                style={[
                  styles.paymentStatusBadge,
                  { backgroundColor: getPaymentStatusColor(invoice.payment_status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.paymentStatusText,
                    { color: getPaymentStatusColor(invoice.payment_status) },
                  ]}
                >
                  {t(invoice.payment_status)}
                </Text>
              </View>
            </View>

            <View style={styles.invoiceInfo}>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>{t('issue_date')}:</Text>
                <Text style={styles.invoiceValue}>{invoice.issue_date}</Text>
              </View>
              {invoice.due_date && (
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceLabel}>{t('due_date')}:</Text>
                  <Text style={styles.invoiceValue}>{invoice.due_date}</Text>
                </View>
              )}
            </View>

            {/* Items */}
            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>{t('items')}</Text>
              {invoice.items.map((item, index) => (
                <View key={index} style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemDescription}>
                      {tField(item.description_ar, item.description) ||
                        item.service_name ||
                        item.offer_name ||
                        t('item')}
                    </Text>
                    <Text style={styles.itemQuantity}>
                      x{item.quantity} @ {item.price} {t('sar')}
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    {item.total} {t('sar')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Totals */}
            <View style={styles.totalsSection}>
              {invoice.subtotal !== undefined && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('subtotal')}:</Text>
                  <Text style={styles.totalValue}>
                    {invoice.subtotal} {t('sar')}
                  </Text>
                </View>
              )}
              {invoice.discount_amount !== undefined && invoice.discount_amount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('discount')}:</Text>
                  <Text style={styles.totalValue}>
                    -{invoice.discount_amount} {t('sar')}
                  </Text>
                </View>
              )}
              {invoice.tax_amount !== undefined && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('tax')}:</Text>
                  <Text style={styles.totalValue}>
                    {invoice.tax_amount} {t('sar')}
                  </Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>{t('total')}:</Text>
                <Text style={styles.grandTotalValue}>
                  {invoice.total_amount} {t('sar')}
                </Text>
              </View>
              {invoice.paid_amount !== undefined && invoice.paid_amount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('paid_amount')}:</Text>
                  <Text style={[styles.totalValue, { color: '#4CAF50' }]}>
                    {invoice.paid_amount} {t('sar')}
                  </Text>
                </View>
              )}
              {invoice.remaining_amount !== undefined && invoice.remaining_amount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('remaining_amount')}:</Text>
                  <Text style={[styles.totalValue, { color: '#f44336' }]}>
                    {invoice.remaining_amount} {t('sar')}
                  </Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={handleDownloadPdf}
                disabled={downloadPdfMutation.isPending}
              >
                {downloadPdfMutation.isPending ? (
                  <ActivityIndicator color="#2196F3" />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={20} color="#2196F3" />
                    <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>
                      {t('download_pdf')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {(invoice.can_pay !== false && invoice.payment_status !== 'paid') && (
                <>
                  <Text style={styles.paymentMethodLabel}>{t('payment_method')}:</Text>
                  <View style={styles.paymentMethods}>
                    {['myfatoorah', 'tabby', 'tamara'].map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.paymentMethodOption,
                          selectedPaymentMethod === method && {
                            borderColor: themeColor,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => setSelectedPaymentMethod(method)}
                      >
                        <Ionicons
                          name={
                            selectedPaymentMethod === method
                              ? 'radio-button-on'
                              : 'radio-button-off'
                          }
                          size={20}
                          color={themeColor}
                        />
                        <Text style={styles.paymentMethodText}>{t(method)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: themeColor }]}
                    onPress={handlePayInvoice}
                    disabled={payInvoiceMutation.isPending}
                  >
                    {payInvoiceMutation.isPending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="card-outline" size={20} color="#fff" />
                        <Text style={styles.payButtonText}>{t('pay_invoice')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {/* Initial State */}
        {!loadedInvoiceId && !isLoading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>{t('enter_invoice_id_to_view')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 12,
  },
  loadButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputHint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  invoiceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceInfo: {
    marginBottom: 16,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 14,
    color: '#666',
  },
  invoiceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemsSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalsSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  grandTotalRow: {
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d525a',
  },
  actionsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  downloadButton: {
    backgroundColor: '#E3F2FD',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  paymentMethodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  paymentMethodText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
