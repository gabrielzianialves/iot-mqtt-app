import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

export default function DashboardScreen() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('@iot_history');
      if (saved !== null) {
        setHistory(JSON.parse(saved));
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const lastData = history.slice(0, 10).reverse();
  const labels = lastData.map((item) =>
    new Date(item.timestamp).toLocaleTimeString()
  );
  const temperatures = lastData.map((item) => item.temp);
  const humidities = lastData.map((item) => item.hum);

  const chartConfig = {
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    propsForDots: {r: '5'}
  };

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nenhum dado encontrado.</Text>
      </View>
    );
  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>Temperatura</Text>
      <LineChart
        data={{labels, datasets: [{data: temperatures}]}}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix="°C"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      <Text style={styles.title}>Umidade</Text>
      <LineChart
        data={{labels, datasets: [{data: humidities}]}}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix="%"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },

  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
  },

  chart: {
    borderRadius: 16,
  },

  text: {
    color: '#FFF',
    fontSize: 18,
  }

});