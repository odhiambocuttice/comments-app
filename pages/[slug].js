import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

import Message from "../components/Message";
import { db, auth } from "../utils/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const route = useRouter();
  const routeData = route.query;
  const [mes, setMes] = useState("");
  const [allMes, setAllMes] = useState([]);
  const [user, loading] = useAuthState(auth);

  const submitMessage = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    if (!mes) {
      toast.error("Cant submit an empty message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        mes,
        userName: user.displayName,
        timeStamp: Timestamp.now(),
      }),
    });
    setMes("");
  };

  const getComments = useCallback(
    (async) => {
      const docRef = doc(db, "posts", routeData.id);
      const onSubscribe = onSnapshot(docRef, (snapshot) => {
        setAllMes(snapshot.data().comments);
      });
      return onSubscribe;
    },
    [routeData.id]
  );

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [getComments, route.isReady]);

  return (
    <div className="my-12 text-lg font-medium mx-auto rounded-lg max-w-5xl">
      <Message {...routeData}></Message>
      <div className="flex text-sm  text-white ">
        <input
          type="text"
          value={mes}
          placeholder="comment back"
          onChange={(e) => setMes(e.target.value)}
          className="bg-slate-800 rounded-sm p-2 w-1/3"
        />
        <button
          className="w-1/5 bg-lime-600 rounded-sm"
          onClick={submitMessage}
        >
          Submit
        </button>
      </div>
      <div>
        <h2 className="font-bold my-2">Comments</h2>
        {allMes?.map((message) => (
          <div className="border-4 max-w-xs p-4 my-4" key={message.timeStamp}>
            <h1 className="text-sm font-medium">{message.userName}</h1>
            <p className="text-sm font-normal">{message.mes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
