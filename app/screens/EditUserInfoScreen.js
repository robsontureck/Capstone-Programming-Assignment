import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDarkMode } from "../contexts/DarkModeContext";
import sharedStyles from "../styles/styles"; // Importing shared styles

const EditUserInfo = ({ route, navigation }) => {
  const { userInfo } = route.params; // Destructuring userInfo from route params
  // Initializing state with user info
  const [name, setName] = useState(userInfo.name);
  const [age, setAge] = useState(userInfo.age.toString());
  const [weight, setWeight] = useState(userInfo.weight.toString());
  const [calories, setCalories] = useState(userInfo.calories.toString());

  const { isDarkMode } = useDarkMode(); // Using the dark mode state from context

  // Setting styles based on dark mode state
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const inputStyle = isDarkMode ? styles.darkInput : styles.lightInput;
  const buttonTextStyle = isDarkMode ? styles.darkText : styles.lightText;

  // Function to handle saving user info
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const response = await axios.put(
        "http://192.168.1.104:3000/api/users/info",
        {
          name,
          age: parseInt(age), // Parsing age to integer
          weight: parseInt(weight), // Parsing weight to integer
          calories: parseInt(calories), // Parsing calories to integer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Setting authorization header
          },
        }
      );
      console.log("User info updated:", response.data); // Logging response data
      if (route.params.fetchUserInfo) {
        route.params.fetchUserInfo(); // Refresh user info
      }
      navigation.goBack(); // Navigate back
      Alert.alert("Success", "User information has been updated successfully!"); // Show success alert
    } catch (error) {
      console.error(
        "Failed to update user info:",
        error.response?.data || "An error occurred" // Logging error response
      );
      Alert.alert("Error", "Failed to update user information."); // Show error alert
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={[styles.input, inputStyle]}
        value={age}
        onChangeText={setAge}
        placeholder="Age"
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, inputStyle]}
        value={weight}
        onChangeText={setWeight}
        placeholder="Weight"
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, inputStyle]}
        value={calories}
        onChangeText={setCalories}
        placeholder="Calories"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={sharedStyles.button}
        onPress={handleSave}
        color={buttonTextStyle}
      >
        <Text style={sharedStyles.buttonText}>{"SAVE"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  darkInput: {
    color: "#fff",
    backgroundColor: "#666",
  },
  lightInput: {
    color: "#000",
    backgroundColor: "#fff",
  },
  darkText: "#fff",
  lightText: "#000",
});

export default EditUserInfo;
