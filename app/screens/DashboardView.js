import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import sharedStyles from "../styles/styles";
import { useDarkMode } from "../contexts/DarkModeContext"; // Importing dark mode context

const DashboardView = ({
  userInfo,
  activities,
  meals,
  navigation,
  fetchUserInfo,
}) => {
  const { isDarkMode } = useDarkMode(); // Using the dark mode state from context
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initializing state for selected date

  // Function to handle date changes
  const onDateChange = (change) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + change); // Adjust date by the change value
      return newDate;
    });
  };

  // Function to calculate total calories for the selected date
  const getTotalCalories = () => {
    return meals.reduce((total, meal) => {
      if (new Date(meal.date).toDateString() === selectedDate.toDateString()) {
        return total + meal.calories;
      }
      return total;
    }, 0);
  };

  // Function to calculate remaining calories for the selected date
  const getRemainingCalories = () => {
    return userInfo.calories - getTotalCalories();
  };

  // Function to render meals of a specific type
  const renderMeals = (mealType) => {
    const mealsByType = meals.filter(
      (meal) =>
        new Date(meal.date).toDateString() === selectedDate.toDateString() &&
        meal.meal_type === mealType
    );
    return (
      <View>
        <Text
          style={[
            styles.header,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {mealType}
        </Text>
        {mealsByType.map((meal, index) => (
          <Text
            key={index}
            style={isDarkMode ? styles.darkText : styles.lightText}
          >
            {meal.meal} - {meal.calories} Kcal
          </Text>
        ))}
      </View>
    );
  };

  // Function to render activities for the selected date
  const renderActivities = () => {
    const activitiesByDate = activities.filter(
      (activity) =>
        new Date(activity.date).toDateString() === selectedDate.toDateString()
    );
    return activitiesByDate.map((activity, index) => (
      <Text key={index} style={isDarkMode ? styles.darkText : styles.lightText}>
        {activity.type} - {activity.duration} mins
      </Text>
    ));
  };

  // Setting container style based on dark mode state
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <ScrollView style={[styles.container, containerStyle]}>
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.header,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Dashboard
        </Text>
        <Text
          style={[styles.info, isDarkMode ? styles.darkText : styles.lightText]}
        >
          Name: {userInfo.name}
        </Text>
        <Text
          style={[styles.info, isDarkMode ? styles.darkText : styles.lightText]}
        >
          Age: {userInfo.age} years
        </Text>
        <Text
          style={[styles.info, isDarkMode ? styles.darkText : styles.lightText]}
        >
          Weight: {userInfo.weight} kg
        </Text>
        <Text
          style={[styles.info, isDarkMode ? styles.darkText : styles.lightText]}
        >
          Calories per day: {userInfo.calories} kCal
        </Text>

        <TouchableOpacity
          style={sharedStyles.greenButton}
          onPress={() =>
            navigation.navigate("EditUserInfo", { userInfo, fetchUserInfo })
          }
        >
          <Text style={sharedStyles.buttonText}>{"Edit User Info"}</Text>
        </TouchableOpacity>

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

        <Text
          style={[
            styles.header,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Activities of the Day
        </Text>
        {renderActivities()}

        {renderMeals("Breakfast")}
        {renderMeals("Lunch")}
        {renderMeals("Dinner")}

        <Text
          style={[
            styles.totalCalories,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Total Calories: {getTotalCalories()} Kcal
        </Text>
        <Text
          style={[
            styles.totalCalories,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Calories Remaining: {getRemainingCalories()} Kcal
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flexGrow: 1, padding: 20 },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: { fontSize: 24, marginHorizontal: 20 },
  dateText: { fontSize: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: "left",
  },
  totalCalories: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  darkContainer: { backgroundColor: "#333" },
  lightContainer: { backgroundColor: "#fff" },
  darkText: { color: "#fff" },
  lightText: { color: "#000" },
});

export default DashboardView;
