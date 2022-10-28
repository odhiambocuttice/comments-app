import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import Image from "next/image";

const navigation = [
  { name: "Join Now", href: "/auth/login", current: false },
  { name: "Contact Us", href: "#contacts", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="bg-slate-800 text-white  flex justify-around items-center w-full  text-center px-32 py-6">
      <Link href="/">
        <header className="font-black text-2xl cursor-pointer">Comments</header>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <a className="font-black text-lg cursor-pointer border p-2">
              Join Now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-3">
            <Link href="/post">
              <a className="font-black text-lg cursor-pointer">Post</a>
            </Link>
            <Link href="/dashboard">
              <h1 className="font-black text-sm cursor-pointer border p-2 rounded-full ">
                {user.displayName}
              </h1>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
};
