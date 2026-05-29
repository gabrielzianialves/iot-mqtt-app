import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mqtt = new MQTTService();

export default function App() {
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
          newLight = message === "1";
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
      (err) => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? "0" : "1";
    mqtt.publish('casa/luz', newState);
  };

  const saveData = async (temperature, humidity, light) => {
    try{
      const data = {
        temp: temperature,
        hum: humidity,
        light: light,
        timestamp: new Date().toISOString()
      };

      await AsyncStorage.setItem('@iot_last_data', JSON.stringify(data));
    } 
    catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  };

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('@iot_last_data');

      if (saved !== null) {
        const data = JSON.parse(saved);
        setTemp(data.temp);
        setHum(data.hum);
        setIsLightOn(data.light);
      }
    } 
    catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />

      <Gauges temp={temp} hum={hum} />

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212',
    padding: 20, alignItems: 'center'
  },
  header: { color: '#FFF', fontSize: 24,
    fontWeight: 'bold', marginTop: 40,
    marginBottom: 20
  },
});