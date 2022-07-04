import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import Image from "next/image";

export default function Navbar() {
  const user = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button>Home</button>
          </Link>
        </li>
        {/* user is signed-in */}
        {user ? (
          <>
            <li>
              <Link href={`/createCart`}>
                <button>Create Shopping List</button>
              </Link>
            </li>
            <li>
              <picture>
                <img src="/shopList.png" alt="logo" />
              </picture>
            </li>
            <li>{user.displayName}</li>
            <li>
              <Link href={`/enter`}>
                <button>Log out</button>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <picture>
                <img src="/shopList.png" alt="logo" />
              </picture>
            </li>
            <li>
              <Link href="/enter">
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
