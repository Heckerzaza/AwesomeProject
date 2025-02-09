// config.js
import { Platform } from 'react-native';

const API_ENDPOINT = Platform.OS === 'web'
  ? process.env.REACT_APP_API_ENDPOINT // For web development with create-react-app
  : process.env.API_ENDPOINT; // For React Native

export { API_ENDPOINT };