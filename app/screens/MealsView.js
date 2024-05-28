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
import { useDarkMode } from "../contexts/DarkModeContext"; // Ensure you have the correct path to your context

const MealsView = ({ navigation, mealsData, setMealsData, fetchMealsData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetchMealsData();
  }, [selectedDate]);

  const onDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

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
              {item.calories} Calories
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
  container: { flex: 1, padding: 20 },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: { fontSize: 24, marginHorizontal: 20 },
  dateText: { fontSize: 18 },
  mealContainer: { marginBottom: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 7,
  },
  mealText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  caloriesText: {
    fontSize: 16,
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

export default MealsView;
