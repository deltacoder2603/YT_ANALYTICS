
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Video, Eye, Calendar, MapPin, Globe } from 'lucide-react';
import { ChannelData } from '@/services/youtube-api';

interface ChannelOverviewProps {
  channel: ChannelData;
}

const ChannelOverview = ({ channel }: ChannelOverviewProps) => {
  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const getChannelAge = (publishedAt: string) => {
    const created = new Date(publishedAt);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    const months = now.getMonth() - created.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Channel Header */}
      <Card className="glassmorphism border-primary/20 overflow-hidden">
        <div 
          className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative"
          style={{
            backgroundImage: channel.brandingSettings?.image?.bannerExternalUrl 
              ? `url(${channel.brandingSettings.image.bannerExternalUrl})` 
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img
                src={channel.thumbnails.high.url}
                alt={channel.title}
                className="w-24 h-24 rounded-full border-4 border-background shadow-lg"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{channel.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {channel.customUrl && (
                    <Badge variant="secondary" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {channel.customUrl}
                    </Badge>
                  )}
                  {channel.country && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {channel.country}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {getChannelAge(channel.publishedAt)} old
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {channel.description.length > 200 
                    ? channel.description.substring(0, 200) + '...' 
                    : channel.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glassmorphism border-primary/10 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(channel.statistics.subscriberCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total subscribers
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/10 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(channel.statistics.viewCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time channel views
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/10 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(channel.statistics.videoCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Published videos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChannelOverview;
