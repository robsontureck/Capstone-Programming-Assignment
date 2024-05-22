import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActivitiesView = ({
  fitnessData,
  setFitnessData,
  workout,
  setWorkout,
  date,
  setDate,
  fetchFitnessData,
}) => {
  const addFitnessEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = { workout, date };
      await axios.post(
        "http://YOUR_NEW_IP_ADDRESS:3000/api/fitness",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateFitnessEntry = async (id, workout, date) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `http://YOUR_NEW_IP_ADDRESS:3000/api/fitness/${id}`,
        { workout, date },
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
      await axios.delete(`http://YOUR_NEW_IP_ADDRESS:3000/api/fitness/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Activity</Text>
      <TextInput
        placeholder="Workout"
        value={workout}
        onChangeText={setWorkout}
        style={styles.input}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Add Activity" onPress={addFitnessEntry} />
      <FlatList
        data={fitnessData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.workout}</Text>
            <Text>{item.date}</Text>
            <Button
              title="Edit"
              onPress={() =>
                updateFitnessEntry(item.id, item.workout, item.date)
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
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  entry: { marginBottom: 10, padding: 10, borderWidth: 1 },
});

export default ActivitiesView;
