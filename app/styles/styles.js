import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 1,
  },
  greenButton: {
    backgroundColor: "#28a745", // A standard green color
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 3,
  },
  redButton: {
    backgroundColor: "red", // A standard green color
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 3,
  },
  buttonText: {
    color: "#fff",
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
});
