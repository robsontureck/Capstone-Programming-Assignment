import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkoutsView = ({ fetchWorkoutsData, workoutsData, setWorkoutsData }) => {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addWorkoutEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = {
        type: workoutType,
        duration: parseInt(duration),
        date: selectedDate.toISOString().split("T")[0],
      };
      await axios.post(
        "http://YOUR_NEW_IP_ADDRESS:3000/api/workouts",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchWorkoutsData();
      setWorkoutType(""); // Clear input after adding
      setDuration("");
    } catch (error) {
      console.error(error);
    }
  };

  const updateWorkoutEntry = async (id, type, duration) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `http://YOUR_NEW_IP_ADDRESS:3000/api/workouts/${id}`,
        { type, duration, date: selectedDate.toISOString().split("T")[0] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWorkoutsData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteWorkoutEntry = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://YOUR_NEW_IP_ADDRESS:3000/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkoutsData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkoutsData();
  }, [selectedDate]);

  const onDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => onDateChange(-1)}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        <TouchableOpacity onPress={() => onDateChange(1)}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={workoutsData.filter(
          (item) => item.date === selectedDate.toISOString().split("T")[0]
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.type}</Text>
            <Text>{item.duration} mins</Text>
            <Button
              title="Edit"
              onPress={() =>
                updateWorkoutEntry(item.id, item.type, item.duration)
              }
            />
            <Button
              title="Delete"
              onPress={() => deleteWorkoutEntry(item.id)}
            />
          </View>
        )}
      />
      <TextInput
        placeholder="Workout Type"
        value={workoutType}
        onChangeText={setWorkoutType}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (mins)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Workout" onPress={addWorkoutEntry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: { fontSize: 24, marginHorizontal: 20 },
  dateText: { fontSize: 18 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  entry: { marginBottom: 10, padding: 10, borderWidth: 1 },
});

export default WorkoutsView;
