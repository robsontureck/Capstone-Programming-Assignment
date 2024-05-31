import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
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
  const [workoutType, setWorkoutType] = useState(""); // State to hold selected workout type
  const [duration, setDuration] = useState(""); // State to hold workout duration
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold selected date
  const { isDarkMode } = useDarkMode(); // Use the dark mode context

  // Function to add a new workout entry
  const addWorkoutEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const newEntry = {
        type: workoutType,
        duration: parseInt(duration),
        date: selectedDate.toISOString().split("T")[0], // Formatting date to string
      };

      const response = await axios.post(
        "http://192.168.1.104:3000/api/workouts/workouts",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        fetchWorkoutsData(); // Refresh workouts data
        setWorkoutType(""); // Reset workout type
        setDuration(""); // Reset duration
      } else {
        Alert.alert("Error", "Failed to add workout entry. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add workout entry:", error); // Log error to console
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while adding workout entry. Please try again."
      );
    }
  };

  // Function to handle date changes
  const onDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days); // Adjust date by the number of days
    setSelectedDate(newDate); // Update selected date state
  };

  // Setting styles based on dark mode state
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
  container: { flex: 1, padding: 20 }, // Container style with padding
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Date picker container style
  },
  arrow: { fontSize: 24, marginHorizontal: 20 }, // Arrow text style
  dateText: { fontSize: 18 }, // Date text style
  picker: {
    height: 60,
    width: 350,
    marginBottom: 20, // Picker style
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 7 }, // Input style
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 7, // Entry container style
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: 10, // Text container style
  },
  workoutText: {
    fontSize: 16,
    fontWeight: "bold", // Workout text style
  },
  caloriesText: {
    fontSize: 16, // Calories text style
  },
  darkContainer: { backgroundColor: "#333" }, // Dark mode container style
  lightContainer: { backgroundColor: "#fff" }, // Light mode container style
  darkText: { color: "#fff" }, // Dark mode text style
  lightText: { color: "#000" }, // Light mode text style
});

export default WorkoutsView;
