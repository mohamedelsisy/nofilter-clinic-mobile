import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/languageStore';
import { useConfigStore } from '@/store/configStore';
import { Doctor } from '@/api/types';
import { useFontFamily } from '@/utils/fonts';

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  const { language } = useLanguageStore();
  const { getThemeColor } = useConfigStore();
  const themeColor = getThemeColor();
  const fonts = useFontFamily();

  const name = language === 'ar' ? doctor.name_ar : doctor.name;
  const title = language === 'ar' ? doctor.title_ar : doctor.title;
  const bio = language === 'ar' ? doctor.bio_ar : doctor.bio;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.cardBackground}
      >
        {/* Doctor Image with Badge */}
        <View style={styles.imageContainer}>
          {doctor.image ? (
            <Image
              source={{ uri: doctor.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: themeColor }]}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
          )}
          {/* Verified Badge */}
          <View style={[styles.badge, { backgroundColor: themeColor }]}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </View>
        </View>

        {/* Doctor Info */}
        <View style={styles.content}>
          <Text style={[styles.name, { fontFamily: fonts.bold }]} numberOfLines={2}>
            {name}
          </Text>
          
          <View style={styles.titleContainer}>
            <Ionicons name="medical" size={14} color={themeColor} />
            <Text style={[styles.title, { fontFamily: fonts.regular, color: themeColor }]} numberOfLines={2}>
              {title}
            </Text>
          </View>

          {bio && (
            <Text style={[styles.bio, { fontFamily: fonts.regular }]} numberOfLines={2}>
              {bio}
            </Text>
          )}

          {/* View Profile Button */}
          <View style={[styles.viewButton, { borderColor: themeColor }]}>
            <Text style={[styles.viewButtonText, { color: themeColor }]}>
              {language === 'ar' ? 'عرض الملف' : 'View Profile'}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={themeColor} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 280,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBackground: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  badge: {
    position: 'absolute',
    bottom: 16,
    right: 80,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(13, 82, 90, 0.08)',
    borderRadius: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textAlign: 'center',
    flex: 1,
  },
  bio: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
});
