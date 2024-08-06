"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//Firebase
import { app } from "../../firebaseConfig";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import Head from "next/head";

export default function SignInPage() {
  const auth = getAuth(app);

  const [email, setEmail] = useState<string>("none");
  const [password, setPassword] = useState<string>("none");
  const router = useRouter();
  function signIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Sign in successfull");
        router.push("/dash");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("Something went wrong:" + errorMessage);
      });
  }
  return (
    <>
      <Head>
        <title>Sign in - Fridge Sensei</title>
        <meta name="description" content="Fridge sensei sign in page" />
      </Head>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center mt-[-10%]">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Homemade is ❤️
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
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
              <Button type="submit" className="w-full" onClick={signIn}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-muted w-full max-h-[100vh]">
          <Image
            src="https://ik.imagekit.io/engineerbf24/sensei/family.jpg?updatedAt=1722873794154"
            alt="Image"
            width="800"
            height={"600"}
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}
