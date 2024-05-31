import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDarkMode } from "../contexts/DarkModeContext"; // Ensure the path matches your project structure

export default function AboutScreen() {
  const { isDarkMode } = useDarkMode(); // Using the dark mode state

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const headerStyle = isDarkMode ? styles.darkHeader : styles.lightHeader;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={headerStyle}>About Health & Fitness Tracker</Text>
      <Text style={textStyle}>
        This app helps you track your workouts, meals, and overall health
        metrics efficiently.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
  darkHeader: {
    color: "#fff",
    fontSize: 24, // Adjust the size as needed
    fontWeight: "bold",
    marginBottom: 10,
  },
  lightHeader: {
    color: "#000",
    fontSize: 24, // Adjust the size as needed
    fontWeight: "bold",
    marginBottom: 10,
  },
});
