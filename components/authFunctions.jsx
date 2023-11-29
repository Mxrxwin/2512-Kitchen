import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	getAuth,
	updateProfile,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from "../firebase.config";
import * as imgPeacker from "expo-image-picker";

const auth = FIREBASE_AUTH;

export async function SignIn(email, password, setLoading) {
	setLoading(true);
	try {
		const responce = await signInWithEmailAndPassword(auth, email, password);
	} catch (err) {
		console.log(err);
		alert("Sign in failed " + err.message);
	} finally {
		setLoading(false);
	}
}

export async function SignUp(email, password, setLoading) {
	setLoading(true);
	try {
		const responce = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		//console.log(responce);
		alert("Check email.");
	} catch (err) {
		console.log(err);
		alert("Sign up failed " + err.message);
	} finally {
		setLoading(false);
	}
}

export async function CheckUserAdmin(user, setFunc) {
	if (user === null) {
		return;
	}
	const userId = user.uid;
	const docRef = doc(FIREBASE_DB, "Users", userId);
	const docSnap = await getDoc(docRef);
	setFunc(docSnap.data() === undefined ? false : true);
}

export async function ChangeName(navigation, userName, userPhoto) {
	const auth = getAuth();
	if (userName === auth.currentUser.displayName && userPhoto === auth.currentUser.photoURL) {
		navigation.navigate("Personal");
	} 
	if (userPhoto !== auth.currentUser.photoURL && auth.currentUser.photoURL !== null) {
		const createdAt = auth.currentUser.photoURL.split('?')[0].split('%2F')[2];
		DeleteAddedProfileImage(createdAt);
	}
	const update = {
		displayName: userName,
		photoURL: userPhoto
	};
	updateProfile(auth.currentUser, update)
	.then(() => {
		navigation.navigate("Personal");
	})
	.catch((error) => {
		console.log(error);
	});
}

export async function PickProfileImage(setImage) {
    let result = await imgPeacker.launchImageLibraryAsync({
     mediaTypes: imgPeacker.MediaTypeOptions.Images,
     allowsEditing: true,
     aspect: [1,1],
     quality: 1
    })

    if (!result.canceled) {
     await UploadImage(setImage, result.assets[0].uri)
    }
 }

 async function UploadImage(setImage, uri) {
	const auth = getAuth()
    const createdAt = new Date().getTime();
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(FIREBASE_STORAGE, "UserPhotos/" + auth.currentUser.uid + "/" + createdAt )
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred) / snapshot.totalBytes * 100;
      console.log(progress);
    },
    (error) => {
       console.log("error -> " + error);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async(photoURL) => {
        setImage({photoURL, createdAt});
      });
    }
    )
  }

  export async function DeleteAddedProfileImage(createdAt) {
	const auth = getAuth()
	const storageRef = ref(FIREBASE_STORAGE, "UserPhotos/" + auth.currentUser.uid + "/" + createdAt)
	deleteObject(storageRef)
	.catch((error) => {
		console.log(error);
	});
  }
