import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getChannelData, getChannelVideos, getChannelPlaylists } from '@/services/youtube-api';
import ChannelOverview from '@/components/dashboard/ChannelOverview';
import PerformanceAnalytics from '@/components/dashboard/PerformanceAnalytics';
import ContentAnalysis from '@/components/dashboard/ContentAnalysis';
import EngagementInsights from '@/components/dashboard/EngagementInsights';
import VideoTable from '@/components/dashboard/VideoTable';
import LoadingDashboard from '@/components/dashboard/LoadingDashboard';
import ErrorDashboard from '@/components/dashboard/ErrorDashboard';

const Dashboard = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const {
    data: channelData,
    isLoading: channelLoading,
    error: channelError,
  } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => getChannelData(channelId!),
    enabled: !!channelId,
  });

  const {
    data: videosData,
    isLoading: videosLoading,
    error: videosError,
  } = useQuery({
    queryKey: ['videos', channelId],
    queryFn: () => getChannelVideos(channelId!, 50),
    enabled: !!channelId,
  });

  const {
    data: playlistsData,
    isLoading: playlistsLoading,
  } = useQuery({
    queryKey: ['playlists', channelId],
    queryFn: () => getChannelPlaylists(channelId!),
    enabled: !!channelId,
  });

  const isLoading = channelLoading || videosLoading || playlistsLoading;
  const hasError = channelError || videosError;

  if (isLoading) {
    return <LoadingDashboard />;
  }

  if (hasError || !channelData) {
    return <ErrorDashboard error={hasError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <img
                  src="https://www.citypng.com/public/uploads/preview/hd-red-neon-youtube-yt-logo-symbol-sign-icon-png-701751695120411uecvkkjyek.png"
                  alt={channelData.title}
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="text-xl font-semibold">{channelData.title}</h1>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://youtube.com/channel/${channelData.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Channel
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Channel Overview */}
        <ChannelOverview channel={channelData} />

        {/* Performance Analytics */}
        <PerformanceAnalytics 
          channel={channelData} 
          videos={videosData || []} 
        />

        {/* Content Analysis */}
        <ContentAnalysis 
          videos={videosData || []} 
          playlists={playlistsData || []} 
        />

        {/* Engagement Insights */}
        <EngagementInsights 
          channel={channelData} 
          videos={videosData || []} 
        />

        {/* Video Performance Table */}
        <VideoTable videos={videosData || []} />
      </div>
    </div>
  );
};

export default Dashboard;
