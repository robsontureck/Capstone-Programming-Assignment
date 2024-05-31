import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "../styles/styles";
import { useDarkMode } from "../contexts/DarkModeContext"; // Ensure the path matches your project structure

const EditWorkout = ({ route, navigation }) => {
  const { workoutId, currentType, currentDuration, date } = route.params; // Destructuring route params
  const [type, setType] = useState(currentType); // Initializing state with current workout type
  const [duration, setDuration] = useState(currentDuration.toString()); // Initializing state with current workout duration
  const { isDarkMode } = useDarkMode(); // Using the dark mode state from context

  // Function to handle saving changes to the workout
  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
    try {
      await axios.put(
        `http://192.168.1.104:3000/api/workouts/workouts/${workoutId}`,
        { type, duration: parseInt(duration), date }, // Sending updated workout data
        { headers: { Authorization: `Bearer ${token}` } } // Setting authorization header
      );
      route.params.fetchWorkoutsData(); // Refresh workouts data
      Alert.alert("Success", "Workout updated successfully!"); // Show success alert
      navigation.goBack(); // Navigate back
    } catch (error) {
      console.error("Failed to update workout:", error); // Log error to console
      Alert.alert("Error", "Failed to update workout."); // Show error alert
    }
  };

  // Function to handle deleting the workout
  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
    try {
      await axios.delete(
        `http://192.168.1.104:3000/api/workouts/workouts/${workoutId}`,
        { headers: { Authorization: `Bearer ${token}` } } // Setting authorization header
      );
      route.params.fetchWorkoutsData(); // Refresh workouts data
      Alert.alert("Deleted", "Workout deleted successfully!"); // Show success alert
      navigation.goBack(); // Navigate back
    } catch (error) {
      console.error("Failed to delete workout:", error); // Log error to console
      Alert.alert("Error", "Failed to delete workout."); // Show error alert
    }
  };

  // Setting styles based on dark mode state
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.headers, textStyle]}>Workout</Text>
      <Picker
        selectedValue={type} // Selected workout type
        onValueChange={(itemValue) => setType(itemValue)} // Update type state
        style={[styles.picker, textStyle]}
        itemStyle={textStyle}
      >
        <Picker.Item label="Running" value="Running" />
        <Picker.Item label="Cycling" value="Cycling" />
        <Picker.Item label="Swimming" value="Swimming" />
        <Picker.Item label="Yoga" value="Yoga" />
        <Picker.Item label="Weight Training" value="Weight Training" />
      </Picker>
      <Text style={[styles.headers, textStyle]}>Duration (mins)</Text>
      <TextInput
        value={duration} // Workout duration
        onChangeText={setDuration} // Update duration state
        keyboardType="numeric"
        style={[styles.input, textStyle]}
      />
      <TouchableOpacity style={sharedStyles.button} onPress={handleSave}>
        <Text style={sharedStyles.buttonText}>{"SAVE CHANGES"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={sharedStyles.redButton} onPress={handleDelete}>
        <Text style={sharedStyles.buttonText}>{"DELETE WORKOUT"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headers: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  container: {
    flex: 1,
    flexDirection: "column", // Align children vertically
    padding: 20,
  },
  picker: { height: 50, width: "100%", marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 7,
    textAlign: "right",
    fontSize: 25,
  },
  darkContainer: { backgroundColor: "#333" },
  lightContainer: { backgroundColor: "#fff" },
  darkText: { color: "#fff" },
  lightText: { color: "#000" },
});

export default EditWorkout;
