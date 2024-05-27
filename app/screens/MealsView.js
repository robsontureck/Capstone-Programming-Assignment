import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MealsView = ({ navigation, mealsData, setMealsData, fetchMealsData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchMealsData();
  }, [selectedDate]); // Only run when selectedDate changes

  // Memoize the data fetching function
  const fetchMealsDataView = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Fetching meals data view...");
      const response = await axios.get(
        "http://192.168.1.103:3000/api/meals/meals", // Ensure the URL is correct and accessible
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if the fetched data is different from the current state before updating
      if (JSON.stringify(mealsData) !== JSON.stringify(response.data)) {
        setMealsData(response.data);
      }
      console.log("Fetched meals data view:", response.data);
    } catch (error) {
      console.error("Fetching meals data failed:", error);
    }
  }, [mealsData, setMealsData]); // Include dependencies used inside the function
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
        <Text style={styles.header}>{mealType}</Text>
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Text style={styles.mealText}>{item.meal}</Text>
              <Text style={styles.caloriesText}>{item.calories} Calories</Text>
            </View>
          )}
        />
        <Button
          title={`Add ${mealType}`}
          onPress={() =>
            navigation.navigate("AddMeal", {
              mealType,
              date: selectedDate.toISOString().split("T")[0],
              fetchMealsData,
            })
          }
        />
        <Button
          title={`Edit ${mealType}`}
          onPress={() =>
            navigation.navigate("EditMeal", {
              mealType,
              date: selectedDate.toISOString().split("T")[0],
              meals,
              fetchMealsData,
            })
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => onDateChange(-1)}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        <TouchableOpacity onPress={() => onDateChange(1)}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>
      {renderMeals("Breakfast")}
      {renderMeals("Lunch")}
      {renderMeals("Dinner")}
    </View>
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
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  entry: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between items
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    alignItems: "center", // Align items vertically
  },
  mealText: {
    fontSize: 16, // Example size
    fontWeight: "bold",
  },
  caloriesText: {
    fontSize: 16, // Example size
  },
});

export default MealsView;
