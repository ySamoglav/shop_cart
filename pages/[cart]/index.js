import Router from "next/router";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import {
  getRoomData,
  getRoomItems,
  addItem,
  deleteItemFire,
  deleteAllItemsFire,
} from "../../lib/firebase";
import PostItems from "../../components/PostItems";

export async function getServerSideProps({ query }) {
  const roomName = query.cart;
  const room = await getRoomData(roomName);
  const roomData = room.data();
  const items = await getRoomItems(room);
  // Read cart

  return {
    props: { roomData, items, roomName },
  };
}
export default function Home(props) {
  // innitial data
  const user = useContext(UserContext);
  const [pass, setPass] = useState("");
  const [passMatch, setMatch] = useState(false);
  const [submitted, setSubmit] = useState(false);
  const [ownerMatch, setOMatch] = useState(false);

  // shopping list data
  const [items, setItems] = useState(null);
  const [inputValueItem, setItemValue] = useState("");
  const [room, setRoom] = useState(null);

  const onSubmitPass = async (e) => {
    e.preventDefault();
    if (pass == props.roomData.password) {
      setMatch(true);
    }
    setPass("");
    setSubmit(true);
  };

  const onSubmitItem = async (e) => {
    e.preventDefault();

    // add item

    if (room == null) {
      setRoom(await getRoomData(props.roomName));
    }
    const newDocRef = await addItem(room, inputValueItem);
    setItems(await getRoomItems(room));
    setItemValue("");
  };

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
        <div>
          <div className="itemAdd">
            <form onSubmit={onSubmitItem}>
              <a>Add item:</a>
              <input
                name="item"
                value={inputValueItem}
                placeholder="itemName"
                onChange={(e) => setItemValue(e.target.value)}
              ></input>

              <div className="buttonRow">
                <button type="submit" className="btn-green">
                  ADD
                </button>

                <button
                  className="btn-red"
                  onClick={async () => {
                    await deleteAllItemsFire(room);
                    Router.push("/");
                  }}
                >
                  Delete list
                </button>
              </div>
            </form>
          </div>
          <ShowRoom items={items} room={room} deleteItem={deleteItem} />
        </div>
      ) : (
        <div className="pass">
          <form onSubmit={onSubmitPass}>
            <a>Password:</a>
            <input
              name="password"
              value={pass}
              placeholder="insert password"
              onChange={(e) => setPass(e.target.value)}
            ></input>
            <button type="submit" className="btn-green">
              Submit passoword
            </button>
            <PassMessage submitted={submitted} match={passMatch} />
          </form>
        </div>
      )}
    </main>
  );
}

function ShowRoom(items, room, deleteItem) {
  return <PostItems items={items} room={room} deleteItem={deleteItem} />;
}
function PassMessage(submitted, match) {
  if (submitted && !match) {
    return <p className="text-danger">Password incorrect</p>;
  } else {
    return <p></p>;
  }
}
