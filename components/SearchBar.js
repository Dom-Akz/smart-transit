import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator, Keyboard, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchPlaces } from '../services/directions';
import SoundService from '../services/SoundService';

/**
 * SearchBar with Autocomplete
 * @param {Function} onSearch - Callback when a place is selected (returns {latitude, longitude})
 */
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const results = await searchPlaces(query);
        setSuggestions(results);
        setLoading(false);
        setShowList(true);
      } else {
        setSuggestions([]);
        setShowList(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    SoundService.playSound('success');
    setQuery(item.label);
    setShowList(false);
    Keyboard.dismiss();
    onSearch(item.value); // Pass coordinates directly
  };

  const handleClear = () => {
    SoundService.playSound('light');
    setQuery('');
    setSuggestions([]);
    setShowList(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isFocused && styles.focusedInput]}>
        <Ionicons name="search" size={24} color={isFocused ? "#4285F4" : "#666"} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Where to? (e.g. Eiffel Tower)"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#999"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Ionicons name="close-circle" size={22} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions List */}
      {showList && (
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#4285F4" style={{ padding: 20 }} />
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="location" size={18} color="#fff" />
                  </View>
                  <Text style={styles.itemText} numberOfLines={1}>{item.label}</Text>
                  <Ionicons name="arrow-forward-circle-outline" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100, // Ensure list floats above other content
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focusedInput: {
    borderColor: '#4285F4',
    transform: [{ scale: 1.02 }],
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 20,
    elevation: 10,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
});

export default SearchBar;
