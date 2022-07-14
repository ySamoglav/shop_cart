
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import {
  getRoomData,
  getRoomItems,
  deleteItemFire
} from "../../lib/firebase";
import PostItems from "../../components/PostItems";
import CheckPass from "../../components/CheckPass";
import AddItems from "../../components/AddItems";

export async function getServerSideProps({ query }) {
  const roomName = query.cart;
  const room = await getRoomData(roomName);
  const roomData = room.data();
  const items = await getRoomItems(room);
  // Read cart

  return {
    props: { roomData, items , roomName },
  };
}
export default function Home(props) {
  // entry data
  const user = useContext(UserContext);
  const [passMatch, setMatch] = useState(false);
  const [ownerMatch, setOMatch] = useState(false);

  // shopping list data
  const [items, setItems] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!user && !props) return;
    else if (user && props) {
      let a = user.uid.trim();
      let b = props.roomData.ownerID.trim();
      if (a === b) {
        setOMatch(true);
      }
      setItems(props.items);

      async function settingRoom() {
        setRoom(await getRoomData(props.roomName));
      }

      settingRoom();
    } else if (props) {
      setItems(props.items);

      async function settingRoom() {
        setRoom(await getRoomData(props.roomName));
      }

      settingRoom();
    }
  }, [user, props]);


  async function deleteItem(name) {
    if (room == null) {
      setRoom(await getRoomData(props.roomName));
    }
    await deleteItemFire(room, name);
    setItems(await getRoomItems(room));
  }

  return (
    <main>
      {passMatch || ownerMatch ? (
        <>
          <AddItems items={items} setItems={setItems} room={room} />
          <ShowRoom items={items} room={room} deleteItem={deleteItem} />
        </>
      ) : (
        <CheckPass
          password={props.roomData.password}
          setMatch={setMatch}
          passMatch={passMatch}
        />
      )}
    </main>
  );
}

function ShowRoom({items, room, deleteItem}) {
  return <PostItems items={items} room={room} deleteItem={deleteItem} />;
}
