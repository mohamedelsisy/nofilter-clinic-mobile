import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getPoints, downloadPointsCard, pointsKeys } from '@/api/endpoints/points';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { LoadingScreen, ErrorView } from '@/components';
import { useTField } from '@/utils/localization';
import { PointsTransaction } from '@/api/types/account';

export default function LoyaltyPointsScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();

  // Redirect if no token
  if (!token) {
    router.replace('/(tabs)/booking');
    return null;
  }

  const {
    data: pointsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: pointsKeys.dashboard(),
    queryFn: getPoints,
  });

  const downloadCardMutation = useMutation({
    mutationFn: downloadPointsCard,
    onSuccess: async (data) => {
      try {
        const fileUri = `${FileSystem.cacheDirectory}loyalty_card.pdf`;
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
            dialogTitle: t('loyalty_card'),
          });
        } else {
          Alert.alert(t('success'), t('pdf_saved_to_cache'));
        }
      } catch (err: any) {
        Alert.alert(t('error'), err.message || t('failed_to_save_pdf'));
      }
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_download_card'));
    },
  });

  const handleDownloadCard = () => {
    downloadCardMutation.mutate();
  };

  const getTransactionIcon = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earn':
        return 'arrow-up-circle';
      case 'redeem':
        return 'arrow-down-circle';
      case 'expire':
        return 'time-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getTransactionColor = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earn':
        return '#4CAF50';
      case 'redeem':
        return '#2196F3';
      case 'expire':
        return '#f44336';
      default:
        return '#999';
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !pointsData) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_points')}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('loyalty_points')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={themeColor}
            colors={[themeColor]}
          />
        }
      >
        {/* Wallet Card */}
        <View style={[styles.walletCard, { backgroundColor: themeColor }]}>
          <View style={styles.walletHeader}>
            <Ionicons name="wallet" size={32} color="#fff" />
            <Text style={styles.walletLabel}>{t('available_balance')}</Text>
          </View>
          <Text style={styles.walletBalance}>
            {pointsData.wallet.available_balance.toLocaleString()}
          </Text>
          <Text style={styles.walletSubtext}>{t('points')}</Text>

          {pointsData.wallet.pending_balance !== undefined &&
            pointsData.wallet.pending_balance > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>
                  +{pointsData.wallet.pending_balance} {t('pending')}
                </Text>
              </View>
            )}

          <TouchableOpacity
            style={styles.downloadCardButton}
            onPress={handleDownloadCard}
            disabled={downloadCardMutation.isPending}
          >
            {downloadCardMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.downloadCardText}>{t('download_loyalty_card')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tier Info */}
        {pointsData.tier && (
          <View style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <Ionicons name="trophy" size={24} color={themeColor} />
              <Text style={styles.tierName}>
                {tField(pointsData.tier.name_ar, pointsData.tier.name)}
              </Text>
            </View>
            <Text style={styles.tierPoints}>
              {pointsData.tier.current_points} {t('points')}
            </Text>
            {pointsData.tier.points_to_next_tier !== undefined &&
              pointsData.tier.points_to_next_tier > 0 && (
                <Text style={styles.tierNextText}>
                  {pointsData.tier.points_to_next_tier} {t('points_to_next_tier')}
                </Text>
              )}
          </View>
        )}

        {/* Stats */}
        {pointsData.stats && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t('statistics')}</Text>
            <View style={styles.statsGrid}>
              {pointsData.stats.total_earned !== undefined && (
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                    {pointsData.stats.total_earned.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>{t('total_earned')}</Text>
                </View>
              )}
              {pointsData.stats.total_redeemed !== undefined && (
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#2196F3' }]}>
                    {pointsData.stats.total_redeemed.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>{t('total_redeemed')}</Text>
                </View>
              )}
              {pointsData.stats.total_expired !== undefined && (
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#f44336' }]}>
                    {pointsData.stats.total_expired.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>{t('total_expired')}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>{t('recent_transactions')}</Text>
          {pointsData.transactions && pointsData.transactions.length > 0 ? (
            pointsData.transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View
                  style={[
                    styles.transactionIcon,
                    { backgroundColor: getTransactionColor(transaction.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getTransactionIcon(transaction.type) as any}
                    size={24}
                    color={getTransactionColor(transaction.type)}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {tField(transaction.description_ar, transaction.description) ||
                      t(transaction.type)}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionPoints,
                    { color: getTransactionColor(transaction.type) },
                  ]}
                >
                  {transaction.type === 'earn' ? '+' : '-'}
                  {transaction.points}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactionsText}>{t('no_transactions')}</Text>
          )}
        </View>
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
  walletCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 12,
  },
  walletBalance: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  walletSubtext: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  pendingBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  pendingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  downloadCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  downloadCardText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  tierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  tierPoints: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0d525a',
    marginBottom: 4,
  },
  tierNextText: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#666',
  },
  transactionPoints: {
    fontSize: 18,
    fontWeight: '700',
  },
  noTransactionsText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 24,
  },
});
