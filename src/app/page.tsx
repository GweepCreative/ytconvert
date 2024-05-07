"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import ytdl from "ytdl-core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  async function GetVideo() {
    const isYoutube = ytdl.validateURL(url);
    if (!isYoutube) {
      return alert("Invalid Youtube URL");
    }
    router.push(`/video/${ytdl.getVideoID(url)}`);
  }
  return (
    <div className="z-50 flex flex-col gap-y-10 ">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-5xl font-bold text-center text-white">
          Youtube Video Converter
        </h1>
        <p className="text-lg text-center mt-1 text-white">
          Get started by paste URL of the video you want to convert
        </p>
      </div>
      <div>
        <Input
          className="border-zinc-800 bg-zinc-900 text-white"
          placeholder="Video URL"
          type="url"
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            GetVideo();
          }}
          className="mt-2 w-full"
        >
          Convert
        </Button>
      </div>
    </div>
  );
}
