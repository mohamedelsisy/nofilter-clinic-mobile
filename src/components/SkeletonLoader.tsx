/**
 * SkeletonLoader Component
 * 
 * Animated skeleton placeholders for loading states
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
  },
});

/**
 * Predefined skeleton components for common use cases
 */

export const SkeletonCard: React.FC = () => (
  <View style={skeletonStyles.card}>
    <SkeletonLoader width="100%" height={180} borderRadius={10} style={{ marginBottom: 10 }} />
    <SkeletonLoader width="70%" height={20} style={{ marginBottom: 8 }} />
    <SkeletonLoader width="50%" height={16} style={{ marginBottom: 8 }} />
    <SkeletonLoader width="90%" height={14} />
  </View>
);

export const SkeletonListItem: React.FC = () => (
  <View style={skeletonStyles.listItem}>
    <SkeletonLoader width={60} height={60} borderRadius={8} style={{ marginRight: 15 }} />
    <View style={{ flex: 1 }}>
      <SkeletonLoader width="80%" height={18} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="60%" height={14} />
    </View>
  </View>
);

export const SkeletonDoctorCard: React.FC = () => (
  <View style={skeletonStyles.doctorCard}>
    <SkeletonLoader width={80} height={80} borderRadius={40} style={{ marginBottom: 10 }} />
    <SkeletonLoader width="70%" height={18} style={{ marginBottom: 6 }} />
    <SkeletonLoader width="50%" height={14} />
  </View>
);

export const SkeletonSlider: React.FC = () => (
  <View style={skeletonStyles.slider}>
    <SkeletonLoader width="100%" height={200} borderRadius={10} />
  </View>
);

export const SkeletonServiceGrid: React.FC = () => (
  <View style={skeletonStyles.grid}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={skeletonStyles.gridItem}>
        <SkeletonLoader width="100%" height={120} borderRadius={10} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="80%" height={16} />
      </View>
    ))}
  </View>
);

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  slider: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  gridItem: {
    width: '48%',
    marginBottom: 15,
  },
});

export default SkeletonLoader;
