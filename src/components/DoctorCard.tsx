import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';
import { Doctor } from '@/api/types';

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  const { language } = useLanguageStore();

  const name = language === 'ar' ? doctor.name_ar : doctor.name;
  const title = language === 'ar' ? doctor.title_ar : doctor.title;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {doctor.image && (
        <Image
          source={{ uri: doctor.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: '#666',
  },
});
