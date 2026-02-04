import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { getBlogPost, blogKeys } from '@/api/endpoints/blog';
import { createComment, replyToComment } from '@/api/endpoints/comments';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { LoadingScreen, ErrorView, BlogCard } from '@/components';
import { ShareButton } from '@/components/ShareButton';
import { useTField } from '@/utils/localization';
import { Comment } from '@/api/types/blog';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { ShareLinks } from '@/utils/deepLinking';

// Comment form schema (guest)
const guestCommentSchema = z.object({
  author_name: z.string().min(2, 'Name must be at least 2 characters'),
  author_email: z.string().email('Invalid email address'),
  body: z.string().min(3, 'Comment must be at least 3 characters'),
});

// Comment form schema (authenticated)
const authCommentSchema = z.object({
  body: z.string().min(3, 'Comment must be at least 3 characters'),
});

type GuestCommentForm = z.infer<typeof guestCommentSchema>;
type AuthCommentForm = z.infer<typeof authCommentSchema>;

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const { data: post, isLoading, isError, error, refetch } = useQuery({
    queryKey: blogKeys.detail(slug || ''),
    queryFn: () => getBlogPost(slug || ''),
    enabled: !!slug,
  });

  const isAuthenticated = !!token;

  const {
    control: guestControl,
    handleSubmit: handleGuestSubmit,
    reset: resetGuestForm,
    formState: { errors: guestErrors },
  } = useForm<GuestCommentForm>({
    resolver: zodResolver(guestCommentSchema),
    defaultValues: {
      author_name: '',
      author_email: '',
      body: '',
    },
  });

  const {
    control: authControl,
    handleSubmit: handleAuthSubmit,
    reset: resetAuthForm,
    formState: { errors: authErrors },
  } = useForm<AuthCommentForm>({
    resolver: zodResolver(authCommentSchema),
    defaultValues: {
      body: '',
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: GuestCommentForm | AuthCommentForm) =>
      createComment(post!.id, data),
    onSuccess: () => {
      Alert.alert(t('success'), t('comment_submitted_pending'));
      if (isAuthenticated) {
        resetAuthForm();
      } else {
        resetGuestForm();
      }
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(slug || '') });
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_submit_comment'));
    },
  });

  const replyCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: GuestCommentForm | AuthCommentForm;
    }) => replyToComment(commentId, data),
    onSuccess: () => {
      Alert.alert(t('success'), t('reply_submitted_pending'));
      setReplyingTo(null);
      if (isAuthenticated) {
        resetAuthForm();
      } else {
        resetGuestForm();
      }
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(slug || '') });
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_submit_reply'));
    },
  });

  const onSubmitComment = (data: GuestCommentForm | AuthCommentForm) => {
    if (replyingTo) {
      replyCommentMutation.mutate({ commentId: replyingTo, data });
    } else {
      createCommentMutation.mutate(data);
    }
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    return (
      <View
        key={comment.id}
        style={[styles.commentContainer, isReply && styles.replyContainer]}
      >
        <View style={styles.commentHeader}>
          <View style={styles.commentAuthor}>
            <Ionicons name="person-circle-outline" size={32} color={themeColor} />
            <View style={styles.commentAuthorInfo}>
              <Text style={styles.commentAuthorName}>{comment.author_name}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
          {comment.status === 'pending' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>{t('pending')}</Text>
            </View>
          )}
        </View>
        <Text style={styles.commentBody}>{comment.body}</Text>
        {!isReply && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => {
              setReplyingTo(comment.id);
              // Scroll to form (optional)
            }}
          >
            <Ionicons name="arrow-undo-outline" size={16} color={themeColor} />
            <Text style={[styles.replyButtonText, { color: themeColor }]}>
              {t('reply')}
            </Text>
          </TouchableOpacity>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !post) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_post')}
        onRetry={refetch}
      />
    );
  }

  const title = tField(post.title_ar, post.title_en);
  const content = tField(
    post.body_ar || post.content_ar,
    post.body_en || post.content_en
  );
  const imageUrl = post.image || post.photo;
  const categoryName = post.category
    ? tField(
        post.category.title_ar || post.category.name_ar,
        post.category.title_en || post.category.name_en
      )
    : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('blog_post')}
        </Text>
        <View style={styles.headerRight}>
          <ShareButton
            onShare={() => ShareLinks.blogPost(slug as string, title)}
            color="#fff"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Header Image */}
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
        )}

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        {categoryName && (
          <TouchableOpacity
            style={[styles.categoryBadge, { backgroundColor: themeColor }]}
            onPress={() => {
              if (post.category?.slug) {
                router.push(`/blog/category/${post.category.slug}`);
              }
            }}
          >
            <Text style={styles.categoryText}>{categoryName}</Text>
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.metaText}>
              {new Date(post.created_at).toLocaleDateString()}
            </Text>
          </View>
          {post.author && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{post.author.name}</Text>
            </View>
          )}
        </View>

        {/* Body */}
        {content && (
          <View style={styles.bodyContainer}>
            {content.includes('<') ? (
              <RenderHTML contentWidth={width - 32} source={{ html: content }} />
            ) : (
              <Text style={styles.bodyText}>{content}</Text>
            )}
          </View>
        )}

        {/* Related Posts */}
        {post.related_posts && post.related_posts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('related_posts')}</Text>
            {post.related_posts.map((relatedPost) => (
              <BlogCard
                key={relatedPost.id}
                post={relatedPost}
                onPress={() => router.push(`/blog/${relatedPost.slug}`)}
              />
            ))}
          </View>
        )}

        {/* Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('comments')} {post.comments && `(${post.comments.length})`}
          </Text>

          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => renderComment(comment))
          ) : (
            <Text style={styles.noCommentsText}>{t('no_comments_yet')}</Text>
          )}
        </View>

        {/* Comment Form */}
        <View style={styles.commentFormSection}>
          <Text style={styles.commentFormTitle}>
            {replyingTo ? t('write_reply') : t('leave_comment')}
          </Text>
          {replyingTo && (
            <TouchableOpacity
              style={styles.cancelReplyButton}
              onPress={() => setReplyingTo(null)}
            >
              <Text style={[styles.cancelReplyText, { color: themeColor }]}>
                {t('cancel_reply')}
              </Text>
            </TouchableOpacity>
          )}

          {isAuthenticated ? (
            // Authenticated form
            <View>
              <Controller
                control={authControl}
                name="body"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.textArea,
                      authErrors.body && styles.inputError,
                    ]}
                    placeholder={t('your_comment')}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
              {authErrors.body && (
                <Text style={styles.errorText}>{authErrors.body.message}</Text>
              )}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: themeColor },
                  (createCommentMutation.isPending || replyCommentMutation.isPending) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleAuthSubmit(onSubmitComment)}
                disabled={
                  createCommentMutation.isPending || replyCommentMutation.isPending
                }
              >
                {createCommentMutation.isPending || replyCommentMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>{t('submit')}</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // Guest form
            <View>
              <Controller
                control={guestControl}
                name="author_name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      guestErrors.author_name && styles.inputError,
                    ]}
                    placeholder={t('your_name')}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {guestErrors.author_name && (
                <Text style={styles.errorText}>{guestErrors.author_name.message}</Text>
              )}

              <Controller
                control={guestControl}
                name="author_email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      guestErrors.author_email && styles.inputError,
                    ]}
                    placeholder={t('your_email')}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {guestErrors.author_email && (
                <Text style={styles.errorText}>{guestErrors.author_email.message}</Text>
              )}

              <Controller
                control={guestControl}
                name="body"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.textArea,
                      guestErrors.body && styles.inputError,
                    ]}
                    placeholder={t('your_comment')}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
              {guestErrors.body && (
                <Text style={styles.errorText}>{guestErrors.body.message}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: themeColor },
                  (createCommentMutation.isPending || replyCommentMutation.isPending) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleGuestSubmit(onSubmitComment)}
                disabled={
                  createCommentMutation.isPending || replyCommentMutation.isPending
                }
              >
                {createCommentMutation.isPending || replyCommentMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>{t('submit')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.commentNote}>{t('comment_approval_note')}</Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollContent: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    lineHeight: 34,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  bodyContainer: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
  },
  section: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  commentContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  replyContainer: {
    marginLeft: 20,
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#0d525a',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAuthorInfo: {
    marginLeft: 8,
  },
  commentAuthorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: '#ffc107',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pendingText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  commentBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 8,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 12,
  },
  noCommentsText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  commentFormSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentFormTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  cancelReplyButton: {
    marginBottom: 12,
  },
  cancelReplyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    fontSize: 13,
    color: '#ff6b6b',
    marginTop: -8,
    marginBottom: 8,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  commentNote: {
    fontSize: 13,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});
