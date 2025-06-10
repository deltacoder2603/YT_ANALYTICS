
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Video, Clock, List, Hash } from 'lucide-react';
import { VideoData, PlaylistData } from '@/services/youtube-api';

interface ContentAnalysisProps {
  videos: VideoData[];
  playlists: PlaylistData[];
}

const ContentAnalysis = ({ videos, playlists }: ContentAnalysisProps) => {
  // Parse duration (PT format to minutes)
  const parseDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    return hours * 60 + minutes + seconds / 60;
  };

  // Content length analysis
  const durations = videos.map(video => parseDuration(video.contentDetails.duration));
  const shortVideos = durations.filter(d => d <= 1).length; // <= 1 minute (Shorts)
  const mediumVideos = durations.filter(d => d > 1 && d <= 10).length; // 1-10 minutes
  const longVideos = durations.filter(d => d > 10).length; // > 10 minutes

  const contentLengthData = [
    { name: 'Shorts (≤1 min)', value: shortVideos, color: 'hsl(var(--chart-1))' },
    { name: 'Medium (1-10 min)', value: mediumVideos, color: 'hsl(var(--chart-2))' },
    { name: 'Long (>10 min)', value: longVideos, color: 'hsl(var(--chart-3))' },
  ];

  // Upload timing analysis
  const uploadsByHour = videos.reduce((acc, video) => {
    const hour = new Date(video.publishedAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const uploadTimingData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    uploads: uploadsByHour[hour] || 0,
  }));

  // Most used tags analysis
  const allTags = videos.flatMap(video => video.snippet.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    const normalizedTag = tag.toLowerCase();
    acc[normalizedTag] = (acc[normalizedTag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Video quality analysis
  const hdVideos = videos.filter(v => v.contentDetails.definition === 'hd').length;
  const sdVideos = videos.filter(v => v.contentDetails.definition === 'sd').length;

  const qualityData = [
    { name: 'HD Quality', value: hdVideos, color: 'hsl(var(--chart-4))' },
    { name: 'SD Quality', value: sdVideos, color: 'hsl(var(--chart-5))' },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Content Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glassmorphism border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)}m
            </div>
            <p className="text-xs text-muted-foreground">
              Average video length
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shorts Content</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {((shortVideos / videos.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Short-form content ratio
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playlists</CardTitle>
            <List className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {playlists.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total playlists created
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HD Quality</CardTitle>
            <Hash className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {((hdVideos / videos.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              High definition videos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Length Distribution */}
        <Card className="glassmorphism border-primary/10">
          <CardHeader>
            <CardTitle>Content Length Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Breakdown of video lengths across your content
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentLengthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentLengthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Video Quality Distribution */}
        <Card className="glassmorphism border-primary/10">
          <CardHeader>
            <CardTitle>Video Quality Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              HD vs SD quality content breakdown
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upload Timing Pattern */}
      <Card className="glassmorphism border-primary/10">
        <CardHeader>
          <CardTitle>Upload Timing Pattern</CardTitle>
          <p className="text-sm text-muted-foreground">
            When videos are typically uploaded throughout the day
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uploadTimingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [value, 'Videos']}
              />
              <Bar
                dataKey="uploads"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Tags */}
      {topTags.length > 0 && (
        <Card className="glassmorphism border-primary/10">
          <CardHeader>
            <CardTitle>Most Used Tags</CardTitle>
            <p className="text-sm text-muted-foreground">
              Frequently used tags across all videos
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {topTags.map((tag, index) => (
                <div key={index} className="bg-muted/20 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium truncate" title={tag.tag}>
                    {tag.tag}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {tag.count} uses
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentAnalysis;
