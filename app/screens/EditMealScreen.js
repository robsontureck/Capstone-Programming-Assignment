import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "../styles/styles";
import { useDarkMode } from "../contexts/DarkModeContext"; // Importing dark mode context

const EditMeal = ({ route, navigation }) => {
  const { meals } = route.params; // Destructuring meals from route params
  const { isDarkMode } = useDarkMode(); // Using the dark mode state from context

  // Initializing state with meals, adding a key property for FlatList
  const [mealEdits, setMealEdits] = useState(
    meals.map((meal) => ({ ...meal, key: meal.id.toString() }))
  );

  // Function to handle saving meal changes
  const handleSave = async (meal) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const response = await axios.put(
        `http://192.168.1.104:3000/api/meals/meals/${meal.id}`,
        meal,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      route.params.fetchMealsData(); // Refresh meals data
      Alert.alert("Success", "Meal updated successfully!"); // Show success alert
    } catch (error) {
      console.error(error); // Log error to console
      Alert.alert("Error", "Failed to update meal."); // Show error alert
    }
  };

  // Function to handle deleting a meal
  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const response = await axios.delete(
        `http://192.168.1.104:3000/api/meals/meals/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update local state to remove deleted meal
      setMealEdits((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
      route.params.fetchMealsData(); // Refresh meals data
      Alert.alert("Deleted", "Meal deleted successfully!"); // Show success alert
    } catch (error) {
      console.error(error); // Log error to console
      Alert.alert("Error", "Failed to delete meal."); // Show error alert
    }
  };

  // Setting styles based on dark mode state
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  // Function to render each meal item
  const renderItem = ({ item, index }) => (
    <View style={[styles.mealEntry, containerStyle]}>
      <Text style={[styles.headers, textStyle]}>Meal</Text>
      <TextInput
        style={[styles.input, textStyle, { color: textStyle.color }]}
        value={item.meal}
        onChangeText={(text) => {
          const updatedMeals = [...mealEdits];
          updatedMeals[index].meal = text; // Update meal name
          setMealEdits(updatedMeals); // Set updated meals
        }}
      />
      <Text style={[styles.headers, textStyle]}>Calories</Text>
      <TextInput
        style={[styles.input, textStyle, { color: textStyle.color }]}
        value={item.calories.toString()}
        onChangeText={(text) => {
          const updatedMeals = [...mealEdits];
          updatedMeals[index].calories = parseInt(text, 10); // Update calories
          setMealEdits(updatedMeals); // Set updated meals
        }}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={sharedStyles.button}
        onPress={() => handleSave(item)} // Save button handler
      >
        <Text style={sharedStyles.buttonText}>SAVE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={sharedStyles.redButton}
        onPress={() => handleDelete(item.id)} // Delete button handler
      >
        <Text style={sharedStyles.buttonText}>DELETE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={mealEdits} // Data for FlatList
      renderItem={renderItem} // Render function for each item
      keyExtractor={(item) => item.key} // Unique key for each item
      style={[styles.container, containerStyle]} // Container style
    />
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
    padding: 10,
  },
  mealEntry: {
    marginBottom: 10,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
    padding: 10,
    fontSize: 18,
    textAlign: "right",
    borderRadius: 7,
  },
  darkContainer: { backgroundColor: "#333" },
  lightContainer: { backgroundColor: "#fff" },
  darkText: { color: "#fff" },
  lightText: { color: "#000" },
});

export default EditMeal;
