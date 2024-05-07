import { NextRequest } from "next/server";
import ytdl from "ytdl-core";

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      console.log("iterator ", iterator);
      const { value, done } = await iterator.next();

      if (done) {
        console.log("done");
        controller.close();
      } else {
        console.log("value");
        controller.enqueue(value);
      }
    },
  });
}
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
const encoder = new TextEncoder();
async function* makeIterator() {
  yield encoder.encode("1");
  await sleep(1000);
  yield encoder.encode("2");
}

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url) return { success: false, message: "Geçersiz URL" };

  const videoInfo = await ytdl.getInfo(url);
  const stream = ytdl(url, { filter: "audioonly" });
  const aData: any[] = [];
  stream.on("data", function (data) {
    aData.push(data);
  });
  stream.on("end", function () {
    const buffer = Buffer.concat(aData);
    const title = videoInfo.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
    console.log("end", title);
  });


  //NEXTJS EXAMPLE STREAMING
  const iterator = makeIterator();
  const streams = iteratorToStream(iterator);

  return new Response(streams);
}
