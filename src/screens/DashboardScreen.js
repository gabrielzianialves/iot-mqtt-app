import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';

export default function DashboardScreen() {

  const [tempHistory, setTempHistory] = useState([]);
  const [humHistory, setHumHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const temp = await AsyncStorage.getItem('@temp_history');
    const hum = await AsyncStorage.getItem('@hum_history');
    const light = await AsyncStorage.getItem('@light_history');
    if (temp) setTempHistory(JSON.parse(temp));
    if (hum) setHumHistory(JSON.parse(hum));
    if (light) setLightHistory(JSON.parse(light));
  };

  const chartWidth = Dimensions.get('window').width - 40;

  const chartConfig = {
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#FFF',
    },
    propsForBackgroundLines: {
      stroke: 'rgba(255,255,255,0.08)',
      strokeDasharray: '',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  const lastTemp = tempHistory.slice(0, 10).reverse();
  const lastHum = humHistory.slice(0, 10).reverse();

  const formatLabel = (timestamp) => {
    const d = new Date(timestamp);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const tempLabels = lastTemp.map(item => formatLabel(item.timestamp));
  const humLabels = lastHum.map(item => formatLabel(item.timestamp));

  const temperatures = lastTemp.map(item => item.value);
  const humidities = lastHum.map(item => item.value);

  const lightOn = lightHistory.filter(item => item.value).length;
  const lightOff = lightHistory.length - lightOn;

  const avgTemp = temperatures.length
    ? temperatures.reduce((s, v) => s + v, 0) / temperatures.length
    : 0;
  const avgHum = humidities.length
    ? humidities.reduce((s, v) => s + v, 0) / humidities.length
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Text style={styles.tempTitle}>Temperatura</Text>
      <LineChart
        data={{ labels: tempLabels, datasets: [{ data: temperatures }] }}
        width={chartWidth}
        height={220}
        yAxisSuffix="°C"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withShadow={false}
      />

      <Text style={styles.humTitle}>Umidade</Text>
      <LineChart
        data={{ labels: humLabels, datasets: [{ data: humidities }] }}
        width={chartWidth}
        height={220}
        yAxisSuffix="%"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withShadow={false}
      />

      <Text style={styles.title}>Temperatura média × Umidade média</Text>
      <BarChart
        data={{
          labels: ['Temp', 'Umid'],
          datasets: [{ data: [parseFloat(avgTemp.toFixed(1)), parseFloat(avgHum.toFixed(1))] }],
        }}
        width={chartWidth}
        height={220}
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars={true}
        fromZero={true}
      />

      <Text style={styles.lightTitle}>Estado da Luz</Text>
      <PieChart
        data={[
          {
            name: 'Ligada',
            population: lightOn || 1,
            color: '#f1c40f',
            legendFontColor: '#FFF',
            legendFontSize: 15,
          },
          {
            name: 'Desligada',
            population: lightOff || 1,
            color: '#555',
            legendFontColor: '#FFF',
            legendFontSize: 15,
          },
        ]}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
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
  tempTitle: {
    color: '#E74C3C',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
  },
  humTitle: {
    color: '#3498DB',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
  },
  lightTitle: {
    color: '#F1C40F',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
  },
  chart: {
    borderRadius: 16,
    alignSelf: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 18,
  },
});