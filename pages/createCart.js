import { dbFire } from "../lib/firebase";
import { useEffect, useState, useCallback, useContext } from "react";
import { UserContext } from "../lib/context";
import Link from "next/link";
import { debounce } from "lodash";
import {
  getDocs,
  query,
  where,
  collection,
  addDoc,
} from "firebase/firestore";

export default function createCart() {
  const user = useContext(UserContext);
  return <main>{user ? <UserCanCreate /> : <UserCannotCreate />}</main>;
}

function UserCanCreate() {
  const [nameValue, setNameValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(false);

  const user = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(dbFire, "carts"), {
      cartName: nameValue,
      ownerID: user.uid,
      password: passValue,
    });
    
    setCreatedRoom(true);
  };

  const onChangeName = (e) => {
    // Force input value typed in form to match correct format
    const val = e.target.value;
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    setCreatedRoom(false);
    // Only set input value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setNameValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setNameValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkRoomName(nameValue);
  }, [nameValue]);

  const checkRoomName = useCallback(
    debounce(async (roomName) => {
      if (roomName.length >= 3) {
        const cartRef = collection(dbFire, "carts");
        const q = query(cartRef, where("cartName", "==", roomName));
        const querySnapshot = await getDocs(q);

        setIsValid(true);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          if (doc.data()) {
            setIsValid(false);
          }
        });

        setLoading(false);
      }
    }, 500),
    []
  );
  return (
    <div className="createForm">
      <form onSubmit={onSubmit}>
        <a>Room name:</a>
        <input
          name="roomName"
          value={nameValue}
          placeholder="insert room name"
          onChange={onChangeName}
        ></input>
        <RoomMessage roomName={nameValue} isValid={isValid} loading={loading} />
        <a>Password:</a>
        <input
          name="password"
          value={passValue}
          placeholder="insert password"
          onChange={(e) => setPassValue(e.target.value)}
        ></input>
          <button type="submit" className="btn-green" disabled={!isValid}>
            Confirm
          </button>
        <RouteMessage isValid={isValid} loading={loading} createdRoom={createdRoom} nameValue = {nameValue} />
      </form>
    </div>
  );
}
function UserCannotCreate() {
  return (
    <main>
      <h1>You are not logged in</h1>
      <Link href="/enter">
        <button>Go to authentication</button>
      </Link>
    </main>
  );
}

function RoomMessage({ roomName, isValid, loading }) {
  if (loading) {
    return <p></p>;
  } else if (isValid) {
    return <p className="text-success">{roomName} is available!</p>;
  } else if (roomName && !isValid) {
    return <p className="text-danger">That room is taken!</p>;
  } else {
    return <p></p>;
  }
}
function RouteMessage({ createdRoom, isValid, loading, nameValue }) {
    if (loading) {
      return <p></p>;
    } else if (createdRoom && isValid) {
      return <Link href={`/${nameValue}`}>
          <button>
              Go to created room
          </button>
      </Link>;
    } else {
      return <p></p>;
    }
  }
