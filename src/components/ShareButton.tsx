/**
 * ShareButton Component
 * 
 * Reusable share button for detail screens
 */

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConfigStore } from '@/store/configStore';
import { toast } from '@/utils/toast';

interface ShareButtonProps {
  onShare: () => Promise<{ success: boolean }>;
  color?: string;
  size?: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ onShare, color, size = 24 }) => {
  const primaryColor = useConfigStore((state) => state.primaryColor);
  const [isSharing, setIsSharing] = useState(false);
  
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await onShare();
      if (result.success) {
        toast.success('Shared successfully!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      disabled={isSharing}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {isSharing ? (
        <ActivityIndicator size="small" color={color || primaryColor} />
      ) : (
        <Ionicons 
          name={I18nManager.isRTL ? 'share-outline' : 'share-social-outline'} 
          size={size} 
          color={color || primaryColor} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShareButton;
