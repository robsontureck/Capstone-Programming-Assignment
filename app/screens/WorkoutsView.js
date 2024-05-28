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
import sharedStyles from "../styles/styles";

const WorkoutsView = ({
  fetchWorkoutsData,
  workoutsData,
  setWorkoutsData,
  navigation,
}) => {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

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
            <View style={styles.textContainer}>
              <Text style={styles.workoutText}>{item.type}</Text>
              <Text style={styles.caloriesText}>{item.duration} mins</Text>
            </View>

            <TouchableOpacity
              style={sharedStyles.greenButton}
              onPress={() =>
                navigation.navigate("EditWorkout", {
                  workoutId: item.id,
                  currentType: item.type,
                  currentDuration: item.duration,
                  date: selectedDate.toISOString().split("T")[0],
                  fetchWorkoutsData,
                })
              }
            >
              <Text style={sharedStyles.buttonText}>{"EDIT WORKOUT"}</Text>
            </TouchableOpacity>
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

      <TouchableOpacity style={sharedStyles.button} onPress={addWorkoutEntry}>
        <Text style={sharedStyles.buttonText}>{"ADD WORKOUT"}</Text>
      </TouchableOpacity>
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
    height: 60,
    width: 350,
    marginBottom: 20,
    color: "black",
    fontSize: 18, // Adjusting font size
    fontWeight: "bold", // Making the font bold
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 7 },

  entry: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between items
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center", // Align items vertically
    borderRadius: 7,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1, // Take up all available space
    marginRight: 10, // Give some space before the button
  },
  workoutText: {
    fontSize: 16, // Example size
    fontWeight: "bold",
  },
  caloriesText: {
    fontSize: 16, // Example size
  },
});

export default WorkoutsView;
