import React, {useContext} from "react";
import { TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MotiView } from "moti";
import themeContext from "./themeContext";

const TopAnimatedHeader = ({navigation, yValue, title}) => {
    const theme = useContext(themeContext);
    return (        <MotiView
        from={{ translateY: -80 }}
        animate={{ translateY: yValue > 380 ? 0 : -80 }}
        transition={{ type: "timing", duration: "300" }}
        style={{
          width: "100%",
          height: 80,
          position: "absolute",
          top: 0,
          elevation: 6,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.headerColor,
        }}
      >
        <TouchableOpacity style={{ padding: 20, marginTop: 10 }}>
          <AntDesign
            name="arrowleft"
            size={35}
            color={theme.textColor}
            onPress={() => navigation.navigate("Home")}
          />
        </TouchableOpacity>
        <MotiView
          from={{ translateX: -60 }}
          animate={{ translateX: yValue > 380 ? 0 : -50 }}
          transition={{ type: "timing", duration: "300" }}
          style={{ marginTop: 10 }}
        >
          <Text
            style={{
              marginTop: 10,
              fontSize: 24,
              fontFamily: "stolzl",
              color: theme.textColor,
            }}
          > {title}
          </Text>
        </MotiView>
      </MotiView>
      );
}

export default TopAnimatedHeader;