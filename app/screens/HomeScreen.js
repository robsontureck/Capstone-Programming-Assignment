import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [fitnessData, setFitnessData] = useState([]);
  const [workout, setWorkout] = useState("");
  const [meal, setMeal] = useState("");
  const [date, setDate] = useState("");

  const fetchFitnessData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/fitness", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFitnessData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addFitnessEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = { workout, meal, date };
      await axios.post("http://localhost:3000/api/fitness", newEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateFitnessEntry = async (id, workout, meal, date) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/fitness/${id}`,
        { workout, meal, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFitnessEntry = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/fitness/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFitnessData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Add Fitness Entry</Text>
      <TextInput
        placeholder="Workout"
        value={workout}
        onChangeText={setWorkout}
        style={styles.input}
      />
      <TextInput
        placeholder="Meal"
        value={meal}
        onChangeText={setMeal}
        style={styles.input}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Add Entry" onPress={addFitnessEntry} />
      <FlatList
        data={fitnessData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.workout}</Text>
            <Text>{item.meal}</Text>
            <Text>{item.date}</Text>
            <Button
              title="Edit"
              onPress={() =>
                updateFitnessEntry(item.id, item.workout, item.meal, item.date)
              }
            />
            <Button
              title="Delete"
              onPress={() => deleteFitnessEntry(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  entry: { marginBottom: 10, padding: 10, borderWidth: 1 },
});
