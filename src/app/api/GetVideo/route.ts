// import ytdl from "ytdl-core";
// import YouTube from "yt-dlx";
import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { PassThrough } from "stream";
export async function GET(request: Request, res: Response) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({
      message: "Please provide video id",
    });
  }

  try {
    const videoInfo = await ytdl.getInfo(id);
    if (!videoInfo) {
      return Response.json({
        succsess: false,
        message: "Video not found",
      });
    }
    const formats = videoInfo.formats.filter((format) => format.hasAudio);
    const onlyAudio = formats.filter(
      (format) => format.hasAudio && !format.hasVideo
    );
    const video = formats.filter(
      (format) => format.hasAudio && format.hasVideo
    );

    if (!onlyAudio) {
      return Response.json({
        message: "No audio found",
      });
    }
    return Response.json({
      success: true,
      onlyAudio: onlyAudio,
      video: video,
      info: {
        title: videoInfo.videoDetails.title,
        thumbnail:
          videoInfo.videoDetails.thumbnails[
            videoInfo.videoDetails.thumbnails.length - 1
          ].url,
        channel: {
          name: videoInfo.videoDetails.author.name,
          avatar: videoInfo.videoDetails.author.avatar,
          subs: videoInfo.videoDetails.author.subscriber_count,
        },
        views: videoInfo.videoDetails.viewCount,
        likes: videoInfo.videoDetails.likes,
        uploadAt: videoInfo.videoDetails.uploadDate,
      },
    });
    // const stream = ytdl.downloadFromInfo(videoInfo, {
    //   format: audio,
    // });

    // const pass = new PassThrough();
    // stream.pipe(pass);
    // return new Response(pass, {
    //   headers: {
    //     "Content-Type": "audio/m4a",
    //     "Content-Disposition": `attachment; filename="${videoInfo.videoDetails.title}.m4a"`,
    //   },
    // });
  } catch (error: any) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
