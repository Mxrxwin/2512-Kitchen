import {createContext} from "react";  
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeContext = createContext();

export default themeContext;


export const saveThemePreference = async (theme) => {
  try {
    await AsyncStorage.setItem('themePreference', theme.toString());
  } catch (error) {
    console.error('Error saving theme preference:', error);
  }
};

export const getThemePreference = async (setFunc) => {
  try {
    const themeString = await AsyncStorage.getItem('themePreference');
    const theme = themeString === "true"; // Преобразование из строки в булево значение
    setFunc(theme);
    return;
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return null;
  }
};

