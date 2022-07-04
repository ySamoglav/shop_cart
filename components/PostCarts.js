import Link from "next/link";

export default function PostCarts({ carts }) {
  return carts ? carts.map((cart, idx) => <PostCart key={idx} cart={cart} />) : null;
}

function PostCart({ cart }) {
  return (
    <div className="cart">
      <Link href={`/${cart.cartName}`}>
        <h2>
          <a>{cart.cartName}</a>
        </h2>
      </Link>
    </div>
  );
}
