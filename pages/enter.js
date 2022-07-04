import { auth, provider } from "../lib/firebase";
import { signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Enter(props) {
  const user = useContext(UserContext);
  return <main>{user ? <SignOutButton /> : <SignInButton /> }</main>;
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/GoogleLogo.png"} /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button className="btn-google" onClick={() => signOut(auth)}>Sign Out</button>;
}
