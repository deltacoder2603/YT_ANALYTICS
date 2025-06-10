
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpDown, ExternalLink, Eye, Heart, MessageCircle } from 'lucide-react';
import { VideoData } from '@/services/youtube-api';

interface VideoTableProps {
  videos: VideoData[];
}

const VideoTable = ({ videos }: VideoTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'publishedAt' | 'views' | 'likes' | 'comments'>('publishedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatNumber = (num: string | undefined) => {
    if (!num) return '0';
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const parseDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedVideos = videos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'publishedAt':
          aValue = new Date(a.publishedAt).getTime();
          bValue = new Date(b.publishedAt).getTime();
          break;
        case 'views':
          aValue = parseInt(a.statistics.viewCount || '0');
          bValue = parseInt(b.statistics.viewCount || '0');
          break;
        case 'likes':
          aValue = parseInt(a.statistics.likeCount || '0');
          bValue = parseInt(b.statistics.likeCount || '0');
          break;
        case 'comments':
          aValue = parseInt(a.statistics.commentCount || '0');
          bValue = parseInt(b.statistics.commentCount || '0');
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

  return (
    <Card className="glassmorphism border-primary/10">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Video Performance Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              Detailed breakdown of all videos with performance metrics
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sort Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortField === 'publishedAt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('publishedAt')}
              className="text-xs"
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Date {sortField === 'publishedAt' && (sortDirection === 'desc' ? '↓' : '↑')}
            </Button>
            <Button
              variant={sortField === 'views' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('views')}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Views {sortField === 'views' && (sortDirection === 'desc' ? '↓' : '↑')}
            </Button>
            <Button
              variant={sortField === 'likes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('likes')}
              className="text-xs"
            >
              <Heart className="h-3 w-3 mr-1" />
              Likes {sortField === 'likes' && (sortDirection === 'desc' ? '↓' : '↑')}
            </Button>
            <Button
              variant={sortField === 'comments' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('comments')}
              className="text-xs"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Comments {sortField === 'comments' && (sortDirection === 'desc' ? '↓' : '↑')}
            </Button>
          </div>

          {/* Video List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAndSortedVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-start gap-4 p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnails.medium.url}
                    alt={video.title}
                    className="w-32 h-18 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {parseDuration(video.contentDetails.duration)}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                      {video.title}
                    </h3>
                    <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                      <a
                        href={`https://youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(video.statistics.viewCount)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(video.statistics.likeCount)} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {formatNumber(video.statistics.commentCount)} comments
                    </span>
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.contentDetails.definition.toUpperCase()}
                    </Badge>
                    {parseDuration(video.contentDetails.duration).includes(':') && 
                     parseInt(parseDuration(video.contentDetails.duration).split(':')[0]) === 0 &&
                     parseInt(parseDuration(video.contentDetails.duration).split(':')[1]) <= 1 && (
                      <Badge variant="outline" className="text-xs border-primary text-primary">
                        Short
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedVideos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No videos found matching your search.</p>
            </div>
          )}

          {filteredAndSortedVideos.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedVideos.length} of {videos.length} videos
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoTable;
