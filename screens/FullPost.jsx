import React, { useContext, useState } from "react";
import { View, Text, ScrollView, BackHandler, Image } from "react-native";
import { Loading } from "../components/loading";
import { StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useDynamicAnimation } from "moti";
import themeContext from "../components/themeContext";
import { PictureScroll } from "../components/picture";
import {
  AddComment,
	FetchComments,
	FetchDish,
	FetchImages,
} from "../components/photoUploadFunc";
import TopAnimatedHeader from "../components/topAnimHeader";
import userContext from "../components/userContext";
import { CheckUserAdmin, CheckUserSAdmin } from "../components/authFunctions";
import { Comment } from "../components/comment";
import { getAuth } from "firebase/auth";

export default FullPostScreen = ({ route, navigation }) => {
	const [yValue, setYValue] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [images, setImages] = useState([]);
	const [data, setData] = useState([]);
	const [CPFCP, setCPFCP] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const { id } = route.params;
	const theme = useContext(themeContext);
	const user = useContext(userContext);
	const [ifUserAdmin, setIfUserAdmin] = useState(false);
	const [comments, setComments] = useState([]);
	const currentUser = getAuth().currentUser;
	const [ifSAdmin, setIfSAdmin] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [commentTextHeight, setCommentTextHeight] = useState(0);
	CheckUserSAdmin(currentUser, setIfSAdmin);
	const defaultPictureURL =
		"https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F2519237903.jpg?alt=media&token=33c4fac3-eda1-4fe3-9929-ad2b50d9a046";

	React.useEffect(() => {
		if (user !== null) {
			CheckUserAdmin(user, setIfUserAdmin);
		} else {
			setIfUserAdmin(false);
		}
	}, [user]);

  const FetchCommentsMethod = () => {
    setComments([]);
	FetchComments(id, setComments);
  }
	const animation = useDynamicAnimation(() => {
		return {
			width: "100%",
			height: 300,
		};
	});

	const AddCommentFunc = () => {
		if (commentText === "") {
			alert("Вы ввели пустой комментарий");
			return;
		}
		AddComment(currentUser.uid, id, commentText); 
		setCommentText("");
		FetchCommentsMethod();
	}

	React.useEffect(() => {
		navigation.setOptions({
			id,
		});
		FetchData(id);

		let hasNavigated;
		const handleBackButton = () => {
			if (!hasNavigated) {
				navigation.navigate("Home");
				hasNavigated = true;
				return true;
			}
			return false;
		};
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			handleBackButton
		);
		return () => {
			backHandler.remove();
		};
	}, []);

	async function FetchData(id) {
		const data = await FetchDish(id);
		setImages(await FetchImages(id));
		setData(data[0]);
		setCPFCP(data[0].CPFCP);
		setIngredients(data[0].Ingredients);
    	FetchCommentsMethod();
	}

	if (ingredients.length === 0) {
		return <Loading />;
	}

	return (
		<View style={{ flex: 1, width: "100%", height: 450 }}>
			<View style={{ flex: 1, zIndex: 2 }}>
				<ScrollView
					style={{ flex: 1 }}
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
					<View style={{ zIndex: 2, width: "20%" }}>
						<TouchableOpacity style={{ padding: 20 }}>
							<AntDesign
								name="arrowleft"
								size={35}
								color="white"
								onPress={() => navigation.navigate("Home")}
							/>
						</TouchableOpacity>
					</View>

					<View style={{ position: "absolute", zIndex: 1 }}>
						<PictureScroll
							pictures={images}
							deletePosibitity={false}
							changePosibility={ifUserAdmin}
							navigation={navigation}
							dishId={id}
						/>
					</View>

					<View style={{ width: "100%", height: 300 }}></View>

					<View
						style={{
							backgroundColor: theme.backgroundColor,
							borderTopLeftRadius: 50,
							borderTopRightRadius: 50,
							zIndex: 2,
						}}
					>
						<Text style={[styles.PostTitle, { color: theme.textColor }]}>
							{data.title}
						</Text>
						<Text style={[styles.PostText, { color: theme.textColor }]}>
							{data.recipe}
							{data.recipe}
						</Text>
						<View style={{ marginBottom: 30 }}>
							<Text
								style={[styles.IngredientsTitle, { color: theme.textColor }]}
							>
								Ингредиенты:{" "}
							</Text>
							{ingredients.map((item, index) => (
								<View key={index}>
									<Text
										style={[styles.Ingredients, { color: theme.textColor }]}
									>
										{item}
									</Text>
								</View>
							))}
						</View>
						<View style={styles.PostPropsContainer}>
							{CPFCP.map((item, index) => (
								<View style={styles.PostProps} key={index}>
									<Text
										style={[styles.PostPropsTitle, { color: theme.textColor }]}
									>
										{"КБЖУ₽"[index]}
									</Text>
									<Text
										style={[styles.PostPropsText, { color: theme.textColor }]}
									>
										{item}
									</Text>
								</View>
							))}
						</View>
						<Text style={[styles.IngredientsTitle, { color: theme.textColor }]}>
							Комментарии:{" "}
						</Text>
						{currentUser !== null ? (
							<View
								style={{
									flexDirection: "row",
									margin: 15,
									justifyContent: "space-between",
								}}
							>
								<TextInput
									placeholder="Введите комментарий           "
									autoCapitalize="sentences"
									multiline={true}
                  value={commentText}
									onContentSizeChange={(event) =>
										setCommentTextHeight(event.nativeEvent.contentSize.height)
									}
									onChangeText={(text) => setCommentText(text)}
									placeholderTextColor={theme.searchPlaceholderColor}
									style={[
										styles.CommentsInput,
										{
											borderBottomColor: theme.setAdminColor,
											color: theme.textColor,
											height: Math.max(45, commentTextHeight),
										},
									]}
								></TextInput>
								<TouchableOpacity
									style={{
										justifyContent: "flex-end",
										marginBottom: 10,
										flex: 1,
									}}
									onPress={() => {AddCommentFunc()}}
								>
									<Octicons
										name="paper-airplane"
										size={28}
										color={theme.textColor}
									/>
								</TouchableOpacity>
							</View>
						) : null}
						<View style={{ marginBottom: 15 }}>
							{comments.map((item, index) => (
								<View key={index}>
									<Comment
										item={item}
										navigation={navigation}
										currentUID={currentUser === null ? null : currentUser.uid}
										ifSAdmin={ifSAdmin}
									/>
								</View>
							))}
						</View>
					</View>
				</ScrollView>
				<TopAnimatedHeader
					navigation={navigation}
					yValue={yValue}
					title={data.title}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	PostImage: {
		width: "100%",
		height: 300,
	},
	PostText: {
		padding: 20,
		fontSize: 18,
		fontFamily: "stolzl_light",
	},
	PostPropsContainer: {
		justifyContent: "space-around",
		flexDirection: "row",
	},
	PostProps: {
		padding: 10,
		bottom: 20,
		alignItems: "center",
	},
	PostPropsText: {
		fontFamily: "stolzl_light",
		fontSize: 22,
	},
	PostPropsTitle: {
		fontFamily: "stolzl",
		fontSize: 26,
	},
	PostTitle: {
		alignSelf: "center",
		fontSize: 30,
		fontFamily: "stolzl",
		padding: 10,
	},
	IngredientsTitle: {
		fontSize: 26,
		fontFamily: "stolzl",
		padding: 20,
	},
	Ingredients: {
		fontSize: 18,
		fontFamily: "stolzl_light",
		marginStart: 20,
		marginBottom: 10,
	},
	CommentsImage: {
		height: 50,
		width: 50,
		borderRadius: 999,
		marginHorizontal: 15,
		marginTop: 4,
		alignSelf: "flex-start",
	},
	CommentsInput: {
		width: "85%",
		fontSize: 16,
		fontFamily: "stolzl",
		borderBottomWidth: 1,
	},
});
