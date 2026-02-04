import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getBlogPosts, blogKeys } from '@/api/endpoints/blog';
import { useConfigStore } from '@/store/configStore';
import { LoadingScreen, ErrorView, BlogCard } from '@/components';

export default function BlogListScreen() {
  const { t } = useTranslation();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: blogKeys.lists(),
    queryFn: ({ pageParam = 1 }) => getBlogPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (
        lastPage.meta &&
        lastPage.meta.current_page &&
        lastPage.meta.last_page &&
        lastPage.meta.current_page < lastPage.meta.last_page
      ) {
        return lastPage.meta.current_page + 1;
      }
      if (lastPage.links?.next && lastPage.meta?.current_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap((page) => page.data) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={themeColor} />
        <Text style={styles.loadingText}>{t('loading_more')}</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>{t('no_blog_posts')}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: themeColor }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && !data) {
    return <LoadingScreen />;
  }

  if (isError && !data) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_blog')}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>{t('blog')}</Text>
        <TouchableOpacity onPress={() => router.push('/blog/search')} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <BlogCard post={item} onPress={() => router.push(`/blog/${item.slug}`)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={themeColor}
            colors={[themeColor]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />

      {/* Load More Button */}
      {hasNextPage && !isFetchingNextPage && posts.length > 0 && (
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity
            style={[styles.loadMoreButton, { borderColor: themeColor }]}
            onPress={handleLoadMore}
          >
            <Text style={[styles.loadMoreText, { color: themeColor }]}>
              {t('load_more')}
            </Text>
            <Ionicons name="chevron-down" size={20} color={themeColor} />
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 16,
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  loadMoreContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
