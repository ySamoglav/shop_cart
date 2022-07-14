import Router from "next/router";
import {
  addItem,
  deleteAllItemsFire,
  getRoomItems,
  getRoomData,
} from "../lib/firebase";
import React, { useState } from "react";

export default function AddItems(props) {
  const [inputValueItem, setItemValue] = useState("");

  const onSubmitItem = async (e) => {
    e.preventDefault();

    // add item

    if (props.room == null) {
      setRoom(await getRoomData(props.room.roomName));
    }

    const newDocRef = await addItem(props.room, inputValueItem);
    props.setItems(await getRoomItems(props.room));
    setItemValue("");
  };

  return (
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
            className="btn-red-remList"
            onClick={async () => {
              await deleteAllItemsFire(props.room);
              Router.push("/");
            }}
          >
            Delete list
          </button>
        </div>
      </form>
    </div>
  );
}
