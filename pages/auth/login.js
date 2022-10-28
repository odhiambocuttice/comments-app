import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  // sign in with google
  const googleProvider = new GoogleAuthProvider();

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) route.push("/");
  }, [route, user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg flex items-center flex-col max-w-md mx-auto">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <button
          onClick={googleLogin}
          className="text-white bg-gray-700 font-medium rounded-lg flex align-middle p-4 gap-2"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
