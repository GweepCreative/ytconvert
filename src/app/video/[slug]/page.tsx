"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type Video = {
  success: boolean;
  onlyAudio: any[];
  video: any[];
  info: {
    title: string;
    thumbnail: string;
    channel: {
      name: string;
      avatar: string;
      subs: number;
    };
    views: number;
    likes: number;
    uploadAt: string;
  };
};
export default function VideoDownload({
  params,
}: {
  params: { slug: string };
}) {
  const [video, setVideo] = useState<Video>();
  async function GetData() {
    await axios.get(`/api/GetVideo?id=${params.slug}`).then((res) => {
      if (!res.data.success) return console.log(res.data.message);
      setVideo(res.data);
    });
  }
  useEffect(() => {
    // Fetch video data
    GetData();
  }, []);

  return !video ? (
    <div className="z-50  w-full flex items-center justify-center">
      <Skeleton className="w-full h-full rounded-full" />
    </div>
  ) : (
    <div className="z-50 text-white w-full flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-4 w-3/4">
        <div className="flex gap-x-4 flex-1 flex-col justify-center items-center">
          <h1 className="truncate font-bold text-3xl text-wrap w-full text-center">
            {video.info.title}
          </h1>
          <div className="flex justify-center items-center gap-x-4 my-4 ">
            <div className="flex gap-x-2 items-center ">
              <Avatar className="w-7 h-7">
                <AvatarImage src={video.info.channel.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-zinc-300">{video.info.channel.name}</p>
                <p className="text-zinc-300 text-xs">
                  {video.info.channel.subs} Subscriber
                </p>
              </div>
            </div>
            <div className="flex gap-x-4">
              <p className="text-xs text-zinc-300">
                {new Date(video.info.uploadAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-zinc-300">{video.info.likes} Likes</p>
            </div>
          </div>
          <div className="w-full justify-center items-center flex">
            <Image
              src={video.info.thumbnail || "/banner.png"}
              alt="banner"
              width={1920}
              height={1080}
              className=" rounded-lg"
            />
          </div>
        </div>
        <div className="w-full flex-1 bg-zinc-900/50 rounded-lg p-4">
          <Tabs defaultValue="video" className="w-full ">
            <TabsList className="w-full flex-1 bg-zinc-800 gap-x-2">
              <TabsTrigger
                translate="yes"
                className="w-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                value="video"
              >
                Video
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                value="audio"
              >
                Audio
              </TabsTrigger>
            </TabsList>
            <TabsContent value="video">
              <div className="flex w-full">
                <div className="flex w-full justify-around items-center bg-zinc-800 py-2 rounded-lg">
                  <p>1080p</p>
                  <Button>Downlaod</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="audio">
              <div className="flex flex-col gap-y-2 w-full">
                {video.onlyAudio.map((audio,index) => (
                  <div key={index} className="flex w-full justify-around items-center bg-zinc-800 py-2 rounded-lg">
                    <p className="flex gap-x-2 justify-center items-center">
                      {audio.container}{" "}
                      <Badge>{audio.mimeType.split(";")[0]}</Badge>
                    </p>

                   
                      <Button type="submit" onClick={()=>window.open(audio.url)}>Downlaod</Button>
                 
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
