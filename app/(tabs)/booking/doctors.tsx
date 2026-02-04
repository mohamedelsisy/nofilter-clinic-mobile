import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '@/store/bookingStore';
import { useConfigStore } from '@/store/configStore';
import { getDoctorsByDepartment, bookingKeys } from '@/api/endpoints/booking';
import { BookingDoctor } from '@/api/types/booking';
import { useTField } from '@/utils/localization';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorView } from '@/components/ErrorView';

export default function BookingDoctorsScreen() {
  const { t } = useTranslation();
  const tField = useTField();
  const themeColor = useConfigStore((state) => state.getThemeColor());
  const { selectedDepartment, selectedDoctor, setDoctor } = useBookingStore();
  const [localSelected, setLocalSelected] = useState<BookingDoctor | null>(selectedDoctor);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: doctors,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: bookingKeys.doctors(selectedDepartment?.id || 0),
    queryFn: () => getDoctorsByDepartment(selectedDepartment?.id || 0),
    enabled: !!selectedDepartment,
  });

  // Client-side search filter
  const filteredDoctors = React.useMemo(() => {
    if (!doctors) return [];
    if (!searchQuery) return doctors;

    const query = searchQuery.toLowerCase();
    return doctors.filter((doctor) => {
      const name = tField(doctor.name_ar, doctor.name_en).toLowerCase();
      const specialization = tField(
        doctor.specialization_ar,
        doctor.specialization_en
      )?.toLowerCase();
      return name.includes(query) || specialization?.includes(query);
    });
  }, [doctors, searchQuery, tField]);

  const handleSelectDoctor = (doctor: BookingDoctor) => {
    setLocalSelected(doctor);
  };

  const handleNext = () => {
    if (localSelected) {
      setDoctor(localSelected);
      router.push('/(tabs)/booking/date-slots');
    }
  };

  if (!selectedDepartment) {
    router.back();
    return null;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !doctors) {
    return (
      <ErrorView
        message={(error as any)?.message || t('failed_to_load_doctors')}
        onRetry={refetch}
      />
    );
  }

  const renderDoctor = ({ item }: { item: BookingDoctor }) => {
    const name = tField(item.name_ar, item.name_en);
    const specialization = tField(item.specialization_ar, item.specialization_en);
    const title = tField(item.title_ar, item.title_en);
    const isSelected = localSelected?.id === item.id;
    const photo = item.photo || item.image;

    return (
      <TouchableOpacity
        style={[
          styles.doctorCard,
          isSelected && { borderColor: themeColor, borderWidth: 2 },
        ]}
        onPress={() => handleSelectDoctor(item)}
      >
        {photo && (
          <Image source={{ uri: photo }} style={styles.doctorPhoto} />
        )}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{name}</Text>
          {title && <Text style={styles.doctorTitle}>{title}</Text>}
          {specialization && (
            <Text style={styles.doctorSpecialization}>{specialization}</Text>
          )}
          {item.consultation_fee && (
            <View style={styles.feeContainer}>
              <Ionicons name="cash-outline" size={16} color={themeColor} />
              <Text style={[styles.feeText, { color: themeColor }]}>
                {item.consultation_fee} {t('sar')}
              </Text>
            </View>
          )}
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={28} color={themeColor} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_doctors')}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDoctor}
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
            <Ionicons name="person-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? t('no_doctors_found') : t('no_doctors_available')}
            </Text>
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
  listContent: {
    padding: 16,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
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
  doctorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  doctorTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
