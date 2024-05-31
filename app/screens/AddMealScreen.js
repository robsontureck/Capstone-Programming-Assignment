import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "../styles/styles";
import { useDarkMode } from "../contexts/DarkModeContext"; // Assuming you have a DarkModeContext

export default function AddMealView({ navigation, route }) {
  const { mealType, date, fetchMealsData } = route.params;
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  const { isDarkMode } = useDarkMode();

  const addMealEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = {
        meal,
        calories: parseInt(calories),
        date,
        meal_type: mealType,
      };

      const response = await axios.post(
        "http://192.168.1.104:3000/api/meals/add",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        fetchMealsData();
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add meal entry. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add meal entry:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while adding meal entry. Please try again."
      );
    }
  };

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.headers, textStyle]}>Add {mealType}</Text>
      <TextInput
        placeholder="Meal"
        value={meal}
        onChangeText={setMeal}
        style={[styles.input, textStyle]}
      />
      <TextInput
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={[styles.input, textStyle]}
      />

      <TouchableOpacity style={sharedStyles.button} onPress={addMealEntry}>
        <Text style={sharedStyles.buttonText}>{"SAVE"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headers: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
});
