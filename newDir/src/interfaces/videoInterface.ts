export interface Video {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      },
      high: {
        url: string;
      };
    };
  };
};


export interface SearchVideo {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}


export interface WatchHistoryVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishedAt: string;
  channelTitle: string;
  channelId: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    standard?: string;
    maxres?: string;
  };
}

