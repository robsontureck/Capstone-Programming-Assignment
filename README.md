# Capstone-Programming-Assignment

# Health & Fitness Tracker

## Purpose

The Health & Fitness Tracker is an application designed to help users track their workouts, meals, and overall health metrics efficiently. Users can log their daily meals, workout routines, and monitor their calorie intake.

## Features

1. User authentication and management (signup, login, logout).
2. Dark mode support.
3. Log daily meals with calorie count and meal type.
4. Log workout activities with type, duration, and date.
5. View dashboard with user information and daily summary of meals and workouts.
6. Edit and delete logged meals and workouts.
7. Responsive UI with support for light and dark modes.

## Dependencies

# Backend

- express
- dotenv
- sequelize
- mysql2
- bcryptjs
- jsonwebtoken
- multer

# Frontend

- react
- react-native
- react-navigation
- axios
- @react-native-async-storage/async-storage
- @react-native-picker/picker

To install these dependencies run:

- npm install

This command will install all the necessary packages listed in the package.json file, setting up the environment for development and production.

## Application Architecture

# Backend

- middleware: Contains auth.js for JWT authentication middleware.
- models: Contains Sequelize models for MySQL.
- routes: Contains route handlers for meals, users, and workouts.
- app.js: The main entry point for the backend server.

# Frontend

- context: Contains DarkModeContext.js for managing dark mode state.
- screens: Contains various screen components like Login, Signup, Dashboard, etc.
- styles: Contains shared styles for the application.
- App.js: The main entry point for the React Native application.

## API Documentation (Swagger)

The backend API is documented using Swagger. You can access the API documentation at http://localhost:3000/api-docs.

## Reporting Issues

To report issues or suggest enhancements, please use the Issues section of this GitHub repository. Be sure to describe the issue or feature request in detail, and where applicable, include screenshots or code snippets that demonstrate the problem or improvement.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
