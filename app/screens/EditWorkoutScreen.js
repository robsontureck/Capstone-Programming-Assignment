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
  const { workoutId, currentType, currentDuration, date } = route.params;
  const [type, setType] = useState(currentType);
  const [duration, setDuration] = useState(currentDuration.toString());
  const { isDarkMode } = useDarkMode(); // Use the dark mode context

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put(
        `http://192.168.1.103:3000/api/workouts/workouts/${workoutId}`,
        { type, duration: parseInt(duration), date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      route.params.fetchWorkoutsData();
      Alert.alert("Success", "Workout updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update workout:", error);
      Alert.alert("Error", "Failed to update workout.");
    }
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(
        `http://192.168.1.103:3000/api/workouts/workouts/${workoutId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      route.params.fetchWorkoutsData();
      Alert.alert("Deleted", "Workout deleted successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete workout:", error);
      Alert.alert("Error", "Failed to delete workout.");
    }
  };

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.headers, textStyle]}>Workout</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
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
        value={duration}
        onChangeText={setDuration}
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
