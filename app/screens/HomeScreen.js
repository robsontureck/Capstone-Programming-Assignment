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
  const layout = useWindowDimensions(); // Getting the dimensions of the window
  const [index, setIndex] = useState(0); // State to manage the current tab index
  const [routes] = useState([
    { key: "dashboard", title: "Dashboard" },
    { key: "meals", title: "Meals" },
    { key: "workouts", title: "Workouts" },
  ]); // Defining routes for TabView

  const [userInfo, setUserInfo] = useState({ name: "", age: "", weight: "" }); // State to hold user information
  const [mealsData, setMealsData] = useState([]); // State to hold meals data
  const [workoutsData, setWorkoutsData] = useState([]); // State to hold workouts data

  // Fetch meals data from the server
  const fetchMealsData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const response = await axios.get(
        "http://192.168.1.104:3000/api/meals/meals",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if the fetched data is different from the current state before updating
      if (JSON.stringify(mealsData) !== JSON.stringify(response.data)) {
        setMealsData(response.data);
      }
    } catch (error) {
      console.error("Fetching meals data failed:", error); // Log error to console
    }
  }, [mealsData, setMealsData]); // Include dependencies used inside the function

  // Fetch workouts data from the server
  const fetchWorkoutsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const response = await axios.get(
        "http://192.168.1.104:3000/api/workouts/workouts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkoutsData(response.data); // Update workouts data state
    } catch (error) {
      console.error(error); // Log error to console
    }
  };

  // Fetch user information from the server
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Fetching token from AsyncStorage
      const response = await axios.get(
        "http://192.168.1.104:3000/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data); // Update user info state
    } catch (error) {
      console.error(error); // Log error to console
    }
  };

  // useEffect to fetch initial data when the component mounts
  useEffect(() => {
    fetchUserInfo();
    fetchMealsData();
    fetchWorkoutsData();
  }, []); // Empty dependency array ensures this runs only once

  // Define scenes for each tab
  const renderScene = SceneMap({
    dashboard: () => (
      <DashboardView
        userInfo={userInfo}
        activities={workoutsData}
        meals={mealsData}
        fetchUserInfo={fetchUserInfo}
        navigation={navigation}
      />
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
        navigation={navigation} // Pass navigation prop here
      />
    ),
  });

  return (
    <TabView
      navigationState={{ index, routes }} // Manage tab state
      renderScene={renderScene} // Render the scenes based on the current tab
      onIndexChange={setIndex} // Update the index when the tab changes
      initialLayout={{ width: layout.width }} // Set initial layout width
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black" }} // Style for the tab indicator
          style={{ backgroundColor: "white" }} // Style for the tab bar
          labelStyle={{ color: "black" }} // Style for the tab labels
        />
      )}
    />
  );
}
