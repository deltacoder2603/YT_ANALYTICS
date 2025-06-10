
const API_KEY = "AIzaSyBXFooJ8EnMuOdPmLmzFQD7ebup_WMfykI";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  country?: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
  brandingSettings?: {
    channel?: {
      keywords?: string;
      defaultLanguage?: string;
    };
    image?: {
      bannerExternalUrl?: string;
    };
  };
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails: {
    duration: string;
    definition: string;
  };
  snippet: {
    categoryId: string;
    tags?: string[];
    defaultLanguage?: string;
  };
}

export interface PlaylistData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  itemCount: number;
}

export const extractChannelId = async (input: string): Promise<string> => {
  // Remove whitespace
  input = input.trim();
  
  // If it's already a channel ID (starts with UC)
  if (input.startsWith('UC') && input.length === 24) {
    return input;
  }
  
  // If it's a handle (@username)
  if (input.startsWith('@')) {
    const handle = input.substring(1);
    return await getChannelIdByHandle(handle);
  }
  
  // If it's a URL, extract the relevant part
  if (input.includes('youtube.com') || input.includes('youtu.be')) {
    const url = new URL(input);
    
    // Channel URL formats
    if (url.pathname.startsWith('/channel/')) {
      return url.pathname.split('/channel/')[1];
    }
    
    if (url.pathname.startsWith('/c/')) {
      const customUrl = url.pathname.split('/c/')[1];
      return await getChannelIdByCustomUrl(customUrl);
    }
    
    if (url.pathname.startsWith('/user/')) {
      const username = url.pathname.split('/user/')[1];
      return await getChannelIdByUsername(username);
    }
    
    if (url.pathname.startsWith('/@')) {
      const handle = url.pathname.substring(2);
      return await getChannelIdByHandle(handle);
    }
  }
  
  // Try as custom URL or username
  try {
    return await getChannelIdByCustomUrl(input);
  } catch {
    return await getChannelIdByUsername(input);
  }
};

const getChannelIdByHandle = async (handle: string): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/channels?part=id&forHandle=${handle}&key=${API_KEY}`
  );
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }
  
  return data.items[0].id;
};

const getChannelIdByCustomUrl = async (customUrl: string): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/search?part=id&type=channel&q=${customUrl}&key=${API_KEY}`
  );
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }
  
  return data.items[0].id.channelId;
};

const getChannelIdByUsername = async (username: string): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/channels?part=id&forUsername=${username}&key=${API_KEY}`
  );
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }
  
  return data.items[0].id;
};

export const getChannelData = async (channelId: string): Promise<ChannelData> => {
  const response = await fetch(
    `${BASE_URL}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch channel data');
  }
  
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }
  
  const channel = data.items[0];
  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    customUrl: channel.snippet.customUrl,
    publishedAt: channel.snippet.publishedAt,
    country: channel.snippet.country,
    thumbnails: channel.snippet.thumbnails,
    statistics: channel.statistics,
    brandingSettings: channel.brandingSettings,
  };
};

export const getChannelVideos = async (channelId: string, maxResults: number = 50): Promise<VideoData[]> => {
  // First get the uploads playlist ID
  const channelResponse = await fetch(
    `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
  );
  
  const channelData = await channelResponse.json();
  const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
  
  // Get videos from uploads playlist
  const playlistResponse = await fetch(
    `${BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${API_KEY}`
  );
  
  const playlistData = await playlistResponse.json();
  const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
  
  // Get detailed video information
  const videosResponse = await fetch(
    `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
  );
  
  const videosData = await videosResponse.json();
  
  return videosData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    thumbnails: video.snippet.thumbnails,
    statistics: video.statistics,
    contentDetails: video.contentDetails,
    snippet: {
      categoryId: video.snippet.categoryId,
      tags: video.snippet.tags,
      defaultLanguage: video.snippet.defaultLanguage,
    },
  }));
};

export const getChannelPlaylists = async (channelId: string): Promise<PlaylistData[]> => {
  const response = await fetch(
    `${BASE_URL}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${API_KEY}`
  );
  
  const data = await response.json();
  
  return data.items.map((playlist: any) => ({
    id: playlist.id,
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    publishedAt: playlist.snippet.publishedAt,
    thumbnails: playlist.snippet.thumbnails,
    itemCount: playlist.contentDetails.itemCount,
  }));
};
