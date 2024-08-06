"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "../components/layout";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Food Sensei</title>
        <meta name="description" content="Food sensei" />
      </Head>

      <Layout>
        <div className="text-center max-w-sm sm:max-w-xl mt-[-3%]">
          <h1 className=" font-['blacker'] backdrop-blur-[0.5px] text-white bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
            <Balancer ratio={0.6}>
              Turn Your Fridge into a Recipe Haven!
            </Balancer>
          </h1>
          <div className="mt-[8.5%] ml-[-5%] mb-4">
            <ReactPlayer
              url="https://res.cloudinary.com/dyv7wbyvg/video/upload/v1722847124/fridge-sensei.mp4"
              controls={false}
              volume={0}
              muted={true}
              loop={true}
              playing={true}
              width={674}
              height={390}
            />
          </div>
          <div>
            <Link href="/signup">
              <Button
                size={"lg"}
                className="bg-black text-white hover:bg-[#26a232]"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
