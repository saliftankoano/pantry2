"use client";
import dynamic from "next/dynamic";
import Layout from "../components/layout";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Home() {
  return (
    <Layout>
      <div className="text-center max-w-sm sm:max-w-xl mt-[-3%]">
        <h1 className="backdrop-blur-[0.5px] text-white bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          <Balancer ratio={0.6}>
            Make Magic with What's in Your Fridge✨
          </Balancer>
        </h1>
        <div className="rotate-[-4.2deg] mt-[8.5%]">
          <ReactPlayer
            url="https://res.cloudinary.com/dyv7wbyvg/video/upload/v1722847124/fridge-sensei.mp4"
            controls={false}
            volume={0}
            muted={true}
            loop={true}
            playing={true}
            width={576}
            height={350}
          />
        </div>
        <div>
          <Button color="green">Sign Up</Button>
        </div>
      </div>
    </Layout>
  );
}
