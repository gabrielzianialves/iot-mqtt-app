import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryCard from '../components/HistoryCard';


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

  
  return (

    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <HistoryCard item={item} />
        )}
        keyExtractor={(item) =>
          item.id.toString()
        }
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
});