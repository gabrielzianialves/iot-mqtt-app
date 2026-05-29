import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MQTTService from '../services/mqttService';
import StatusModal from '../components/StatusModal';
import LightControl from '../components/LightControl';
import Gauges from '../components/Gauges';

const mqtt = new MQTTService();

export default function HomeScreen({ navigation }) {

  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USER,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    loadSavedData();
    startConnection();
  }, []);

  const saveData = async (temperature, humidity, light) => {
    try {
      const newData = {
        id: Date.now(),
        temp: temperature,
        hum: humidity,
        light: light,
        timestamp: new Date().toISOString()
      };

      const existingData = await AsyncStorage.getItem('@iot_history');

      let history = existingData ? JSON.parse(existingData) : [];

      history.unshift(newData);
      await AsyncStorage.setItem('@iot_history', JSON.stringify(history));

    } 
    catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  };

  const loadSavedData = async () => {
    try{
      const saved = await AsyncStorage.getItem('@iot_history');

      if (saved !== null) {
        const history = JSON.parse(saved);

        if (history.length > 0) {
          const latest = history[0];
          setTemp(latest.temp);
          setHum(latest.hum);
          setIsLightOn(latest.light);
        }
      }

    }
    catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  const startConnection = () => {

    setShowError(false);

    mqtt.connect(

      mqttConfig,

      (topic, message) => {

        let newTemp = temp;
        let newHum = hum;
        let newLight = isLightOn;

        if (topic === 'casa/temp') {
          newTemp = parseFloat(message);
          setTemp(newTemp);
        }

        if (topic === 'casa/umid') {
          newHum = parseFloat(message);
          setHum(newHum);
        }

        if (topic === 'casa/luz') {
          newLight = message === '1';
          setIsLightOn(newLight);
        }
        saveData(newTemp, newHum, newLight);
      },

      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },

      () => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? '0' : '1';
    mqtt.publish('casa/luz', newState);
  };

  return (

    <View style={styles.container}>

      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl
        isLightOn={isLightOn}
        onToggle={toggleLight}
      />

      <Gauges
        temp={temp}
        hum={hum}
      />

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>Ver Histórico</Text>
      </TouchableOpacity>

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center'
  },

  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20
  },

  historyButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    width: '100%',
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});