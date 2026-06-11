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
  const [sensorData, setSensorData] = useState({temp: 0, hum: 0, light: false});

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

  const saveSensorHistory = async (key, value) => {
    try {
      const newData = {
        id: Date.now(),
        value,
        timestamp: new Date().toISOString()
      };

      const existing = await AsyncStorage.getItem(key);
      let history = existing ? JSON.parse(existing) : [];
      history.unshift(newData);

      await AsyncStorage.setItem(key, JSON.stringify(history));

    }
    catch (error) {
      console.log(error);
    }
  };

  const loadSavedData = async () => {
    try{
      const saved = await AsyncStorage.getItem('@iot_history');

      if (saved !== null) {
        const history = JSON.parse(saved);

        if (history.length > 0) {
          const latest = history[0];
          setSensorData({
            temp: latest.temp,
            hum: latest.hum,
            light: latest.light
          });
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

        setSensorData((prevData) => {
      
          const updatedData = {
            ...prevData
          };
      
          if (topic === 'casa/temp') {
            const value = parseFloat(message);

            if (value !== prevData.temp) {
              updatedData.temp = value;
              saveSensorHistory('@temp_history', value);
            }
          }
      
          if (topic === 'casa/umid') {
            const value = parseFloat(message);

            if (value !== prevData.hum) {
              updatedData.hum = value;
              saveSensorHistory('@hum_history', value);
            }
          }
      
          if (topic === 'casa/luz') {
            const value = message === '1';

            if (value !== prevData.light) {
              updatedData.light = value;
              saveSensorHistory('@light_history', value);
            }
          }
      
          saveData(
            updatedData.temp,
            updatedData.hum,
            updatedData.light
          );
      
          return updatedData;
        });
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
    const newState = sensorData.light ? '0' : '1';
    mqtt.publish('casa/luz', newState);
  };

  return (

    <View style={styles.container}>

      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl
        isLightOn={sensorData.light}
        onToggle={toggleLight}
      />

      <Gauges
        temp={sensorData.temp}
        hum={sensorData.hum}
      />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>Ver Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Ver Dashboard</Text>
        </TouchableOpacity>
      </View>

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

  buttonsContainer: {
    width: '100%',
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dashboardButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    width: '48%',
  },

  historyButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    width: '48%',
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});