import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "../styles/styles";

export default function AddMealView({ navigation, route }) {
  const { mealType, date, fetchMealsData } = route.params;
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");

  const addMealEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = {
        meal,
        calories: parseInt(calories),
        date,
        meal_type: mealType,
      };
      await axios.post("http://192.168.1.103:3000/api/meals/add", newEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMealsData();
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headers}>Add {mealType}</Text>
      <TextInput
        placeholder="Meal"
        value={meal}
        onChangeText={setMeal}
        style={styles.input}
      />
      <TextInput
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={styles.input}
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
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 7 },
});
