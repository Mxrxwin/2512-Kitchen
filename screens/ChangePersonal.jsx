import React, { useContext, useEffect, useState, useRef} from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ImageBackground
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import themeContext from "../components/themeContext";
import { ChangeName, PickProfileImage, DeleteAddedProfileImage, GetUserByUID } from "../components/authFunctions";
import { getAuth } from "firebase/auth";

export default function ChangePersonal({ navigation,  }) {
  const theme = useContext(themeContext);
  const leftScreenRef = useRef(true);

  const user = getAuth();
  const { displayName, photoURL } = user.currentUser;
  const UserPhoto = { photoURL, createdAt: -1};
  const [ifImageAdded, setIfImageAdded] = useState(false);
  const [newName, setNewName]= useState(displayName);
  const [newPhoto, setNewPhoto]= useState(UserPhoto);
  const [newPreviewPhoto, setNewPreviewPhoto]= useState();
  const addedImageRef = useRef();
  const defaultPictureURL = "https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/UserPhotos%2FdefaultPicture.jpg?alt=media&token=25175d34-a3cc-4e1b-b28b-db9ee06fbbdd";
  
  useEffect(() => {
    if (newPhoto.photoURL !== photoURL) {
      setIfImageAdded(true);
      addedImageRef.current = newPhoto;
    }
  }, [newPhoto])

  useEffect(() => {
    async function fetchData() {
      const userData = await GetUserByUID(user.currentUser.uid);
      setNewPreviewPhoto(userData.preview);
    }
    fetchData();
		return () => {
			exit(leftScreenRef.current);
		};
	}, []);




	function exit(leftScreen) {
		if (leftScreen && addedImageRef.current !== undefined) {
			DeleteAddedProfileImage(addedImageRef.current.createdAt);
		}
	}

  
  return (
    <View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
            style={{
              flexDirection: "row",
              justifyContent: 'space-between',
              alignItems: "flex-start",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "flex-start", margin: 14 }}
              onPress={() => navigation.navigate("Personal")}
            >
              <AntDesign name="arrowleft" size={35} color={theme.textColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "flex-start", margin: 16 }}
              onPress={() => {leftScreenRef.current = false; ChangeName(navigation, newName, newPhoto.photoURL, newPreviewPhoto.photoURL);}}
            >
              <Feather name="check" size={34} color={theme.textColor} />
            </TouchableOpacity>
        </View>

        <View style={styles.mainBlock}>
          <ImageBackground 
              resizeMode="cover"
              style={styles.image} 
              imageStyle={[styles.image, { opacity: ifImageAdded ? 1 : 0.5}]}
              source={{ uri: (newPhoto.photoURL === null ? defaultPictureURL : newPhoto.photoURL)}}
            >
              <TouchableOpacity 
                style={[styles.image, {
                  justifyContent: ifImageAdded ? 'flex-end' : 'center', 
                  alignItems: ifImageAdded ? 'flex-end' : 'center'
                }]}  
                onPress={() => PickProfileImage(setNewPhoto, setNewPreviewPhoto)} activeOpacity={0.8}>
                 <MaterialIcons name="photo-camera" size={ifImageAdded ? 70 : 100} color="#555"/>
              </TouchableOpacity>
              
            </ImageBackground>
        </View>
        <TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.searchColor,
										color: theme.textColor,
										marginTop: 20,
									},
								]}
                value={ newName }
								placeholder="Никнейм"
								autoCapitalize="none"
                maxLength={15}
								placeholderTextColor={theme.searchPlaceholderColor}
								onChangeText={(text) => setNewName(text)}
							></TextInput>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
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

  image: {
    height: 200,
    width: 200,
    borderRadius: 999,
  },
  mainBlock: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    fontFamily: 'stolzl',
    marginVertical: 5
  },
  descText: {
    fontSize: 14,
    fontFamily: 'stolzl_light',
    marginVertical: 5
  },

  extiButton: {
    flexDirection: "row",
    backgroundColor: "#83E144",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 40,
    marginBottom: 30,
    borderRadius: 10
  },
  buttonText: {
    fontFamily: "stolzl", 
    color: "white",
    fontSize: 16 
  },
});
