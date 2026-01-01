import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const [userStats, setUserStats] = useState({
    totalTrips: 47,
    carbonSaved: 12.5, // kg
    distanceTraveled: 385, // km
    timeSaved: 28, // hours
    favoriteMode: 'transit',
  });

  const [achievements, setAchievements] = useState([
    { id: '1', name: 'First Trip', icon: '🚀', unlocked: true, date: 'Jan 15' },
    { id: '2', name: 'Eco Hero', icon: '🌱', unlocked: true, description: 'Saved 5kg CO2' },
    { id: '3', name: 'Week Warrior', icon: '💪', unlocked: false, description: '5 trips in a week' },
    { id: '4', name: 'Night Rider', icon: '🌙', unlocked: true, description: 'Trip after 10 PM' },
  ]);

  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    avoidTolls: true,
    ecoMode: true,
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4285F4', '#34A853']}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Alex Johnson</Text>
            <Text style={styles.userEmail}>alex@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="navigate" size={28} color="#4285F4" />
            <Text style={styles.statNumber}>{userStats.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="leaf" size={28} color="#0F9D58" />
            <Text style={styles.statNumber}>{userStats.carbonSaved}kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="speedometer" size={28} color="#DB4437" />
            <Text style={styles.statNumber}>{userStats.distanceTraveled}km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={28} color="#F4B400" />
            <Text style={styles.statNumber}>{userStats.timeSaved}h</Text>
            <Text style={styles.statLabel}>Time Saved</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.map(achievement => (
            <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              {achievement.description && (
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
              )}
              {achievement.date && (
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferencesList}>
          {Object.entries(preferences).map(([key, value]) => (
            <TouchableOpacity 
              key={key} 
              style={styles.preferenceItem}
              onPress={() => togglePreference(key)}
            >
              <View style={styles.preferenceInfo}>
                <Ionicons 
                  name={
                    key === 'notifications' ? 'notifications' :
                    key === 'darkMode' ? 'moon' :
                    key === 'avoidTolls' ? 'card' :
                    'leaf'
                  } 
                  size={24} 
                  color="#4285F4" 
                />
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceTitle}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                  <Text style={styles.preferenceDescription}>
                    {key === 'ecoMode' ? 'Suggest eco-friendly routes' :
                     key === 'avoidTolls' ? 'Avoid toll roads' :
                     key === 'darkMode' ? 'Use dark theme' :
                     'Receive trip notifications'}
                  </Text>
                </View>
              </View>
              <View style={[styles.toggle, value && styles.toggleActive]}>
                <View style={[styles.toggleCircle, value && styles.toggleCircleActive]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle" size={24} color="#666" />
          <Text style={styles.actionButtonText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={24} color="#666" />
          <Text style={styles.actionButtonText}>Invite Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
          <Ionicons name="log-out" size={24} color="#DB4437" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userDetails: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  editButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginLeft: 20,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  achievementCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },
  preferencesList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    marginLeft: 15,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4285F4',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  actionsSection: {
    padding: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 10,
  },
  actionButtonText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: '#DB4437',
  },
});

export default ProfileScreen;