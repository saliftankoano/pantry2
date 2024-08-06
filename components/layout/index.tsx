import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Meta from "./meta";
import { Button } from "../ui/button";
import senseiName from "../../assets/sensei.png";
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
  return (
    <>
      <Meta {...meta} />
      <div className="fixed top-0 w-full z-10 transition-all">
        <div className="flex h-16 w-full items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center space-x-3 ml-4 mt-2">
            <Image src={senseiName} alt="seisei name" width="128" height="65" />
          </Link>
          <Link
            href="/signin"
            rel="noopener noreferrer"
            // here we are using the `isolate` property to create a new stacking context: https://github.com/tailwindlabs/tailwindcss/discussions/5675#discussioncomment-1987063
            className="relative isolate overflow-hidden w-32 mr-4 py-5"
          >
            <Button className="absolute inset-px z-10 grid place-items-center bg-[#26a232] text-md">
              Login
            </Button>
          </Link>
        </div>
      </div>
      <main className="w-full bg-[url('https://ik.imagekit.io/engineerbf24/sensei/kiwi-left%20(1).png?updatedAt=1722906367419')] scale bg-cover bg-[top_20%] bg-no-repeat min-h-screen flex flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
