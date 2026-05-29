import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function HistoryCard({ item }) {

  return (

    <View style={styles.card}>

      <Text style={styles.text}>
        <Text style={styles.tempTitle}>Temperatura:</Text>{' '}{item.temp}°C
      </Text>

      <Text style={styles.text}>
        <Text style={styles.humTitle}>Umidade:</Text>{' '}{item.hum}%
      </Text>

      <Text style={styles.text}>
        <Text style={styles.lightTitle}>Luz:</Text>{' '}{item.light ? 'Ligada' : 'Desligada'}
      </Text>

      <Text style={styles.date}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

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
    color: '#E74C3C',
    fontWeight: 'bold',
  },

  humTitle: {
    color: '#3498DB',
    fontWeight: 'bold',
  },

  lightTitle: {
    color: '#F1C40F',
    fontWeight: 'bold',
  },

  date: {
    color: '#AAA',
    marginTop: 10,
    fontSize: 13,
  },
});