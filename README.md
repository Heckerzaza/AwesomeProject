# React Native Expo App

This project is a React Native application using Expo.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Emulator (for Android) or Xcode (for iOS) if running on a simulator
- A physical device (optional, but recommended for testing)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd <project_directory>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Running the App

### Start the Development Server
To start the development server, run:
```sh
npm start
```
This will open the Expo Developer Tools in your browser, where you can run the app on a simulator or physical device.

### Running on Android
To run the app on an Android device or emulator, use:
```sh
npm run android
```
Ensure you have an Android emulator running or a physical device connected with USB debugging enabled.

### Running on iOS
To run the app on an iOS simulator or device, use:
```sh
npm run ios
```
> **Note:** macOS and Xcode are required to run the app on iOS.

### Running on Web
To run the app in a web browser, use:
```sh
npm run web
```
This will start a development server and open the app in your default browser.

## Additional Notes
- Ensure that you have the Expo Go app installed on your mobile device if running on a physical device.
- Use the QR code in Expo Developer Tools to launch the app on your phone.
- For troubleshooting, refer to the [Expo Documentation](https://docs.expo.dev/).

## License
This project is licensed under [MIT License](LICENSE).

