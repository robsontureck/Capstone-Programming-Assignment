import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      // Clear error message when the screen is focused
      setErrorMessage("");
    }, [])
  );

  const handleLogin = async () => {
    // Validation: Check if username or password is blank
    if (username.trim() === "" || password.trim() === "") {
      setErrorMessage("Username and/or password cannot be blank.");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.104:3000/api/users/login",
        { username, password }
      );
      await AsyncStorage.setItem("token", response.data.token);
      navigation.replace("Main");
      setErrorMessage(""); // Clear the error message on successful login
    } catch (error) {
      setErrorMessage("Invalid username or password. Please try again.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.signUpButton]}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 10, // General margin for all buttons
  },
  signUpButton: {
    marginTop: 10, // Additional margin specifically for the Sign Up button
  },
  buttonText: {
    color: "#fff",
  },
});
