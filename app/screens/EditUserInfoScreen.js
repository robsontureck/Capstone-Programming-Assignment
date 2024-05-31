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
import sharedStyles from "../styles/styles";

const EditUserInfo = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [name, setName] = useState(userInfo.name);
  const [age, setAge] = useState(userInfo.age.toString());
  const [weight, setWeight] = useState(userInfo.weight.toString());
  const [calories, setCalories] = useState(userInfo.calories.toString());

  const { isDarkMode } = useDarkMode(); // Use the dark mode state
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const inputStyle = isDarkMode ? styles.darkInput : styles.lightInput;
  const buttonTextStyle = isDarkMode ? styles.darkText : styles.lightText;

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        "http://192.168.1.104:3000/api/users/info",
        {
          name,
          age: parseInt(age),
          weight: parseInt(weight),
          calories: parseInt(calories),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User info updated:", response.data);
      if (route.params.fetchUserInfo) {
        route.params.fetchUserInfo();
      }
      navigation.goBack();
      Alert.alert("Success", "User information has been updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update user info:",
        error.response?.data || "An error occurred"
      );
      Alert.alert("Error", "Failed to update user information.");
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
