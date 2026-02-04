import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlogPostListItem } from '@/api/types/blog';
import { useTField } from '@/utils/localization';

interface BlogCardProps {
  post: BlogPostListItem;
  onPress: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onPress }) => {
  const { t } = useTranslation();
  const tField = useTField();

  const title = tField(post.title_ar, post.title_en);
  const summary = tField(
    post.summary_ar || post.excerpt_ar,
    post.summary_en || post.excerpt_en
  );
  const imageUrl = post.image || post.photo;
  const categoryName = post.category
    ? tField(post.category.title_ar || post.category.name_ar, post.category.title_en || post.category.name_en)
    : null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.content}>
        {categoryName && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryName}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {summary && (
          <Text style={styles.summary} numberOfLines={3}>
            {summary}
          </Text>
        )}
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.date}>{formatDate(post.created_at)}</Text>
          </View>
          {post.author && (
            <View style={styles.authorContainer}>
              <Ionicons name="person-outline" size={14} color="#666" />
              <Text style={styles.author}>{post.author.name}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: '#0d525a',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
