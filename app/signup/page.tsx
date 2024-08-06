"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//FIREBASE
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { app } from "../../firebaseConfig";
import Head from "next/head";

export default function SignUpPage() {
  const [name, setName] = useState<string>("none");
  const [email, setEmail] = useState<string>("none");
  const [password, setPassword] = useState<string>("none");
  const router = useRouter(); // Initialize useRouter
  const auth = getAuth(app);
  function signUp() {
    console.log(app);
    console.log(auth);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        const currentUser = auth.currentUser;
        if (currentUser) {
          updateProfile(currentUser, {
            displayName: name,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/fridge-sensei.appspot.com/o/avatar.png?alt=media&token=46277731-252a-4986-a184-4b349f867540",
          })
            .then(() => {
              router.push("/dash");
            })
            .catch((error) => {});
        }
      })

      .catch((error) => {
        const errorMessage = error.message;
        console.log("Something went wrong while signing up:" + errorMessage);
      });
  }
  function sendPasswordResetEmail() {}
  return (
    <>
      <Head>
        <title>Sign up for Food Sensei</title>
        <meta name="description" content="Food sensei" />
      </Head>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center mt-[-10%]">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-balance text-muted-foreground">
                Cooking for smiles 😁
              </p>
            </div>
            <div className="grid gap-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  signUp();
                }}
              >
                <div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Luke Jonas"
                      required
                      onChange={(e) => {
                        e.preventDefault();
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-2 mt-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => {
                        e.preventDefault();
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-2 mt-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <Button type="submit" className="w-full mt-3">
                    Sign Up
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/signin" className="underline">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block max-h-[100vh]">
          <Image
            priority={true}
            src="https://ik.imagekit.io/engineerbf24/sensei/family.jpg?updatedAt=1722873794154"
            alt="Family eating on a porch"
            width="1920"
            height={"600"}
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}
