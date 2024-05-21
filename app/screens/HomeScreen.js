import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const DashboardView = ({ userInfo, activities, meals }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.info}>Name: {userInfo.name}</Text>
      <Text style={styles.info}>Age: {userInfo.age}</Text>
      <Text style={styles.info}>Weight: {userInfo.weight}</Text>
      <Text style={styles.header}>Activities of the Week</Text>
      {activities.map((activity, index) => (
        <Text key={index}>{activity}</Text>
      ))}
      <Text style={styles.header}>Meals of the Week</Text>
      {meals.map((meal, index) => (
        <Text key={index}>{meal}</Text>
      ))}
    </View>
  );
};

const ActivitiesView = ({
  fitnessData,
  setFitnessData,
  workout,
  setWorkout,
  date,
  setDate,
  fetchFitnessData,
}) => {
  const addFitnessEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = { workout, date };
      await axios.post(
        "http://YOUR_NEW_IP_ADDRESS:3000/api/fitness",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateFitnessEntry = async (id, workout, date) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `http://YOUR_NEW_IP_ADDRESS:3000/api/fitness/${id}`,
        { workout, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFitnessEntry = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://YOUR_NEW_IP_ADDRESS:3000/api/fitness/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Activity</Text>
      <TextInput
        placeholder="Workout"
        value={workout}
        onChangeText={setWorkout}
        style={styles.input}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Add Activity" onPress={addFitnessEntry} />
      <FlatList
        data={fitnessData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.workout}</Text>
            <Text>{item.date}</Text>
            <Button
              title="Edit"
              onPress={() =>
                updateFitnessEntry(item.id, item.workout, item.date)
              }
            />
            <Button
              title="Delete"
              onPress={() => deleteFitnessEntry(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

const MealsView = ({
  fitnessData,
  setFitnessData,
  meal,
  setMeal,
  date,
  setDate,
  fetchFitnessData,
}) => {
  const addFitnessEntry = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newEntry = { meal, date };
      await axios.post(
        "http://YOUR_NEW_IP_ADDRESS:3000/api/fitness",
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateFitnessEntry = async (id, meal, date) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `http://YOUR_NEW_IP_ADDRESS:3000/api/fitness/${id}`,
        { meal, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFitnessEntry = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://YOUR_NEW_IP_ADDRESS:3000/api/fitness/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFitnessData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Meal</Text>
      <TextInput
        placeholder="Meal"
        value={meal}
        onChangeText={setMeal}
        style={styles.input}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Add Meal" onPress={addFitnessEntry} />
      <FlatList
        data={fitnessData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.meal}</Text>
            <Text>{item.date}</Text>
            <Button
              title="Edit"
              onPress={() => updateFitnessEntry(item.id, item.meal, item.date)}
            />
            <Button
              title="Delete"
              onPress={() => deleteFitnessEntry(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default function HomeScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "dashboard", title: "Dashboard" },
    { key: "activities", title: "Activities" },
    { key: "meals", title: "Meals" },
  ]);

  const [userInfo, setUserInfo] = useState({ name: "", age: "", weight: "" });
  const [fitnessData, setFitnessData] = useState([]);
  const [workout, setWorkout] = useState("");
  const [meal, setMeal] = useState("");
  const [date, setDate] = useState("");

  const fetchFitnessData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.1.103:3000/api/fitness",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFitnessData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.1.103:3000/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFitnessData();
    fetchUserInfo();
  }, []);

  const renderScene = SceneMap({
    dashboard: () => (
      <DashboardView
        userInfo={userInfo}
        activities={fitnessData.filter((item) => item.workout)}
        meals={fitnessData.filter((item) => item.meal)}
      />
    ),
    activities: () => (
      <ActivitiesView
        fitnessData={fitnessData.filter((item) => item.workout)}
        setFitnessData={setFitnessData}
        workout={workout}
        setWorkout={setWorkout}
        date={date}
        setDate={setDate}
        fetchFitnessData={fetchFitnessData}
      />
    ),
    meals: () => (
      <MealsView
        fitnessData={fitnessData.filter((item) => item.meal)}
        setFitnessData={setFitnessData}
        meal={meal}
        setMeal={setMeal}
        date={date}
        setDate={setDate}
        fetchFitnessData={fetchFitnessData}
      />
    ),
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black" }}
          style={{ backgroundColor: "white" }}
          labelStyle={{ color: "black" }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 18, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  entry: { marginBottom: 10, padding: 10, borderWidth: 1 },
});
