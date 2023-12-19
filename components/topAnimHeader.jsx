import React, { useContext, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import themeContext from "./themeContext";
import { getAuth } from "firebase/auth";
import { CheckUserAdmin } from "./authFunctions";

const TopAnimatedHeader = ({
	navigation,
	visible,
	title,
	color,
	durationHeader,
	durationText,
	fontSize,
	deletePosibility,
  currentMedia
}) => {
	const theme = useContext(themeContext);
  const [isAdmin, setIsAdmin] = useState();
  CheckUserAdmin(getAuth().currentUser, setIsAdmin);
	return (
		<MotiView
			from={{ translateY: -80 }}
			animate={{ translateY: visible ? 0 : -80 }}
			transition={{ type: "timing", duration: durationHeader }}
			style={{
				width: "100%",
				height: 80,
				position: "absolute",
				zIndex: 1,
				top: 0,
				elevation: 6,
				flexDirection: "row",
				alignItems: "center",
				backgroundColor: color !== undefined ? color : theme.headerColor,
			}}
		>
			<TouchableOpacity style={{ padding: 20, marginTop: 10 }}>
				<AntDesign
					name="arrowleft"
					size={35}
					color={color !== undefined ? "#DBDBDB" : theme.textColor}
					onPress={() => navigation.goBack()}
				/>
			</TouchableOpacity>
			<MotiView
				from={{ translateX: -60 }}
				animate={{ translateX: visible ? 0 : -50 }}
				transition={{ type: "timing", duration: durationText }}
				style={{
					marginTop: 10,
          width: '80%',
          justifyContent: 'space-between',
          alignItems: 'center',
					flexDirection: "row",
				}}
			>
				<Text
					style={{
						marginTop: 10,
						fontSize: fontSize !== undefined ? fontSize : 24,
						fontFamily: "stolzl",
						color: color !== undefined ? "#DBDBDB" : theme.textColor,
					}}
				>
					{" "}
					{title}
				</Text>
				{deletePosibility && isAdmin ? (
					<TouchableOpacity
						style={{ padding: 16}}
						onPress={() => navigation.navigate("AddMedia", {item: 
              currentMedia})}
					>
						<Octicons name="paintbrush" size={24} color={theme.textColor} />
					</TouchableOpacity>
				) : null}
			</MotiView>
		</MotiView>
	);
};

export default TopAnimatedHeader;
