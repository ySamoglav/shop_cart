import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { collection, getDocs } from "firebase/firestore";
import { dbFire, postToJSON } from "../lib/firebase"
import PostCarts from '../components/PostCarts';

export async function getStaticProps() {

  
  const cartQuery = await getDocs(collection(dbFire, "carts"));
  let carts = [];
  cartQuery.forEach((doc) => {
    carts.push(doc.data());
  })
  return {
    props: { carts },
  };
}


export default function Home(props) {
  return (
    <main>
      <div className="main-Page-Heading">
          <h2> 🛒 Shopping Lists 🛒 </h2>
      </div>
      <PostCarts carts={props.carts} />
    </main>
  );
}
