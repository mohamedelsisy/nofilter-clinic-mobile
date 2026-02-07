import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '@/store/bookingStore';
import { useConfigStore } from '@/store/configStore';
import { servicesApi } from '@/api/endpoints';
import { Service } from '@/api/types';
import { useTField } from '@/utils/localization';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';

export default function BookingDepartmentsScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { selectedDepartment, setDepartment } = useBookingStore();
  const [localSelected, setLocalSelected] = useState<any>(selectedDepartment);

  const {
    data: servicesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getServices(),
  });

  // Convert services to departments format
  const departments = servicesResponse?.data?.map((service: Service) => ({
    id: service.id,
    name_en: service.name_en || service.name,
    name_ar: service.name_ar,
    description_en: service.description_en || service.description,
    description_ar: service.description_ar,
    slug: service.slug,
  })) || [];

  const handleSelectDepartment = (department: any) => {
    setLocalSelected(department);
  };

  const handleNext = () => {
    if (localSelected) {
      setDepartment(localSelected);
      router.push('/(tabs)/booking/doctors');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !servicesResponse) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_departments')}
        onRetry={refetch}
      />
    );
  }

  if (departments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('no_departments_available')}</Text>
        </View>
      </View>
    );
  }

  const renderDepartment = ({ item }: { item: any }) => {
    const name = tField(item.name_ar, item.name_en);
    const description = tField(item.description_ar, item.description_en);
    const isSelected = localSelected?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.departmentCard,
          isSelected && { borderColor: themeColor, borderWidth: 2 },
        ]}
        onPress={() => handleSelectDepartment(item)}
      >
        <View style={styles.departmentContent}>
          <View style={styles.departmentHeader}>
            <View style={[styles.radioOuter, isSelected && { borderColor: themeColor }]}>
              {isSelected && <View style={[styles.radioInner, { backgroundColor: themeColor }]} />}
            </View>
            <Text style={styles.departmentName}>{name}</Text>
          </View>
          {description && (
            <Text style={styles.departmentDescription}>{description}</Text>
          )}
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={themeColor} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={departments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDepartment}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            colors={[themeColor]}
            tintColor={themeColor}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{t('no_departments_available')}</Text>
          </View>
        }
      />

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: localSelected ? themeColor : '#ccc' },
          ]}
          onPress={handleNext}
          disabled={!localSelected}
        >
          <Text style={styles.nextButtonText}>{t('next')}</Text>
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
  listContent: {
    padding: 16,
  },
  departmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  departmentContent: {
    flex: 1,
  },
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  departmentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 36,
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
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
