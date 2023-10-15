import MainScreen from "./screens/mainScreen"
import MainContainer from "./navigation/MainContainer";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <MainContainer/>
    </NavigationContainer>
  );
}

