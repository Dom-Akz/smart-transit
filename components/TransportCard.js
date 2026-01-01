import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SoundService from '../services/SoundService';

/**
 * TransportCard component to display mode options
 * @param {string} mode - 'driving', 'walking', 'transit'
 * @param {string} duration - Estimated time
 * @param {string} distance - Estimated distance
 * @param {boolean} isSelected - If this card is currently selected
 * @param {Function} onSelect - Callback when pressed
 */
const TransportCard = ({ mode, duration, distance, isSelected, onSelect }) => {
  
  // Helper to get icon name based on mode
  const getIconName = () => {
    switch (mode) {
      case 'driving': return 'car';
      case 'walking': return 'walk';
      case 'transit': return 'bus';
      default: return 'car';
    }
  };

  // Helper to get display label
  const getLabel = () => {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  const handlePress = () => {
    SoundService.playSound(isSelected ? 'light' : 'success');
    onSelect();
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCardBorder]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {isSelected ? (
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.gradient}
        >
          <View style={styles.content}>
             <View style={styles.iconContainer}>
              <Ionicons name={getIconName()} size={28} color="#fff" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={[styles.modeText, styles.selectedText]}>{getLabel()}</Text>
              <Text style={[styles.detailsText, styles.selectedText]}>
                {duration || '--'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={getIconName()} size={28} color="#4285F4" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.modeText}>{getLabel()}</Text>
            <Text style={styles.detailsText}>
              {duration || '--'}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 8,
    width: 110,
    height: 110,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  selectedCardBorder: {
    transform: [{ scale: 1.05 }],
    elevation: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 50,
  },
  infoContainer: {
    alignItems: 'center',
  },
  modeText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});

export default TransportCard;
