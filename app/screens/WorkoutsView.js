import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const WorkoutsView = ({ fetchWorkoutsData, workoutsData, setWorkoutsData }) => {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(
        `http://192.168.1.103:3000/api/workouts/workouts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Filter out the deleted workout
      setWorkoutsData(workoutsData.filter((workout) => workout.id !== id));
    } catch (error) {
      console.error("Failed to delete workout:", error);
    }
  };

  const handleEdit = async (id, newType, newDuration) => {
    const token = await AsyncStorage.getItem("token");
    const updatedEntry = {
      type: newType,
      duration: parseInt(newDuration),
      date: selectedDate.toISOString().split("T")[0],
    };
    try {
      const response = await axios.put(
        `http://192.168.1.103:3000/api/workouts/workouts/${id}`,
        updatedEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedWorkouts = workoutsData.map((workout) => {
        if (workout.id === id) {
          return { ...workout, ...response.data };
        }
        return workout;
      });
      setWorkoutsData(updatedWorkouts);
    } catch (error) {
      console.error("Failed to edit workout:", error);
    }
  };

  const addWorkoutEntry = async () => {
    const token = await AsyncStorage.getItem("token");
    const newEntry = {
      type: workoutType,
      duration: parseInt(duration),
      date: selectedDate.toISOString().split("T")[0],
    };
    await axios.post(
      "http://192.168.1.103:3000/api/workouts/workouts",
      newEntry,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchWorkoutsData();
    setWorkoutType("");
    setDuration("");
  };

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
              onPress={() => handleEdit(item.id, item.type, item.duration)}
            />
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
      <Picker
        selectedValue={workoutType}
        onValueChange={(itemValue, itemIndex) => setWorkoutType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a workout type" value="" />
        <Picker.Item label="Running" value="Running" />
        <Picker.Item label="Cycling" value="Cycling" />
        <Picker.Item label="Swimming" value="Swimming" />
        <Picker.Item label="Yoga" value="Yoga" />
        <Picker.Item label="Weight Training" value="Weight Training" />
      </Picker>
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
  picker: {
    height: 50,
    width: 350,
    marginBottom: 20,
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  entry: { marginBottom: 10, padding: 10, borderWidth: 1 },
});

export default WorkoutsView;
