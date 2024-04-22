import { NextRequest } from "next/server";

// File url to downloadable mp3 file url 
export async function POST(request: NextRequest) {
  const { url } = await request.json();
    // Check if the url is valid
    if (!url) return { success: false, message: "Invalid url" };
    // Convert the video to mp3
    const res = await fetch(`https://api.yt-download.org/api/button/mp3/${url}`);

}
