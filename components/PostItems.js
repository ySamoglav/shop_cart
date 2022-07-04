import { useState } from "react";
import {
  BsFillCheckSquareFill,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
  BsFillSquareFill,
} from "react-icons/bs";
import { updateCompletion, updateQuantity } from "../lib/firebase";
export default function PostItems(props) {
  const { items } = props;
  return items.items
    ? items.items.map((item, idx) => (
        <PostItem
          key={idx}
          item={item}
          room={items.room}
          deleteItem={items.deleteItem}
        />
      ))
    : null;
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
    <div className="item">
      <div>
        {complete ? (
          <>
            <BsFillCheckSquareFill size={35} onClick={() => toggleComplete()} />
            <div className="completed">
              <h1>{item.itemName}</h1>
            </div>
          </>
        ) : (
          <>
            <BsFillSquareFill size={35} onClick={() => toggleComplete()} />
            <h1>{item.itemName}</h1>
          </>
        )}
        <div className="quantity">
          <BsFillCaretLeftFill size={35} onClick={() => lowerItemQuantity()} />
          <a>{quantity}</a>
          <BsFillCaretRightFill size={35} onClick={() => upperItemQuantity()} />
        </div>
      </div>
      <button className="btn-red" onClick={() => deleteItem(item.itemName)}>
        Remove item
      </button>
    </div>
  );
}
