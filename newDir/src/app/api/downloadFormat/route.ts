import axios from 'axios';

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url');

  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // পুরো ফাইলের ডাটা arraybuffer আকারে নাও
    const { data, headers } = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      maxContentLength: 100 * 1024 * 1024,
    });

    const filename = url.split('/').pop()?.split('?')[0] || 'file';

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': headers['content-type'] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to download file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
