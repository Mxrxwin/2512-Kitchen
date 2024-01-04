import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	getAuth,
	updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, updateDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from "../firebase.config";
import * as imgPeacker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';

const authObj = FIREBASE_AUTH;

export async function SignIn(email, password, setLoading) {
	setLoading(true);
	try {
		const responce = await signInWithEmailAndPassword(authObj, email, password);
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
			authObj,
			email,
			password
		);
		SetUserToDB(responce);
	} catch (err) {
		console.log(err);
		alert("Sign up failed " + err.message);
	} finally {
		setLoading(false);
	}
}

async function SetUserToDB(data) {
	const {uid, email, photoURL, metadata, displayName} = data.user;
	const createdAt = metadata.createdAt;
	console.log(email, photoURL, metadata, displayName);
	try {
		const docRef = await setDoc(doc(collection(FIREBASE_DB, "Users"), uid), {
			uid,
			email,
			photoURL,
			createdAt,
			displayName,
		  });
		console.log(docRef);
	} catch (error) {
		console.log(error);
	}
}

export async function CheckUserAdmin(user, setFunc) {
	if (user === null) {
		return;
	} 
	let userId = user.uid;
	if (userId === undefined) {
		userId = user;
	}
	const docRef = doc(FIREBASE_DB, "Users", userId);
	const docSnap = await getDoc(docRef);
	setFunc(docSnap.data().isAdmin === undefined ? false : docSnap.data().isAdmin);
}

export async function CheckUserSAdmin(user, setFunc) {
	if (user === null) {
		return;
	}
	const userId = user.uid;
	const docRef = doc(FIREBASE_DB, "Users", userId);
	const docSnap = await getDoc(docRef);
	if (docSnap.data() !== undefined && docSnap.data().isSAdmin === true) {
		setFunc(true);
		return;
	}
	setFunc(false);
}

export async function listAllUsers(setItems) {
	onSnapshot(collection(FIREBASE_DB, "Users"), (snapshot) => {
		snapshot.docChanges().forEach((change) => {
		  if (change.type === "added") {
			  const data = change.doc.data();
			  if (data.isAdmin) {
				setItems((prevItems) => [data, ...prevItems]);
				return;
			  }
			  setItems((prevItems) => [...prevItems, data]);
		  } 
		});
	  });
};

export async function GetUserByUID(uid) {
	const collectionRef = collection(FIREBASE_DB, "Users");
	try {
		const docRef = await getDocs(query(collectionRef, where("uid", "==", uid)));
		const data = docRef.docs.map((doc) => doc.data());
		return data;
	} catch (error) {
		console.log(error);
	}
}

export async function SetAdmin(uid, prop) {
	const collectionRef = collection(FIREBASE_DB, "Users");
	try {
		const docRef = await getDocs(query(collectionRef, where("uid", "==", uid)));
		docRef.forEach(async (doc) => {
			await updateDoc(doc.ref, {
				isAdmin: prop
			});
		})
	} catch (error) {
		console.log(error);
	}
}

export async function ChangeName(navigation, userName, userPhoto, userPreview) {
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
		photoURL: userPhoto,
		preview: userPreview
	};
	updateProfile(auth.currentUser, update)
	.then(() => {
		navigation.navigate("Personal");
	})
	.catch((error) => {
		console.log(error);
	});
	const collectionRef = collection(FIREBASE_DB, "Users");
	try {
		const docRef = await getDocs(query(collectionRef, where("uid", "==", auth.currentUser.uid)));
		docRef.forEach(async (doc) => {
			await updateDoc(doc.ref, update);
		})
	} catch (error) {
		console.log(error);
	}
}

export async function PickProfileImage(setImage, setPreview) {
    let result = await imgPeacker.launchImageLibraryAsync({
     mediaTypes: imgPeacker.MediaTypeOptions.Images,
     allowsEditing: true,
     aspect: [1,1],
     quality: 1
    })

    if (!result.canceled) {
	const manipResult = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], {
		compress: 0.4, 
		format: ImageManipulator.SaveFormat.JPEG,
	});
	const manipResultPreview = await ImageManipulator.manipulateAsync(result.assets[0].uri, 
		[{ resize: { width: 400}}], 
	{
		compress: 0.5, 
		format: ImageManipulator.SaveFormat.JPEG,
	});
    const createdAt = new Date().getTime();
     await UploadImage(setImage, manipResult.uri, createdAt, "")
     await UploadImage(setPreview, manipResultPreview.uri, createdAt, "preview")
    }
 }

 async function UploadImage(setImage, uri, createdAt, additionalFolder) {
	const auth = getAuth()
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(FIREBASE_STORAGE, "UserPhotos/" + auth.currentUser.uid + "/" + createdAt + additionalFolder)
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
	const storageRef = ref(FIREBASE_STORAGE, "UserPhotos/" + auth.currentUser.uid + "/" + createdAt + "")
	const storagePreviewRef = ref(FIREBASE_STORAGE, "UserPhotos/" + auth.currentUser.uid + "/" + createdAt + "preview")
	deleteObject(storageRef)
	.catch((error) => {
		console.log(error);
	});
	deleteObject(storagePreviewRef)
	.catch((error) => {
		console.log(error);
	});
  }
