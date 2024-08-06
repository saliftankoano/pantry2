"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import Layout from "../components/layout";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import Hotjar from "@hotjar/browser";

const siteId = 5085010;
const hotjarVersion = 6;
export default function LandingPage() {
  useEffect(() => {
    // Ensure Hotjar is only initialized in the browser
    Hotjar.init(siteId, hotjarVersion);
  }, []);
  return (
    <>
      <Head>
        <title>Food Sensei</title>
        <meta name="description" content="Food sensei" />
      </Head>
      <Layout>
        <div className="mt-4 xl:w-[50%] md:w-[75%] sm:w-[85%] w-screen">
          <h1 className="xl:text-7xl md:text-7xl sm:text-7xl text-6xl text-white font-['blacker'] text-center tracking-tight font-medium backdrop-blur-[0.5px] ">
            <Balancer ratio={0.6}>
              Turn Your Fridge into a Recipe Haven✨
            </Balancer>
          </h1>
          <div className="xl:mt-4 md:mt-4 sm:mt-4 mt-4 p-0 mb-4 flex justify-center">
            <ReactPlayer
              url="https://res.cloudinary.com/dyv7wbyvg/video/upload/v1722847124/fridge-sensei.mp4"
              controls={false}
              volume={0}
              muted={true}
              loop={true}
              playing={true}
              width="100%"
              height="100%"
            />
          </div>
          <div className="flex justify-center">
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
