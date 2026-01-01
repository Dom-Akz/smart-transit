// components/QRCodeShare.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert,
  Share,
  Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Simple QR Code generator without external library
const SimpleQRCode = ({ data }) => {
  // For now, we'll show a placeholder. In a real app, use react-native-qrcode-svg
  return (
    <View style={styles.qrPlaceholder}>
      <Ionicons name="qr-code" size={80} color="#4285F4" />
      <Text style={styles.qrText}>Route QR Code</Text>
      <Text style={styles.qrData}>{data.substring(0, 30)}...</Text>
    </View>
  );
};

const QRCodeShare = ({ routeData, visible, onClose }) => {
  // Generate simple route data string
  const generateRouteString = () => {
    if (!routeData) return '';
    return `SMARTTRANSIT:${routeData.origin?.latitude || 0},${
      routeData.origin?.longitude || 0
    }>${routeData.destination?.latitude || 0},${
      routeData.destination?.longitude || 0
    }>${routeData.mode || 'driving'}`;
  };

  const routeString = generateRouteString();

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(routeString);
    Alert.alert('Copied!', 'Route data copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Smart Transit Route: ${routeString}`,
        title: 'Share Route',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share route');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Route</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <SimpleQRCode data={routeString} />

          <Text style={styles.routeInfo}>
            Scan or share this route
          </Text>

          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleCopyLink}>
              <Ionicons name="copy" size={20} color="#4285F4" />
              <Text style={styles.shareButtonText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color="#0F9D58" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>
            Other users can scan this code to open the same route
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  qrPlaceholder: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  qrText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  qrData: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  routeInfo: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  shareButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QRCodeShare;