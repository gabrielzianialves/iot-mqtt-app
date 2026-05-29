import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#FFF',
        }}
      >

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Smart Home IoT' }}
        />

        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Histórico MQTT' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}