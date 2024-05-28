import React, { useState, useEffect } from "react";
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

const EditWorkout = ({ route, navigation }) => {
  const { workoutId, currentType, currentDuration, date } = route.params;
  const [type, setType] = useState(currentType);
  const [duration, setDuration] = useState(currentDuration.toString());

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(
      `Updating with type: ${type}, duration: ${duration}, date: ${date}`
    );
    try {
      await axios.put(
        `http://192.168.1.103:3000/api/workouts/workouts/${workoutId}`,
        {
          type,
          duration: parseInt(duration),
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      route.params.fetchWorkoutsData();
      Alert.alert("Success", "Workout updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update workout:", error);
    }
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(
        `http://192.168.1.103:3000/api/workouts/workouts/${workoutId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      route.params.fetchWorkoutsData();
      Alert.alert("Deleted", "Workout deleted successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete workout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headers}>Workout</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Running" value="Running" />
        <Picker.Item label="Cycling" value="Cycling" />
        <Picker.Item label="Swimming" value="Swimming" />
        <Picker.Item label="Yoga" value="Yoga" />
        <Picker.Item label="Weight Training" value="Weight Training" />
      </Picker>
      <Text style={styles.headers}>Duration (mins)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

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
});

export default EditWorkout;
