"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function VideoDownload({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="z-50 text-white w-full flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-4 w-3/4">
        <div className="flex gap-x-4 flex-1 flex-col justify-center items-center">
          <h1 className="truncate font-bold text-3xl text-wrap w-[300px]">
            VideoTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle
          </h1>
          <div className="flex justify-center items-center gap-x-4 my-4 ">
            <div className="flex gap-x-2 items-center ">
              <Avatar className="w-7 h-7">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-zinc-300">Channel Name</p>
                <p className="text-zinc-300 text-xs">4.8M Subscriber</p>
              </div>
            </div>
            <div className="flex gap-x-4">
              <p className="text-xs text-zinc-300">21 Apr 2021</p>
              <p className="text-xs text-zinc-300">21K Likes</p>
            </div>
          </div>
          <div className="w-full justify-center items-center flex">
            <Image
              src={"/banner.png"}
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
              <div className="flex w-full">
                <div className="flex w-full justify-around items-center bg-zinc-800 py-2 rounded-lg">
                  <p>MP3</p>
                  <Button>Downlaod</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
