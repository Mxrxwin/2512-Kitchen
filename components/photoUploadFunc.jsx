import { addDoc, collection, doc, getDocs,onSnapshot, where, query, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../firebase.config";
import * as imgPeacker from "expo-image-picker";
  
  export function listenToDishes(setItems) {
    onSnapshot(collection(FIREBASE_DB, "Dishes"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            setItems((prevItems) => [...prevItems, data]);
        } else if(change.type === 'removed') {
            console.log("remove");
            setItems((prevItems) => {
              return prevItems.filter(item => item.id !== change.doc.data().id);
            });
        } 
      
      });
    });
  };

    
  export function listenToMenu(setItems) {
    onSnapshot(collection(FIREBASE_DB, "Menu"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            setItems((prevItems) => [...prevItems, data]);
        } else if (change.type === "modified") {
            setItems(prevItems => {
              const updatedItems = prevItems.map(item => {
                if (item.id === change.doc.data().id) {
                  return change.doc.data();
                }
                return item; 
              });
              return updatedItems;
            });
        }
      });
    });
  };


  export async function FetchImages(id) {
    const collectionRef = collection(FIREBASE_DB, "Photos");
    const docRef = await getDocs(query(collectionRef, where("idParent", "==", id)));
    const imagesDoc = docRef.docs.map((doc) => doc.data());
    imagesDoc.sort((a, b) => a.createdAt - b.createdAt);
    return imagesDoc;
  }

  export async function FetchDish(id) {
    const collectionRef = collection(FIREBASE_DB, "Dishes");
    const docRef = await getDocs(query(collectionRef, where("id", "==", id)));
    const data = docRef.docs.map((doc) => doc.data());
  
    return data;
  }

  

  
  export async function DeleteImage(createdAt, setFunc) {
    const desertRef = ref(FIREBASE_STORAGE, "Photos/" +  createdAt);
    deleteObject(desertRef)
    .catch((error) => {
      console.log(error);
    });
    const collectionRef = collection(FIREBASE_DB, "Photos");
    const docRef = await getDocs(query(collectionRef, where("createdAt", "==", createdAt)));
    docRef.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    setFunc((prevFiles) => {
      return prevFiles.filter(item => item.createdAt !== createdAt);
    });
  };

  export async function DeleteDish(id) {
      const collectionDishRef = collection(FIREBASE_DB, "Dishes");
      const docRefDish = await getDocs(query(collectionDishRef, where("id", "==", id)));
      docRefDish.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      let createdAtDataPics = [];
      const collectionPhotosRef = collection(FIREBASE_DB, "Photos");
      const docPhotoRef = await getDocs(query(collectionPhotosRef, where("idParent", "==", id)));
      docPhotoRef.forEach((doc) => {
        createdAtDataPics.push(doc.data().createdAt);
      });
      createdAtDataPics.map(async (item) => {
        const desertRef = ref(FIREBASE_STORAGE, "Photos/" +  item);
        deleteObject(desertRef)
        .catch((error) => {
          console.log(error);
        });
        const collectionRef = collection(FIREBASE_DB, "Photos");
        const docRef = await getDocs(query(collectionRef, where("createdAt", "==", item)));
        docRef.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      })
  };


  

  export async function PickImage(setImage) {
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
    const date = new Date().getTime();
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(FIREBASE_STORAGE, "Photos/" + date)
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred) / snapshot.totalBytes * 100;
      console.log(progress);
    },
    (error) => {
       console.log("error -> " + error);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        setImage([downloadURL, date]);
      });
    }
    )
  }

  export async function DeleteAddedImage(Items) {
    Items.forEach(element => {
      console.log(element.createdAt);
      const desertRef = ref(FIREBASE_STORAGE, "Photos/" + element.createdAt);
      deleteObject(desertRef)
      .catch((error) => {
        console.log(error);
      });
    });
  }

  export async function SaveRecond(images, id) {
    images.map(async (element) => {
      try {
        const url = element.url;
        const createdAt = element.createdAt;
        const docRef = await addDoc(collection(FIREBASE_DB, "Photos"), {
          "idParent": id,
          url,
          createdAt
        })
      } catch (error) {
        console.log(error);
      }
    })

  }

  export async function UpdateishRecond(title, recipe, images, addedImages, id, Ingredients, CPFCP) {
    try {
      const previewImg = images[0].url;
      const collectionRef = collection(FIREBASE_DB, "Dishes");
      const docRef = await getDocs(query(collectionRef, where("id", "==", id)));
      docRef.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            title, 
            recipe, 
            previewImg, 
            Ingredients, 
            CPFCP
          })  
      })
      SaveRecond(addedImages, id);
    } catch (error) {
      console.log(error);
    }
  }


  export async function SaveDishRecond(title, recipe, images, id, Ingredients, CPFCP) {
    try {
      const previewImg = images[0].url;
      const docRef = await addDoc(collection(FIREBASE_DB, "Dishes"), {
        title, 
        recipe, 
        previewImg, 
        id, 
        Ingredients, 
        CPFCP
      })
      SaveRecond(images, id);
    } catch (error) {
      console.log(error);
    }
  }

  export async function SaveMenuRecond(title, dishes, dateStart, dateEnd, id) {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "Menu"), { 
        dateEnd,
        dateStart,
        dishes,
        id,
        title
      })
    } catch (error) {
      console.log(error);
    }
  }

  
  export async function UpdateMenuRecord(title, dishes, dateStart, dateEnd, id) {
    try {
      const collectionRef = collection(FIREBASE_DB, "Menu");
      const docRef = await getDocs(query(collectionRef, where("id", "==", id)));
      docRef.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            dateEnd,
            dateStart,
            dishes,
            id,
            title
          })  
      })
    } catch (error) {
      console.log(error);
    }
  }

  

  