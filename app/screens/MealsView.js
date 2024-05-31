import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "../styles/styles";
import { useDarkMode } from "../contexts/DarkModeContext"; // Importing dark mode context

const MealsView = ({ navigation, mealsData, setMealsData, fetchMealsData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initializing state for selected date
  const { isDarkMode } = useDarkMode(); // Using the dark mode state from context

  // useEffect to fetch meals data when selectedDate changes
  useEffect(() => {
    fetchMealsData();
  }, [selectedDate]);

  // Function to handle date changes
  const onDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days); // Adjust date by the number of days
    setSelectedDate(newDate); // Update selected date state
  };

  // Function to render meals of a specific type
  const renderMeals = (mealType) => {
    const meals = mealsData.filter(
      (item) =>
        item.meal_type === mealType &&
        item.date === selectedDate.toISOString().split("T")[0]
    );
    return (
      <View style={styles.mealContainer}>
        <Text
          style={[
            styles.header,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {mealType}
        </Text>
        {meals.map((item, index) => (
          <View key={index} style={styles.entry}>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              {item.meal}
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              {item.calories} Kcal
            </Text>
          </View>
        ))}
        <TouchableOpacity
          style={sharedStyles.greenButton}
          onPress={() =>
            navigation.navigate("AddMeal", {
              mealType,
              date: selectedDate.toISOString().split("T")[0],
              fetchMealsData,
            })
          }
        >
          <Text style={sharedStyles.buttonText}>{`Add ${mealType}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={sharedStyles.button}
          onPress={() =>
            navigation.navigate("EditMeal", {
              mealType,
              date: selectedDate.toISOString().split("T")[0],
              meals,
              fetchMealsData,
            })
          }
        >
          <Text style={sharedStyles.buttonText}>{`Edit ${mealType}`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Setting styles based on dark mode state
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <ScrollView style={[styles.container, containerStyle]}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => onDateChange(-1)}>
          <Text
            style={[
              styles.arrow,
              isDarkMode ? styles.darkText : styles.lightText,
            ]}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.dateText,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {selectedDate.toDateString()}
        </Text>
        <TouchableOpacity onPress={() => onDateChange(1)}>
          <Text
            style={[
              styles.arrow,
              isDarkMode ? styles.darkText : styles.lightText,
            ]}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
      {renderMeals("Breakfast")}
      {renderMeals("Lunch")}
      {renderMeals("Dinner")}
    </ScrollView>
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
  arrow: { fontSize: 24, marginHorizontal: 20 }, // Arrow style
  dateText: { fontSize: 18 }, // Date text style
  mealContainer: { marginBottom: 20 }, // Meal container style
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Header text style
  },
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 7, // Entry container style
  },
  mealText: {
    fontSize: 16,
    fontWeight: "bold", // Meal text style
  },
  caloriesText: {
    fontSize: 16, // Calories text style
  },
  darkContainer: {
    backgroundColor: "#333", // Dark mode container style
  },
  lightContainer: {
    backgroundColor: "#fff", // Light mode container style
  },
  darkText: {
    color: "#fff", // Dark mode text style
  },
  lightText: {
    color: "#000", // Light mode text style
  },
});

export default MealsView;
