// screens/FavoritesScreen.js - SIMPLE VERSION
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([
    { id: '1', name: 'Home', address: '123 Main Street' },
    { id: '2', name: 'Work', address: '456 Office Avenue' },
    { id: '3', name: 'Gym', address: '789 Fitness Road' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorite Places</Text>
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.favoriteItem}
            onPress={() => navigation.navigate('Home', { presetDestination: item })}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={24} color="#4285F4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.favoriteName}>{item.name}</Text>
              <Text style={styles.favoriteAddress}>{item.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={24} color="#4285F4" />
        <Text style={styles.addButtonText}>Add New Place</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: { marginRight: 15 },
  textContainer: { flex: 1 },
  favoriteName: { fontSize: 16, fontWeight: '600', color: '#333' },
  favoriteAddress: { fontSize: 14, color: '#666', marginTop: 3 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  addButtonText: { marginLeft: 10, fontWeight: '600', color: '#333' },
});

export default FavoritesScreen;