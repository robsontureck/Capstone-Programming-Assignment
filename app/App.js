import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Icon from "react-native-vector-icons/Ionicons";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UserInfoScreen from "./screens/UserInfoScreen";
import AddMealScreen from "./screens/AddMealScreen";
import EditMealScreen from "./screens/EditMealScreen";
import EditWorkoutScreen from "./screens/EditWorkoutScreen";
import EditUserInfoScreen from "./screens/EditUserInfoScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "About") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false, // This will hide the header for all screens
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="UserInfo" component={UserInfoScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="AddMeal" component={AddMealScreen} />
          <Stack.Screen name="EditMeal" component={EditMealScreen} />
          <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
          <Stack.Screen name="EditUserInfo" component={EditUserInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
