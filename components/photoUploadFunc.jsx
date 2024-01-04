import { addDoc, collection, doc, getDocs,onSnapshot, where, query, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../firebase.config";
import * as imgPeacker from "expo-image-picker";
import { GetUserByUID } from "./authFunctions";
import * as ImageManipulator from 'expo-image-manipulator';

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
    let items = [];
    return onSnapshot(collection(FIREBASE_DB, "Menu"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            items.push(data);
        } else if (change.type === "modified") {
            const foundItem = items.find(item => item.id === change.doc.data().id);
            const foundItemIndex = items.indexOf(foundItem);
            items[foundItemIndex] = change.doc.data();
        }
      });
      setItems(items);
    });
  };

  
  export function listenToMedia(setItems) {
   onSnapshot(collection(FIREBASE_DB, "Multimedia"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            setItems((prevItems) => {
              const updatedItems = prevItems.filter(item => item.createdAt !== data.createdAt);
              return [...updatedItems, data].sort((a, b) => a.createdAt - b.createdAt);
            });
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


  export async function PickMediaImage(setImage, setPreview, setDate) {
    let result = await imgPeacker.launchImageLibraryAsync({
     mediaTypes: imgPeacker.MediaTypeOptions.Images,
     allowsEditing: true,
     quality: 1,
     exif: true
    })
    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], {
        compress: 0.4, 
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const manipResultPreview = await ImageManipulator.manipulateAsync(result.assets[0].uri, 
        [{ resize: { width: 500}}], 
        {
          compress: 0.5, 
          format: ImageManipulator.SaveFormat.JPEG,
        });
      const date = result.assets[0].exif.DateTime;
      const size = {height: manipResult.height, width: manipResult.width}
      let unixTime = new Date().getTime();
      if (date !== undefined) {
        const dateParts = date.split(' ');
        unixTime = new Date(dateParts[0].replaceAll(':', '-') + 'T' + dateParts[1]);
        setDate(unixTime);
      }
      await UploadMediaImage(setPreview, manipResultPreview.uri, size, unixTime, "MediaPreviewPhotos/");
      await UploadMediaImage(setImage, manipResult.uri, size, unixTime, "MediaPhotos/");
    }
 }

 
  async function UploadMediaImage(setFunc, uri, size, date, folder) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(FIREBASE_STORAGE, folder + new Date(date).getTime())
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
        setFunc({...size, downloadURL});
      });
    }
  )
}

export async function SaveMediaRecond(data) {
  try {
    const docRef = await addDoc(collection(FIREBASE_DB, "Multimedia"), data);
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateMediaRecond(data) {
  try {
    const collectionRef = collection(FIREBASE_DB, "Multimedia");
    const docRef = await getDocs(query(collectionRef, where("picture", "==", data.picture)));
    docRef.forEach(async (doc) => {
        await updateDoc(doc.ref, data)  
    })
  } catch (error) {
    console.log(error);
  }
}


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

  export async function FetchComments(id, setFunc) {
    try {
      const collectionRef = collection(FIREBASE_DB, "Comments");
      const docRef = await getDocs(query(collectionRef, where("idParent", "==", id)));
      docRef.docs.map(async (doc) => {
        const user = await GetUserByUID(doc.data().UID);
        const DocData = doc.data();
        const CommData = Object.assign({}, DocData, { "previewURL": user[0].preview });
        setFunc((prevFiles) => [...prevFiles, CommData].sort((a,b) => b.createdAt - a.createdAt)) 
    });
    } catch (e) {
      console.log(e);
      return;
    }
  }

  export async function AddComment(UID, idParent, text) {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "Comments"), {
        UID, 
        idParent, 
        text,
        "createdAt": Date.now()
      })
    } catch (e) {
      console.log(e);
      return;
    }
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
      const commentsRef = collection(FIREBASE_DB, "Comments");
      const docCommentsRef = await getDocs(query(commentsRef, where("idParent", "==", id)));
      docCommentsRef.forEach((doc) => {
        deleteDoc(doc.ref);
      });
  };

  export async function PickImage(setImage) {
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
     await UploadImage(setImage, manipResult.uri)
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

  

  