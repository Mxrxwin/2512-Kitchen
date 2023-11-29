import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import MainContainer from "./navigation/MainContainer";
import { NavigationContainer } from "@react-navigation/native";
import theme from "./components/theme";
import themeContext from "./components/themeContext";
import { EventRegister } from "react-native-event-listeners";
import userContext from "./components/userContext";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebase.config";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = React.useState(null);
  const ref = useRef(null);  

  useEffect(() => {
    const listenerTheme = EventRegister.addEventListener(
      "ChangeTheme",
      (data, toggle) => {
        setDarkMode(data[0]);
        toggle = data[1];
      }
    );
    return () => {
      EventRegister.removeEventListener(listenerTheme);
    };
  }, [darkMode]);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, [])

  return (
    <userContext.Provider value={user}>
      <View style={{flex: 1}} ref={ref}>
        
        <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
          <NavigationContainer>
            <MainContainer />
          </NavigationContainer>
        </themeContext.Provider>
      
      </View>
    </userContext.Provider>
  );
}
