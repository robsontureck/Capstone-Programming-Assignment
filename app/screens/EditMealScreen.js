import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "../styles/styles";

const EditMeal = ({ route, navigation }) => {
  const { meals } = route.params;
  const [mealEdits, setMealEdits] = useState(meals);

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
      // Optionally refresh the meal list or navigate back
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

  return (
    <View style={styles.container}>
      {mealEdits.map((meal, index) => (
        <View key={meal.id} style={styles.mealEntry}>
          <Text style={styles.headers}>Meal</Text>
          <TextInput
            style={styles.input}
            value={meal.meal}
            onChangeText={(text) => {
              const updatedMeals = [...mealEdits];
              updatedMeals[index].meal = text;
              setMealEdits(updatedMeals);
            }}
          />
          <Text style={styles.headers}>Calories</Text>
          <TextInput
            style={styles.input}
            value={meal.calories.toString()}
            onChangeText={(text) => {
              const updatedMeals = [...mealEdits];
              updatedMeals[index].calories = text;
              setMealEdits(updatedMeals);
            }}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={sharedStyles.button}
            onPress={() => handleSave(meal)}
          >
            <Text style={sharedStyles.buttonText}>{"SAVE"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={sharedStyles.redButton}
            onPress={() => handleDelete(meal.id)}
          >
            <Text style={sharedStyles.buttonText}>{"DELETE"}</Text>
          </TouchableOpacity>
        </View>
      ))}
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
});

export default EditMeal;
