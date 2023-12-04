import React, { useContext, useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	useWindowDimensions
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import themeContext from "../components/themeContext";
import {
	DeleteAddedImage,
	SaveDishRecond,
} from "../components/photoUploadFunc";
import { PictureScroll } from "../components/picture";
import { useDynamicAnimation } from "moti";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GetIngrContent, CPFCPInput } from "../components/addPostComps";

export default function AddPost({ route, navigation }) {
	const { countDishes } = route.params;
	const [yValue, setYValue] = React.useState(0);
	const theme = useContext(themeContext);
	const [height, setHeight] = useState(0);
	const [countIngr, setCountInrg] = useState(3);
	const [leftScreen, setLeftScreen] = useState(true);
	const leftScreenRef = useRef(leftScreen);
	const windowHeight = useWindowDimensions().height;
	const [picHeight, setPicHeight] = useState(0);

	const [image, setImage] = useState("");
	const [addedImage, setAddedImage] = useState([]);
	const addedImageRef = useRef(addedImage);
	const [files, setFiles] = useState([
		{
			idParent: -1,
			createdAt: 1699136727177,
			url: "https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F1699136727177.jpeg?alt=media&token=ab83587d-d62a-4a68-a4e2-55d28efadcd4",
		},
	]);

	const [title, setTitle] = useState("");
	const [recipe, setRecipe] = useState("");
	const [CPFCP, setCPFCP] = useState(["", "", "", "", ""]);
	const [ingredients, setIngredients] = useState([]);

	const handlePicLayout = (event) => {
		const { height } = event.nativeEvent.layout;
		console.log(windowHeight, height, windowHeight - height);
		setPicHeight(height);
	  };
	
	useEffect(() => {
		if (image !== "") {
			const imageData = { createdAt: image[1], url: image[0] };
			if (files[0].createdAt === 1699136727177) {
				setFiles([imageData]);
			} else {
				setFiles((prevFiles) => [...prevFiles, imageData]);
			}
		}
	}, [image]);

	useEffect(() => {
		addedImageRef.current = addedImage;
	}, [addedImage]);

	useEffect(() => {
		if (files.length !== 0) {
			const newData = files[files.length - 1];
			if (addedImage.includes(newData)) {
				setAddedImage((prevAddedImage) => {
					return prevAddedImage.filter((item) => files.includes(item));
				});
			} else if (newData.idParent !== -1) {
				setAddedImage((prevAddedImage) => [...prevAddedImage, newData]);
			}
		} else {
			setFiles([
				{
					idParent: -1,
					createdAt: 1699136727177,
					url: "https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F1699136727177.jpeg?alt=media&token=ab83587d-d62a-4a68-a4e2-55d28efadcd4",
				},
			]);
		}
	}, [files]);

	useEffect(() => {
		return () => {
			exit(leftScreenRef.current);
		};
	}, []);

	function exit(leftScreen) {
		if (leftScreen) {
			DeleteAddedImage(addedImageRef.current);
		}
	}

	const animation = useDynamicAnimation(() => {
		return {
			width: "100%",
			height: 300,
		};
	});

	function Submit() {
		if (
			title === "" ||
			recipe === "" ||
			CPFCP.includes("") ||
			ingredients.length == 0 ||
			ingredients.includes("")  ||
			!CPFCP.every((element) => /^\d+$/.test(element))
			) {
			alert("Вы заполнили не все поля или в КБЖУЦ не цифры");
		} else {
 			leftScreenRef.current = false;
			SaveDishRecond(
				title,
				recipe,
				addedImageRef.current,
				countDishes,
				ingredients,
				CPFCP
			); 
			navigation.navigate("FullPost", {
				id: countDishes
			  });
			  
		}
	}

	return (
		<View style={styles.page}>
			<KeyboardAwareScrollView style={{ flex: 1 }}>
				<View style={{ flex: 1, zIndex: 2 }}>
					<ScrollView
						style={{ flex: 1}}
						onScroll={(e) => {
							if (e.nativeEvent.contentOffset.y.toFixed(0) > 30) {
								animation.animateTo({
									width: "100%",
									height: yValue > 250 ? 60 : 300 - yValue,
								});
							} else {
								animation.animateTo({
									width: "100%",
									height: 300,
								});
							}
							setYValue(e.nativeEvent.contentOffset.y.toFixed(0));
						}}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								zIndex: 2,
								width: "50%",
							}}
						>
							<TouchableOpacity style={{ padding: 20 }}>
								<AntDesign
									name="arrowleft"
									size={35}
									color="white"
									onPress={() => navigation.navigate("Home")}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.images} onLayout={handlePicLayout}>
							<PictureScroll
								pictures={files}
								deletePosibitity={true}
								setImage={setImage}
								setFiles={setFiles}
							/>
							
						</View>
						<View
							style={[
								styles.intupBlock,
								{ backgroundColor: theme.backgroundColor},
							]}
						>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.searchColor,
										color: theme.textColor,
										marginTop: 40,
									},
								]}
								placeholder="Заголовок"
								autoCapitalize='sentences'
								placeholderTextColor={theme.searchPlaceholderColor}
								onChangeText={(text) => setTitle(text)}
							></TextInput>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.searchColor,
										color: theme.textColor,
										height: Math.max(45, height),
									},
								]}
								multiline={true}
								numberOfLines={40}
								onContentSizeChange={(event) =>
									setHeight(event.nativeEvent.contentSize.height)
								}
								placeholder="Рецепт"
								autoCapitalize='sentences'
								placeholderTextColor={theme.searchPlaceholderColor}
								onChangeText={(text) => setRecipe(text)}
							></TextInput>
							<View style={styles.CPFCPBlock}>
								{CPFCPInput("Калории", 0, setCPFCP, CPFCP)}
								{CPFCPInput("Белки", 1, setCPFCP, CPFCP)}
								{CPFCPInput("Жиры", 2, setCPFCP, CPFCP)}
								{CPFCPInput("Углеводы", 3, setCPFCP, CPFCP)}
								{CPFCPInput("Цена", 4, setCPFCP, CPFCP)}
							</View>
							<View style={styles.IntrButtons}>
								<TouchableOpacity onPress={() => setCountInrg(countIngr + 1)}>
									<AntDesign name="plus" size={22} color="grey" />
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										setCountInrg(countIngr === 3 ? countIngr : countIngr - 1)
									}
								>
									<AntDesign name="minus" size={22} color="grey" />
								</TouchableOpacity>
							</View>
							<View style={styles.IngrBlock}>
								{GetIngrContent(countIngr, setIngredients, ingredients).map(
									(item) => (
										<View key={item[0]}>{item[1]}</View>
									)
								)}
							</View>
							<TouchableOpacity
								style={[styles.button, { backgroundColor: "#83E144", 
								marginBottom: 35}]}
								onPress={() => Submit()}
							>
								<Text style={[styles.buttonText, { color: "white" }]}>Принять</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>

			</KeyboardAwareScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	intupBlock: {
		zIndex: 2,
		marginTop: 300,
		borderTopStartRadius: 50,
		borderTopEndRadius: 50,
	},
	input: {
		marginVertical: 4,
		marginHorizontal: 20,
		height: 45,
		borderWidth: 1,
		borderColor: "#3333",
		borderRadius: 10,
		padding: 10,
		backgroundColor: "#fff",
		flexDirection: "row",
		fontFamily: "stolzl",
	},
	IngrBlock: {
		flexDirection: "column",
		marginVertical: 10,
		marginHorizontal: 20,
		marginBottom: 25,
	},
	images: {
		position: "absolute",
		zIndex: 1,
	},
	IntrButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 20,
	},
	CPFCPBlock: {
		flexDirection: "row",
		marginVertical: 10,
		marginHorizontal: 20,
		justifyContent: "space-between",
	},
	button: {
		borderRadius: 10,
		height: 50,
		width: "60%",
		padding: 10,
		borderWidth: 2,
		borderColor: "#83E144",
		alignSelf: "center",
		zIndex: 2,
	},
	buttonText: {
		alignSelf: "center",
		fontSize: 20,
		fontFamily: "stolzl",
	},
});
