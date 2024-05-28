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
import { useDarkMode } from "../contexts/DarkModeContext"; // Assuming the context setup
const EditMeal = ({ route, navigation }) => {
  const { meals } = route.params;
  const { isDarkMode } = useDarkMode(); // Access dark mode flag
  const [mealEdits, setMealEdits] = useState(
    meals.map((meal) => ({ ...meal, key: meal.id.toString() }))
  );
  const handleSave = async (meal) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `http://192.168.1.103:3000/api/meals/meals/${meal.id}`,
        meal,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      route.params.fetchMealsData();
      Alert.alert("Success", "Meal updated successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update meal.");
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `http://192.168.1.103:3000/api/meals/meals/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMealEdits((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
      route.params.fetchMealsData();
      Alert.alert("Deleted", "Meal deleted successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete meal.");
    }
  };
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const renderItem = ({ item, index }) => (
    <View style={[styles.mealEntry, containerStyle]}>
      <Text style={[styles.headers, textStyle]}>Meal</Text>
      <TextInput
        style={[styles.input, textStyle, { color: textStyle.color }]}
        value={item.meal}
        onChangeText={(text) => {
          const updatedMeals = [...mealEdits];
          updatedMeals[index].meal = text;
          setMealEdits(updatedMeals);
        }}
      />
      <Text style={[styles.headers, textStyle]}>Calories</Text>
      <TextInput
        style={[styles.input, textStyle, { color: textStyle.color }]}
        value={item.calories.toString()}
        onChangeText={(text) => {
          const updatedMeals = [...mealEdits];
          updatedMeals[index].calories = parseInt(text, 10);
          setMealEdits(updatedMeals);
        }}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={sharedStyles.button}
        onPress={() => handleSave(item)}
      >
        <Text style={sharedStyles.buttonText}>SAVE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={sharedStyles.redButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={sharedStyles.buttonText}>DELETE</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <FlatList
      data={mealEdits}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      style={[styles.container, containerStyle]}
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
