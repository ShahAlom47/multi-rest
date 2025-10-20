import { NextResponse } from 'next/server';
import { getYoutubeInfo } from '../../../lib/getYoutubeInfo';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    const info = await getYoutubeInfo(url);

    type YoutubeFormat = {
      format_id: string;
      format_note?: string;
      ext: string;
      filesize?: number;
      url: string;
      acodec?: string;
      vcodec?: string;
    };

    // Filter formats to include only those with audio or audio-only
    const filteredFormats = info.formats
      .filter((f: YoutubeFormat) => f.acodec !== 'none') // keep only formats with audio
      .map((f: YoutubeFormat) => ({
        format_id: f.format_id,
        format_note: f.format_note,
        ext: f.ext,
        filesize: f.filesize,
        url: f.url,
        acodec: f.acodec,
        vcodec: f.vcodec,
        hasAudio: f.acodec !== 'none',          // flag if audio present
        isVideo: f.vcodec !== 'none',           // flag if video present
      }));

    if (filteredFormats.length === 0) {
      return NextResponse.json({ error: 'No supported formats found' }, { status: 404 });
    }

    return NextResponse.json({
      title: info?.title,
      duration: info?.duration,
      thumbnail: info?.thumbnail,
      formats: filteredFormats,
      url: info?.webpage_url,
    });

  } catch (error) {
    console.error('YouTube DL Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
