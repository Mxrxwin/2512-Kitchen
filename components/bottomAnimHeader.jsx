import React, {useContext} from "react";
import { TouchableOpacity, Text, Dimensions, StatusBar, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MotiView } from "moti";
import themeContext from "./themeContext";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";



const BottomAnimatedHeader = ({navigation, visible, text, color, durationHeader, durationText}) => {
    const theme = useContext(themeContext);
    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();
    const availableHeight = frame.height - insets.top - insets.bottom;
    return (        
    <MotiView
        from={{ translateY: availableHeight}}
        animate={{ translateY: visible ? availableHeight - 50: availableHeight + 50}}
        transition={{ type: "timing", duration: durationHeader }}
        style={{
          width: "100%",
          height: 80,
          position: "absolute",
          zIndex: 1,
          top: 0,
          elevation: 6,
          flexDirection: "row",
          backgroundColor: color !== undefined ? color : theme.headerColor,
        }}
      >
        <MotiView
          from={{ translateX: -60 }}
          animate={{ translateX: visible ? 20  : -100}}
          transition={{ type: "timing", duration: durationText }}
          style={{ marginTop: 10, width: '90%'}}
        >
          <Text
            style={{
              marginTop: 10,
              fontSize: 24,
              fontFamily: "stolzl",
              color: "#DBDBDB",
            }}
            adjustsFontSizeToFit={true}
            numberOfLines={4}
          > {text}
          </Text>
        </MotiView>
      </MotiView>
      );
}

export default BottomAnimatedHeader;