import Link from "next/link";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Message from "../components/Message";
import { db } from "../utils/firebase";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timeStamp", "desc"));
    const onSubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return onSubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="my-12 text-lg font-medium mx-auto rounded-lg max-w-5xl">
      <h2 className="text-2xl">See what other people are saying</h2>
      {allPosts.map((post) => (
        <Message {...post} key={post.id}>
          <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
            <button className="text-sm font-normal">
              {post.comments?.length > 0 ? post.comments?.length : 0} comments
            </button>
          </Link>
        </Message>
      ))}
    </div>
  );
}
