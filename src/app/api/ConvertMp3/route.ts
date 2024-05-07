import ytdl from "ytdl-core";

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
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

async function* makeIterator(dataurl: string) {
  // var Buffer = require("buffer").Buffer;
  const video = ytdl(dataurl, { quality: "highestaudio" });
  // const downloadedVideo = ytdl.downloadFromInfo(video, { quality: "highestaudio" });
  for await (const chunk of video) {
    const bufferData = Buffer.from(chunk);
    yield  encoder.encode(
      bufferData.toString("base64"),
       // progress: bufferData.length,
       // isFinished: false,
     
   );
  }
  // yield encoder.encode(
  //   JSON.stringify({
  //     isFinished: true,
  //   })
  // );
}

function map(
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
export async function POST(request: Request) {
  const { dataurl } = JSON.parse(await request.text());
  if (!dataurl)
    return Response.json({ message: "Missing dataurl" }, { status: 200 });
  if (!ytdl.validateID(dataurl))
    return Response.json({ message: "Invalid dataurl" }, { status: 400 });

  const iterator = makeIterator(dataurl);

  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
