import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Meta from "./meta";
import { Button } from "../ui/button";
import senseiName from "../../assets/sensei.png";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebaseConfig";
export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  let token;
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (credential != null) {
          token = credential.accessToken;
        }
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
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
    <>
      <Meta {...meta} />
      <div className="fixed top-0 w-full z-10 transition-all">
        <div className="flex h-16 w-full items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center space-x-3 ml-4 mt-2">
            <Image src={senseiName} alt="seisei name" width="128" height="65" />
          </Link>
          <Link
            href="/signup"
            rel="noopener noreferrer"
            // here we are using the `isolate` property to create a new stacking context: https://github.com/tailwindlabs/tailwindcss/discussions/5675#discussioncomment-1987063
            className="relative isolate overflow-hidden w-32 mr-4 py-5"
          >
            <Button
              className="absolute inset-px z-10 grid place-items-center bg-[#26a232] text-md"
              onClick={handleSignIn}
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
      <main className="w-full bg-[url('https://ik.imagekit.io/engineerbf24/sensei/food.jpg?updatedAt=1722869292253')] bg-cover bg-[bottom_-90%] bg-no-repeat min-h-screen flex flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
