import React, { useState, useEffect, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { createStackNavigator } from "@react-navigation/stack";

import DashboardView from "./DashboardView";
import MealsView from "./MealsView";
import WorkoutsView from "./WorkoutsView";

export default function HomeScreen({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "dashboard", title: "Dashboard" },
    { key: "meals", title: "Meals" },
    { key: "workouts", title: "Workouts" },
  ]);

  const [userInfo, setUserInfo] = useState({ name: "", age: "", weight: "" });
  const [mealsData, setMealsData] = useState([]);
  const [workoutsData, setWorkoutsData] = useState([]);

  /*const fetchMealsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Fetching meals data...");
      const response = await axios.get(
        "http://192.168.1.103:3000/api/meals/meals",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMealsData(response.data);
      console.log("Fetched meals data:", response.data);
    } catch (error) {
      console.error(error);
    }
  };*/
  const fetchMealsData = useCallback(async () => {
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
      console.log("Fetched meals data view:", mealsData);
    } catch (error) {
      console.error("Fetching meals data failed:", error);
    }
  }, [mealsData, setMealsData]); // Include dependencies used inside the function

  const fetchWorkoutsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Fetching workouts data...");
      const response = await axios.get(
        "http://192.168.1.103:3000/api/workouts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkoutsData(response.data);
      console.log("Fetched workouts data:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Fetching user info...");
      const response = await axios.get(
        "http://192.168.1.103:3000/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
      console.log("Fetched user info:", response.data);
    } catch (error) {
      console.error(error);
    }
  };
  /*
  useEffect(() => {
    fetchUserInfo();
    fetchMealsData();
    fetchWorkoutsData();
  }, []); // Empty dependency array ensures this runs only once*/

  useEffect(() => {
    fetchUserInfo();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    fetchMealsData();
  }, []); // Empty dependency array ensures this runs only once

  const renderScene = SceneMap({
    dashboard: () => (
      <DashboardView userInfo={userInfo} activities={[]} meals={mealsData} />
    ),
    meals: () => (
      <MealsView
        mealsData={mealsData}
        setMealsData={setMealsData}
        fetchMealsData={fetchMealsData}
        navigation={navigation} // Pass navigation prop here
      />
    ),
    workouts: () => (
      <WorkoutsView
        fetchWorkoutsData={fetchWorkoutsData}
        workoutsData={workoutsData}
        setWorkoutsData={setWorkoutsData}
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
