import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAxRxh3j5qRPVPy34Jfl64BTABsQt3ac4",
  authDomain: "shoplist-e48da.firebaseapp.com",
  projectId: "shoplist-e48da",
  storageBucket: "shoplist-e48da.appspot.com",
  messagingSenderId: "1050383454152",
  appId: "1:1050383454152:web:ab1e6f5221e8d1c196fafd",
  measurementId: "G-XDNDFYVTY2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const dbFire = getFirestore(app);


// helper functions to get Firestore
export async function getRoomData(roomName) {
  const q = query(
    collection(dbFire, "carts"),
    where("cartName", "==", roomName)
  );

  const querySnapshot = await getDocs(q);
  let data = null;
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data = doc;
  });
  return data;
}

export async function getRoomItems(room) {
  const docRef = doc(dbFire, "carts", room.id);
  const colRef = collection(docRef, "items");

  const querySnapshot = await getDocs(colRef);
  let data = [];
  querySnapshot.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
    const docD = document.data();
    const d = {
      complete: docD.complete,
      itemName: docD.itemName,
      quantity: docD.quantity,
      id : document.id
    }
    data.push(d);
  });
  return data;
}

export async function addItem(room, itemName) {
  const docRef = doc(dbFire, "carts", room.id);
  const colRef = collection(docRef, "items");

  const addDocRef = await addDoc(colRef, {
    itemName: itemName,
    complete: false,
    quantity: 0,
  });

  return addDocRef;
}

export async function updateQuantity(room, itemName, tag) {
  if (tag == 1) {
    const roomRef = doc(dbFire, "carts", room.id);
    const colRef = collection(roomRef, "items");
    const q2 = query(colRef, where("itemName", "==", itemName));

    const querySnapshot2 = await getDocs(q2);
    let data = null;
    querySnapshot2.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      data = document;
    });
    const docRef = data.ref;
    const updateDocData = await updateDoc(docRef, {
      quantity: increment(-1),
    });
  } else {
    const roomRef = doc(dbFire, "carts", room.id);
    const colRef = collection(roomRef, "items");
    const q2 = query(colRef, where("itemName", "==", itemName));

    const querySnapshot2 = await getDocs(q2);
    let data = null;
    querySnapshot2.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      data = document;
    });
    const docRef = data.ref;
    const updateDocData = await updateDoc(docRef, {
      quantity: increment(1),
    });
  }
}

export async function updateCompletion(room, itemName) {
  const roomRef = doc(dbFire, "carts", room.id);
  const colRef = collection(roomRef, "items");
  const q2 = query(colRef, where("itemName", "==", itemName));

  const querySnapshot2 = await getDocs(q2);
  let data = null;
  querySnapshot2.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
    data = document;
  });
  const docRef = data.ref;
  const isComplete = data.data().complete;
  const updateDocData = await updateDoc(docRef, {
    complete: !isComplete,
  });
}

export async function deleteItemFire(room, itemName) {
  const roomRef = doc(dbFire, "carts", room.id);
  const colRef = collection(roomRef, "items");

  const q = query(colRef, where("itemName", "==", itemName));

  const querySnapshot = await getDocs(q);
  let docRef = null;
  querySnapshot.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
    docRef = document.ref;
  });
  await deleteDoc(docRef);
}

export async function deleteAllItemsFire(room) {
  const roomRef = doc(dbFire, "carts", room.id);
  const colRef = collection(roomRef, "items");

  const querySnapshot = await getDocs(colRef);

  querySnapshot.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
      deleteDoc(document.ref);
  });
  
  await deleteDoc(roomRef);
}
