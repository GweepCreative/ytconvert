"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { Suspense, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/Loading";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import ytdl from "ytdl-core";
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
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  async function GetData() {
    await axios.get(`/api/GetVideo?id=${params.slug}`).then((res) => {
      if (!res.data.success) return console.log(res.data.message);
      setVideo(res.data);
    });
  }

  async function DownloadAudio(dataurl: string) {
    // var Buffer = require("buffer").Buffer;
    setLoading(true);
    const buffer: any = [];
    try {
      fetch("/api/ConvertMp3", {
        method: "POST",
        body: JSON.stringify({ dataurl }),
        headers: {
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      })
        .then((response) => response.body)
        .then((res) => {
          const reader = res?.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader?.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    setProgress(100);

                    // let data = Buffer.concat(buffer);
                    // let blob = new Blob([data], { type: "audio/mp3" });
                    // let url = URL.createObjectURL(blob);
                    // const a = document.createElement("a");
                    // a.href = url;
                    // a.download = "audio.mp3";
                    // a.click();
                    // window.URL.revokeObjectURL(url);

                    return;
                  }
                  controller.enqueue(value);
                  push();
                });
              }
              push();
            },
          });
          const readableStream = stream
            .pipeThrough(new TextDecoderStream())
            .pipeTo(
              new WritableStream({
                write(chunk) {
                  if (!chunk || !Buffer.isBuffer(Buffer.from(chunk)))
                    return console.log("Chunk is empty");

                  buffer.push(Buffer.from(chunk,  "base64"));
                },
                close() {
                  // console.log("Stream closed");
                  // console.log("Buffers: ", buffer);
                  const data = Buffer.concat(buffer);
                  const blob = new Blob([data], { type: "audio/mp3" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = video?.info.title+".mp3";
                  a.click();
                  window.URL.revokeObjectURL(url);
                  return;
                },
              })
            );
        });
    } catch (error) {
      console.error("Dosya indirilirken bir hata oluştu: ", error);
    } finally {
    }
    setLoading(false);
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
        <div className="w-full flex-1 bg-zinc-900/50 rounded-lg p-4 flex flex-col justify-between">
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
                <div className="flex w-full justify-around items-center bg-zinc-800 p-2 rounded-lg">
                  <p>1080p</p>
                  <Button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 sm:hidden"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    <p className="hidden sm:flex">Downlaod</p>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="audio">
              <div className="flex flex-col gap-y-2 w-full">
                <div className="flex w-full justify-between items-center bg-zinc-800 p-3 rounded-lg">
                  <p className="flex gap-x-2 justify-center items-center">
                    Audio
                    <Badge>MP3</Badge>
                  </p>

                  <Button
                    disabled={loading}
                    type="submit"
                    onClick={() => DownloadAudio(params.slug)}
                    // onClick={() => window.open(audio.url)}
                  >
                    {loading ? (
                      <Loading />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 sm:hidden"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                        <p className="hidden sm:flex">Download</p>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {progress > 0 && (
            <ProgressPrimitive.Root
              className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-white/20"
              )}
            >
              <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-white transition-all"
                style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
              />
            </ProgressPrimitive.Root>
          )}
        </div>
      </div>
    </div>
  );
}
