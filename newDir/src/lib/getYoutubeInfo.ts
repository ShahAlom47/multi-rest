import { execFile } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function getYoutubeInfo(url: string) {
  if (!url) throw new Error('URL is required');

  const exePath = path.resolve(process.cwd(), 'src', 'bin', 'yt-dlp.exe');

  try {
    const { stdout, stderr } = await execFileAsync(exePath, [
      '--dump-single-json',
      '--no-check-certificate',
      '--no-warnings',
      '--prefer-free-formats',
      '--add-header', 'referer:youtube.com',
      '--add-header', 'user-agent:googlebot',
      url,
    ]);

    if (stderr) {
      console.warn('yt-dlp stderr:', stderr);
    }

    const info = JSON.parse(stdout);
    return info;
  } catch (error) {
    console.error('yt-dlp error:', error);
    throw error;
  }
}
