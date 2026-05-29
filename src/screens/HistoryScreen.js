import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try{
      const saved = await AsyncStorage.getItem('@iot_history');

      if (saved !== null) {
        setHistory(JSON.parse(saved));
      }

    } 
    catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <Text style={styles.text}>
        <Text style={styles.tempTitle}>Temperatura:</Text> {item.temp}°C
      </Text>

      <Text style={styles.text}>
        <Text style={styles.humTitle}>Umidade:</Text> {item.hum}%
      </Text>

      <Text style={styles.text}>
        <Text style={styles.lightTitle}>Luz:</Text> {item.light ? 'Ligada' : 'Desligada'}
      </Text>

      <Text style={styles.date}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>

    </View>
  );

  return (

    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },

  card: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  text: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },

  tempTitle: {
    color: '#e64a39',
    fontWeight: 500
  },

  humTitle: {
    color: '#3498db',
    fontWeight: 500
  },

  lightTitle: {
    color: '#f1c40f',
    fontWeight: 500
  },

  date: {
    color: '#AAA',
    marginTop: 10,
    fontSize: 13,
  },
});