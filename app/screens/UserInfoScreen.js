import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserInfoScreen({ navigation }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");

  const handleSaveInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const userInfo = { name, age, weight, calories };
      await axios.post("http://192.168.1.104:3000/api/users/info", userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigation.replace("Main");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter Your Information</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Calories to Ingest per Day"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Save" onPress={handleSaveInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
