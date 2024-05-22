import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DashboardView = ({ userInfo, activities, meals }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.info}>Name: {userInfo.name}</Text>
      <Text style={styles.info}>Age: {userInfo.age}</Text>
      <Text style={styles.info}>Weight: {userInfo.weight}</Text>
      <Text style={styles.header}>Activities of the Week</Text>
      {activities.map((activity, index) => (
        <Text key={index}>
          {activity.workout} - {activity.date}
        </Text>
      ))}
      <Text style={styles.header}>Meals of the Week</Text>
      {meals.map((meal, index) => (
        <Text key={index}>
          {meal.meal} - {meal.date}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 18, marginBottom: 5 },
});

export default DashboardView;
