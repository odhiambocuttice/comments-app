import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import { auth, db } from "../utils/firebase";
import Message from "../components/Message";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // see of user is loggedin
  const getUserData = useCallback(
    (async) => {
      if (loading) return;
      if (!user) return route.push("/auth/login");
      const collectionRef = collection(db, "posts");
      const q = query(
        collectionRef,
        where("userId", "==", user.uid),
        orderBy("timeStamp", "desc")
      );
      const onSubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      return onSubscribe;
    },
    [loading, route, user]
  );

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getUserData();
  }, [user, loading, route, getUserData]);

  return (
    <div className="my-12 text-lg font-medium mx-auto rounded-lg max-w-5xl">
      <h1>Your Posts</h1>
      <div>
        {posts.map((post) => (
          <Message {...post} key={post.id}>
            <div className="gap-4 flex">
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-lime-500 flex justify-center items-center gap-2">
                  <AiFillEdit />
                  Edit
                </button>
              </Link>
              <button
                className="text-red-500 flex justify-center items-center gap-2"
                onClick={() => deletePost(post.id)}
              >
                <BsTrash2Fill />
                Delete
              </button>
            </div>
          </Message>
        ))}
      </div>
      <button
        onClick={() => auth.signOut()}
        className="cursor-pointer border-2 px-6 py-2 bg-slate-800 text-white rounded-full"
      >
        Log Out
      </button>
    </div>
  );
}
