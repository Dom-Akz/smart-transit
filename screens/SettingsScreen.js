// screens/SettingsScreen.js - SIMPLE VERSION
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    soundEffects: true,
    offlineMode: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingItems = [
    { key: 'notifications', icon: 'notifications', label: 'Push Notifications', description: 'Get route updates' },
    { key: 'soundEffects', icon: 'volume-high', label: 'Sound Effects', description: 'Play navigation sounds' },
    { key: 'offlineMode', icon: 'download', label: 'Offline Mode', description: 'Use cached maps' },
    { key: 'darkMode', icon: 'moon', label: 'Dark Mode', description: 'Use dark theme' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {settingItems.map((item) => (
        <View key={item.key} style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name={item.icon} size={24} color="#4285F4" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingDescription}>{item.description}</Text>
            </View>
          </View>
          <Switch
            value={settings[item.key]}
            onValueChange={() => toggleSetting(item.key)}
          />
        </View>
      ))}
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#4285F4" />
        <Text style={styles.infoText}>
          Offline mode will cache maps for your frequently visited areas.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginLeft: 15, flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  settingDescription: { fontSize: 14, color: '#666', marginTop: 3 },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F6FF',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: { marginLeft: 10, fontSize: 14, color: '#4285F4', flex: 1 },
});

export default SettingsScreen;