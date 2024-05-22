import React, { useState, useEffect } from "react";
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

  const onDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const renderMeals = (mealType) => {
    const meals = mealsData.filter(
      (item) =>
        item.mealType === mealType &&
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
              <Text>{item.meal}</Text>
              <Text>{item.calories} Calories</Text>
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
  entry: { marginBottom: 10, padding: 10, borderWidth: 1 },
});

export default MealsView;
