import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { toast } from "react-toastify";

export default function Post() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const routeData = route.query;

  //form values
  const [post, setPost] = useState({ description: "" });

  // submit post
  const submitPost = async (e) => {
    e.preventDefault();

    // run checks
    if (!post.description) {
      toast.error("Description cannot be empty", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error("Description too long", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timeStamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timeStamp: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Post Submitted", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return route.push("/");
    }
  };

  const checkUser = useCallback(
    (async) => {
      if (loading) return;
      if (!user) return route.push("/auth/login");
      if (routeData.id) {
        setPost({ description: routeData.description, id: routeData.id });
      }
    },
    [loading, route, routeData.description, routeData.id, user]
  );

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <div className="my-20 p-6 shadow-lg rounded-lg max-w-xl mx-auto items-center flex justify-center">
      <form onSubmit={submitPost}>
        <h1 className="font-bold text-2xl">
          {post.hasOwnProperty("id") ? "Edit your Post" : "Create a new Post"}
        </h1>
        <div className="py-2">
          <h3 className="font-medium text-lg py-2">Description</h3>
          <textarea
            className="bg-slate-800 rounded-md h-48 text-white text-sm p-2"
            cols="50"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
          />
          <p
            className={
              post.description.length > 300
                ? "text-red-600 font-medium text-sm"
                : "font-medium text-sm text-lime-600"
            }
          >
            {post.description.length}/300
          </p>
          <button
            className="w-full text-white font-medium bg-lime-600 rounded-full p-2 my-2"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
