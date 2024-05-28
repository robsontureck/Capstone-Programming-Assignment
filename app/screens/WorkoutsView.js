import React, { useState } from "react";
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
import { useDarkMode } from "../contexts/DarkModeContext"; // Ensure this is correctly imported

const WorkoutsView = ({
  fetchWorkoutsData,
  workoutsData,
  setWorkoutsData,
  navigation,
}) => {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isDarkMode } = useDarkMode(); // Use the dark mode context

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

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => onDateChange(-1)}>
          <Text style={[styles.arrow, textStyle]}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={[styles.dateText, textStyle]}>
          {selectedDate.toDateString()}
        </Text>
        <TouchableOpacity onPress={() => onDateChange(1)}>
          <Text style={[styles.arrow, textStyle]}>{">"}</Text>
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
              <Text style={[styles.workoutText, textStyle]}>{item.type}</Text>
              <Text style={[styles.caloriesText, textStyle]}>
                {item.duration} mins
              </Text>
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
        style={[styles.picker, textStyle]}
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
        style={[styles.input, textStyle]}
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
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 7 },
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 7,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: 10,
  },
  workoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  caloriesText: {
    fontSize: 16,
  },
  darkContainer: { backgroundColor: "#333" },
  lightContainer: { backgroundColor: "#fff" },
  darkText: { color: "#fff" },
  lightText: { color: "#000" },
});

export default WorkoutsView;
