import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useConfigStore } from '@/store/configStore';
import { getServices, servicesKeys } from '@/api/endpoints/services';
import { ServiceListItem } from '@/api/types/services';
import { useTField } from '@/utils/localization';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';

export default function ServicesScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch services with pagination using proper query keys
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: servicesKeys.list({
      page: currentPage,
      search: debouncedSearch || undefined,
    }),
    queryFn: () => getServices({
      page: currentPage,
      search: debouncedSearch || undefined,
    }),
    placeholderData: (previousData) => previousData,
  });

  const services = response?.data || [];
  const meta = response?.meta;
  const hasNextPage = meta && meta.current_page && meta.last_page 
    ? meta.current_page < meta.last_page 
    : false;
  const hasPrevPage = meta && meta.current_page ? meta.current_page > 1 : false;

  // Initial loading
  if (isLoading && !isFetching) {
    return <LoadingScreen />;
  }

  // Error state
  if (error && !services.length) {
    return (
      <ErrorView
        message={(error as any)?.message || t('something_went_wrong')}
        onRetry={refetch}
      />
    );
  }

  // Render service card
  const renderServiceCard = ({ item }: { item: ServiceListItem }) => {
    const title = tField(item.title_ar, item.title_en);
    const description = tField(item.description_ar, item.description_en);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/service/${item.slug}`)}
        activeOpacity={0.7}
      >
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text style={styles.cardDescription} numberOfLines={3}>
              {description}
            </Text>
          )}
          <View style={styles.cardFooter}>
            {item.price && (
              <View style={styles.priceContainer}>
                <Ionicons name="cash-outline" size={16} color={themeColor} />
                <Text style={[styles.price, { color: themeColor }]}>
                  {item.price} {t('sar')}
                </Text>
              </View>
            )}
            {item.duration && (
              <View style={styles.durationContainer}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.duration}>
                  {item.duration} {t('minutes')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="medical-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {debouncedSearch ? t('no_results') : t('no_services')}
      </Text>
      {debouncedSearch && (
        <Text style={styles.emptySubtitle}>
          {t('try_different_search')}
        </Text>
      )}
    </View>
  );

  // Footer with pagination controls
  const renderFooter = () => {
    if (!meta || (!hasNextPage && !hasPrevPage)) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            !hasPrevPage && styles.paginationButtonDisabled,
          ]}
          onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={!hasPrevPage || isFetching}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={hasPrevPage ? themeColor : '#ccc'} 
          />
          <Text
            style={[
              styles.paginationText,
              { color: hasPrevPage ? themeColor : '#ccc' },
            ]}
          >
            {t('previous')}
          </Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            {t('page')} {meta.current_page} {t('of')} {meta.last_page}
          </Text>
          {meta.total && (
            <Text style={styles.totalText}>
              {meta.total} {t('services')}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            !hasNextPage && styles.paginationButtonDisabled,
          ]}
          onPress={() => setCurrentPage(prev => prev + 1)}
          disabled={!hasNextPage || isFetching}
        >
          <Text
            style={[
              styles.paginationText,
              { color: hasNextPage ? themeColor : '#ccc' },
            ]}
          >
            {t('next')}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={hasNextPage ? themeColor : '#ccc'} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>{t('services')}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_services')}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading indicator for pagination */}
      {isFetching && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color={themeColor} />
        </View>
      )}

      {/* Services List */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderServiceCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              setCurrentPage(1);
              refetch();
            }}
            colors={[themeColor]}
            tintColor={themeColor}
          />
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  loadingBar: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 12,
    color: '#999',
  },
});
