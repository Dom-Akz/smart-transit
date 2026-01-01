import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, Dimensions, Alert, TouchableOpacity, FlatList, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TransportCard from '../components/TransportCard';
import { getDirections, getTransitOptions } from '../services/directions';
import SoundService from '../services/SoundService';
import * as Location from 'expo-location';

/**
 * MapScreen: Displays the route on a map and allows mode switching.
 */
const MapScreen = ({ route }) => {
  const { origin, destination } = route.params; 
  
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [mode, setMode] = useState('driving'); 
  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState(origin);
  
  // For Transit Mode
  const [transitOptions, setTransitOptions] = useState([]);
  const [selectedTransitStation, setSelectedTransitStation] = useState(null);
  
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    fetchRoute();
    return () => stopNavigation();
  }, [mode]);

  const fetchRoute = async () => {
    setLoading(true);
    setTransitOptions([]); 
    setSelectedTransitStation(null); // Reset selection on mode change
    
    const result = await getDirections(origin, destination, mode);
    
    if (result) {
      setCoords(result.coordinates);
      setDistance(result.distance);
      setDuration(result.duration);
      
      if (mode === 'transit') {
        // Pass origin to generate nearby station coords
        const options = getTransitOptions(result.rawDuration, result.rawDistance, origin);
        setTransitOptions(options);
      }

      if (mapRef.current && result.coordinates.length > 0 && !isNavigating) {
        setTimeout(() => {
           mapRef.current.fitToCoordinates(result.coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 400, left: 50 },
            animated: true,
          });
        }, 500);
      }
    } else {
        Alert.alert("Route not found", "Could not calculate a route for this mode.");
    }
    setLoading(false);
  };

  const startNavigation = async () => {
    SoundService.playSound('heavy');
    setIsNavigating(true);
    
    // Zoom in close to start
    mapRef.current.animateCamera({
      center: userLocation,
      zoom: 19,
      pitch: 60,
      heading: 0,
    });

    // Start watching position
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        
        // Keep camera centered on user
        mapRef.current.animateCamera({
          center: { latitude, longitude },
          zoom: 19,
        });
      }
    );
  };

  const stopNavigation = () => {
    SoundService.playSound('light');
    setIsNavigating(false);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    // Zoom back out to show whole route
    if (coords.length > 0) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 50, bottom: 400, left: 50 },
        animated: true,
      });
    }
  };

  const handleTransitSelect = (item) => {
    SoundService.playSound('success');
    setSelectedTransitStation(item);
    
    if (item.pickupLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: item.pickupLocation,
        zoom: 17,
        pitch: 0,
      });
    }
  };

  const renderTransitOptions = () => (
    <View style={styles.transitContainer}>
      <Text style={styles.transitTitle}>Select a Route</Text>
      <FlatList
        data={transitOptions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
            const isSelected = selectedTransitStation?.id === item.id;
            return (
              <TouchableOpacity 
                style={[styles.transitItem, isSelected && styles.transitItemSelected]} 
                onPress={() => handleTransitSelect(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.transitIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.type === 'BUS' ? 'bus' : 'train'} size={20} color="#fff" />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.transitLine}>{item.line}</Text>
                  <Text style={styles.transitTime}>{item.departure} - {item.arrival}</Text>
                  {isSelected && <Text style={styles.stationText}>📍 {item.stationName}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                   <Text style={styles.transitDuration}>{item.duration}</Text>
                   <Text style={styles.transitPrice}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            );
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        followsUserLocation={isNavigating}
        customMapStyle={[
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "off" }]
          }
        ]}
      >
        {!isNavigating && <Marker coordinate={origin} title="Start" pinColor="#4285F4" />}
        <Marker coordinate={destination} title="Destination" pinColor="#DB4437" />

        {/* Transit Station Marker */}
        {mode === 'transit' && selectedTransitStation && selectedTransitStation.pickupLocation && (
          <Marker 
            coordinate={selectedTransitStation.pickupLocation} 
            title={`Station: ${selectedTransitStation.stationName}`}
            description={`Take line ${selectedTransitStation.line} here`}
            pinColor={selectedTransitStation.color}
          >
             <View style={[styles.customMarker, { backgroundColor: selectedTransitStation.color }]}>
                <Ionicons name="bus" size={15} color="white" />
             </View>
          </Marker>
        )}

        {coords.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeWidth={5}
            strokeColor={mode === 'walking' ? '#0F9D58' : '#4285F4'}
            lineDashPattern={mode === 'walking' ? [10, 5] : null}
          />
        )}
      </MapView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}

      {/* Navigation Header (When Active) */}
      {isNavigating && (
        <View style={styles.navHeader}>
          <View style={styles.navHeaderContent}>
            <View>
              <Text style={styles.navTitle}>On the way...</Text>
              <Text style={styles.navSubtitle}>{distance} • {duration}</Text>
            </View>
            <TouchableOpacity style={styles.stopButton} onPress={stopNavigation}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Panel (Hidden during navigation) */}
      {!isNavigating && (
        <View style={[styles.bottomPanel, mode === 'transit' && { height: 450 }]}>
          
          <View style={styles.panelHandle} />

          {/* MOVE Button */}
          {mode !== 'transit' && (
            <TouchableOpacity onPress={startNavigation} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#4285F4', '#34A853']}
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.moveButton}
                >
                  <Ionicons name="navigate" size={24} color="#fff" />
                  <Text style={styles.moveButtonText}>START NAVIGATION</Text>
                </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Mode Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeSelector}>
            <TransportCard 
              mode="driving" 
              duration={mode === 'driving' ? duration : ''} 
              distance={mode === 'driving' ? distance : ''} 
              isSelected={mode === 'driving'} 
              onSelect={() => setMode('driving')} 
            />
            <TransportCard 
              mode="walking" 
              duration={mode === 'walking' ? duration : ''} 
              distance={mode === 'walking' ? distance : ''} 
              isSelected={mode === 'walking'} 
              onSelect={() => setMode('walking')} 
            />
            <TransportCard 
              mode="transit" 
              duration={mode === 'transit' ? duration : ''} 
              distance={mode === 'transit' ? distance : ''} 
              isSelected={mode === 'transit'} 
              onSelect={() => setMode('transit')} 
            />
          </ScrollView>

          {/* Transit Options List */}
          {mode === 'transit' && !loading && renderTransitOptions()}
        </View>
      )}
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
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    left: '50%',
    marginLeft: -25,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 10,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    height: 300, 
  },
  panelHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  moveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 30,
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  moveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  navHeader: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  navHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  navSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    fontWeight: '500',
  },
  stopButton: {
    padding: 10,
    backgroundColor: '#DB4437',
    borderRadius: 50,
    elevation: 2,
  },
  modeSelector: {
    flexGrow: 0,
    marginBottom: 10,
  },
  transitContainer: {
    flex: 1,
    marginTop: 10,
  },
  transitTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  transitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  transitItemSelected: {
    borderColor: '#4285F4',
    backgroundColor: '#F0F6FF',
    transform: [{scale: 1.02}],
  },
  transitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transitLine: {
    fontWeight: '800',
    fontSize: 16,
    color: '#333',
  },
  transitTime: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  stationText: {
    fontSize: 12,
    color: '#4285F4',
    marginTop: 4,
    fontWeight: '600',
  },
  transitDuration: {
    fontWeight: '700',
    color: '#333',
    fontSize: 16,
  },
  transitPrice: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  customMarker: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 3,
  }
});

export default MapScreen;
