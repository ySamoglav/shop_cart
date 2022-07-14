import { useState } from "react";
import {
  BsFillCheckSquareFill,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
  BsFillSquareFill,
} from "react-icons/bs";
import { updateCompletion, updateQuantity } from "../lib/firebase";
export default function PostItems(props) {
  return (
    <div className="itemList">
      <>
        {props.items
          ? props.items.map((item) => (
              <PostItem
                key={item.id}
                item={item}
                room={props.room}
                deleteItem={props.deleteItem}
              />
            ))
          : null}
      </>
    </div>
  );
}

function PostItem({ item, room, deleteItem }) {
  const [complete, setComplete] = useState(item.complete);
  const [quantity, setQuantity] = useState(item.quantity);

  // Functions to change item data
  const lowerItemQuantity = () => {
    setQuantity(quantity - 1);
    updateQuantity(room, item.itemName, 1);
  };

  const upperItemQuantity = () => {
    setQuantity(quantity + 1);
    updateQuantity(room, item.itemName, 2);
  };

  const toggleComplete = () => {
    setComplete(!complete);
    updateCompletion(room, item.itemName);
  };

  return (
    <div className="itemContainer">
      <>
        {complete ? (
          <>
            <BsFillCheckSquareFill size={35} className="comp-icon" onClick={() => toggleComplete()} />
            <div className="completed">
              <h1>{item.itemName}</h1>
            </div>
          </>
        ) : (
          <>
            <BsFillSquareFill size={35} className="comp-icon" onClick={() => toggleComplete()} />
            <h1>{item.itemName}</h1>
          </>
        )}
      </>
      <div className="quantity">
        <BsFillCaretLeftFill size={35} className="quan-icon" onClick={() => lowerItemQuantity()} />
        <a>{quantity}</a>
        <BsFillCaretRightFill size={35} className="quan-icon" onClick={() => upperItemQuantity()} />
      </div>
      <button
        className="btn-red-item"
        onClick={() => deleteItem(item.itemName)}
      >
        Remove item
      </button>
    </div>
  );
}
