import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';

/**
 * HomeScreen: Entry point of the app.
 * Handles GPS permissions and user destination input.
 */
const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Ask for permission and get current location on app start
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied. The app cannot work without location.');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setLoading(false);
    })();
  }, []);

  // 2. Handle search submission
  const handleSearch = (destination) => {
    if (!location) {
      Alert.alert('Waiting for Location', 'Please wait while we fetch your GPS location.');
      return;
    }
    // Navigate to MapScreen with origin and destination
    navigation.navigate('Map', {
      origin: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      destination: destination,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 37.78825,
          longitude: location ? location.longitude : -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : null}
        showsUserLocation={true}
        showsCompass={false}
        showsMyLocationButton={false}
      />

      {/* Floating Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Bottom Welcome Card */}
      <View style={styles.bottomCard}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)', '#ffffff']}
          style={styles.gradientOverlay}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.greeting}>Hello, Traveler! \ud83d\udc4b</Text>
          <Text style={styles.subtitle}>Where would you like to go today?</Text>

          {loading && (
            <View style={styles.locationStatus}>
              <ActivityIndicator size="small" color="#4285F4" />
              <Text style={styles.locationText}> Locating you...</Text>
            </View>
          )}
          {!loading && location && (
            <View style={styles.locationStatus}>
              <Text style={styles.locationText}>\ud83d\udccd Current Location Active</Text>
            </View>
          )}
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.actionText}>My Places</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8, // Slight fade to make UI pop
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    padding: 30,
    paddingBottom: 50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#F0F6FF',
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: '#4285F4',
    fontWeight: '600',
    marginLeft: 5,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
