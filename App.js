import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';

const Stack = createStackNavigator();

/**
 * Main App Component
 * Sets up the navigation structure.
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} // Custom header in HomeScreen
        />
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ title: 'Route Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
