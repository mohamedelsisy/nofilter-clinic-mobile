import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getMyAppointments, cancelAppointment, appointmentsKeys } from '@/api/endpoints/appointments';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { LoadingScreen, ErrorView } from '@/components';
import { Appointment } from '@/api/types/account';
import { useTField } from '@/utils/localization';

export default function MyAppointmentsScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if no token
  if (!token) {
    router.replace('/(tabs)/booking');
    return null;
  }

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
    queryKey: appointmentsKeys.lists(),
    queryFn: ({ pageParam = 1 }) => getMyAppointments({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (
        lastPage.meta &&
        lastPage.meta.current_page &&
        lastPage.meta.last_page &&
        lastPage.meta.current_page < lastPage.meta.last_page
      ) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const appointments = data?.pages.flatMap((page) => page.data) || [];

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      Alert.alert(t('success'), t('appointment_cancelled_successfully'));
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
    },
    onError: (err: any) => {
      Alert.alert(t('error'), err.message || t('failed_to_cancel_appointment'));
    },
  });

  const handleCancel = (appointment: Appointment) => {
    Alert.alert(
      t('cancel_appointment'),
      t('cancel_appointment_confirmation'),
      [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes_cancel'),
          style: 'destructive',
          onPress: () => cancelMutation.mutate(appointment.id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#f44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const doctorName = item.doctor
      ? tField(item.doctor.name, item.doctor.name)
      : item.doctor_name || t('unknown');
    const departmentName = item.department
      ? tField(item.department.name_ar, item.department.name)
      : item.department_name || '';

    const canCancel =
      item.can_cancel !== false &&
      (item.status === 'pending' || item.status === 'confirmed');

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentDate}>
            <Ionicons name="calendar" size={20} color={themeColor} />
            <Text style={styles.dateText}>
              {item.appointment_date} {item.appointment_time}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {t(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentBody}>
          {item.doctor && item.doctor.photo && (
            <Image source={{ uri: item.doctor.photo }} style={styles.doctorImage} />
          )}
          <View style={styles.appointmentDetails}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            {departmentName && (
              <Text style={styles.departmentName}>{departmentName}</Text>
            )}
            {item.price !== undefined && (
              <Text style={styles.priceText}>
                {item.price} {t('sar')}
              </Text>
            )}
            {item.reason_for_visit && (
              <Text style={styles.reasonText} numberOfLines={2}>
                {t('reason')}: {item.reason_for_visit}
              </Text>
            )}
          </View>
        </View>

        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(item)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <ActivityIndicator size="small" color="#f44336" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#f44336" />
                <Text style={styles.cancelButtonText}>{t('cancel_appointment')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
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
        <Ionicons name="calendar-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>{t('no_appointments')}</Text>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: themeColor }]}
          onPress={() => router.push('/(tabs)/booking')}
        >
          <Text style={styles.bookButtonText}>{t('book_appointment')}</Text>
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
        message={(error as any)?.message || t('failed_to_load_appointments')}
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
        <Text style={styles.headerTitle}>{t('my_appointments')}</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={themeColor}
            colors={[themeColor]}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
  listContent: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  appointmentDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  departmentName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d525a',
  },
  reasonText: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f44336',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  bookButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookButtonText: {
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
});
