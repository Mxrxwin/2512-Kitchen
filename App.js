import React, { useState, useEffect } from "react";
import MainContainer from "./navigation/MainContainer";
import { NavigationContainer } from "@react-navigation/native";
import theme from "./components/theme";
import themeContext from "./components/themeContext";
import { EventRegister } from "react-native-event-listeners";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listenerTheme = EventRegister.addEventListener(
      "ChangeTheme",
      (data) => {
        setDarkMode(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(listenerTheme);
    };
  }, [darkMode]);

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <NavigationContainer>
        <MainContainer />
      </NavigationContainer>
    </themeContext.Provider>
  );
}
