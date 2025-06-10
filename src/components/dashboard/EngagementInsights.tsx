
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { Heart, MessageCircle, TrendingUp, Target, Users, Zap, Activity, ThumbsUp, Award } from 'lucide-react';
import { ChannelData, VideoData } from '@/services/youtube-api';

interface EngagementInsightsProps {
  channel: ChannelData;
  videos: VideoData[];
}

const EngagementInsights = ({ channel, videos }: EngagementInsightsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  // Enhanced engagement calculations
  const engagementData = videos.map((video, index) => {
    const views = parseInt(video.statistics.viewCount || '0');
    const likes = parseInt(video.statistics.likeCount || '0');
    const comments = parseInt(video.statistics.commentCount || '0');
    const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;
    const likeRate = views > 0 ? (likes / views) * 100 : 0;
    const commentRate = views > 0 ? (comments / views) * 100 : 0;
    const daysAgo = Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      videoIndex: index + 1,
      views,
      likes,
      comments,
      engagementRate,
      likeRate,
      commentRate,
      title: video.title.substring(0, 30) + (video.title.length > 30 ? '...' : ''),
      daysAgo,
      viewsPerDay: daysAgo > 0 ? views / daysAgo : views,
      interactionScore: (likes * 1.5 + comments * 3) / views * 1000, // Weighted interaction score
    };
  });

  // Advanced metrics calculations
  const totalViews = engagementData.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = engagementData.reduce((sum, video) => sum + video.likes, 0);
  const totalComments = engagementData.reduce((sum, video) => sum + video.comments, 0);
  const avgEngagementRate = engagementData.reduce((sum, video) => sum + video.engagementRate, 0) / engagementData.length;
  const avgLikeRate = engagementData.reduce((sum, video) => sum + video.likeRate, 0) / engagementData.length;
  const avgCommentRate = engagementData.reduce((sum, video) => sum + video.commentRate, 0) / engagementData.length;

  // Engagement trends over time
  const recentEngagement = engagementData
    .slice(-20)
    .map((video, index) => ({
      video: `Video ${index + 1}`,
      engagement: video.engagementRate,
      likes: video.likeRate,
      comments: video.commentRate,
      interactions: video.interactionScore,
    }));

  // Performance categories
  const performanceCategories = {
    viral: engagementData.filter(v => v.engagementRate > avgEngagementRate * 2).length,
    highPerforming: engagementData.filter(v => v.engagementRate > avgEngagementRate * 1.2 && v.engagementRate <= avgEngagementRate * 2).length,
    average: engagementData.filter(v => v.engagementRate >= avgEngagementRate * 0.8 && v.engagementRate <= avgEngagementRate * 1.2).length,
    belowAverage: engagementData.filter(v => v.engagementRate < avgEngagementRate * 0.8).length,
  };

  // Top performing videos by different metrics
  const topEngagementVideos = [...engagementData]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 5);

  const topInteractionVideos = [...engagementData]
    .sort((a, b) => b.interactionScore - a.interactionScore)
    .slice(0, 5);

  // Radar chart data for engagement profile
  const engagementProfile = [
    { metric: 'Like Rate', value: avgLikeRate, fullMark: Math.max(...engagementData.map(v => v.likeRate)) },
    { metric: 'Comment Rate', value: avgCommentRate, fullMark: Math.max(...engagementData.map(v => v.commentRate)) },
    { metric: 'Engagement Rate', value: avgEngagementRate, fullMark: Math.max(...engagementData.map(v => v.engagementRate)) },
    { metric: 'Consistency', value: calculateConsistency(), fullMark: 100 },
    { metric: 'Growth Rate', value: calculateGrowthRate(), fullMark: 100 },
  ];

  function calculateConsistency() {
    const rates = engagementData.map(v => v.engagementRate);
    const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
    const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / rates.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - (stdDev / mean) * 100);
  }

  function calculateGrowthRate() {
    if (engagementData.length < 10) return 0;
    const recent = engagementData.slice(0, 10);
    const older = engagementData.slice(-10);
    const recentAvg = recent.reduce((sum, v) => sum + v.engagementRate, 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + v.engagementRate, 0) / older.length;
    return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  }

  const chartConfig = {
    engagement: { label: "Engagement", color: "#ff0000" },
    likes: { label: "Likes", color: "#ff6666" },
    comments: { label: "Comments", color: "#ffaaaa" },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Engagement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            title: "Avg Engagement",
            value: `${avgEngagementRate.toFixed(2)}%`,
            subtitle: "Overall engagement rate",
            icon: TrendingUp,
            color: "text-red-400"
          },
          {
            title: "Total Likes",
            value: formatNumber(totalLikes),
            subtitle: "Across all videos",
            icon: ThumbsUp,
            color: "text-red-400"
          },
          {
            title: "Total Comments",
            value: formatNumber(totalComments),
            subtitle: "Community interactions",
            icon: MessageCircle,
            color: "text-red-400"
          },
          {
            title: "Like Rate",
            value: `${avgLikeRate.toFixed(2)}%`,
            subtitle: "Average like rate",
            icon: Heart,
            color: "text-red-400"
          },
          {
            title: "Viral Videos",
            value: performanceCategories.viral.toString(),
            subtitle: "High engagement videos",
            icon: Zap,
            color: "text-red-400"
          }
        ].map((metric, index) => (
          <Card key={index} className="glassmorphism-card border-glow hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color} group-hover:text-red-300 transition-colors`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white group-hover:text-red-300 transition-colors">
                {metric.value}
              </div>
              <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Profile Radar Chart */}
      <Card className="glassmorphism-card border-glow">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-red-400" />
            Engagement Profile Analysis
          </CardTitle>
          <p className="text-sm text-gray-400">
            Comprehensive engagement metrics breakdown
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <RadarChart data={engagementProfile}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#666', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 'dataMax']} 
                tick={{ fill: '#666', fontSize: 10 }}
                tickCount={4}
              />
              <Radar
                name="Engagement Metrics"
                dataKey="value"
                stroke="#ff0000"
                fill="#ff0000"
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ fill: '#ff0000', strokeWidth: 2, r: 4 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Enhanced Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-400" />
              Engagement Rate Evolution
            </CardTitle>
            <p className="text-sm text-gray-400">Engagement trends over recent videos</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={recentEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="video" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  fill="#ff0000"
                  fillOpacity={0.3}
                  stroke="#ff0000"
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-red-400" />
              Engagement vs Views Analysis
            </CardTitle>
            <p className="text-sm text-gray-400">Correlation between views and engagement</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ScatterChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  type="number"
                  dataKey="views"
                  name="Views"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                <YAxis 
                  type="number"
                  dataKey="engagementRate"
                  name="Engagement Rate"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Scatter
                  dataKey="engagementRate"
                  fill="#ff0000"
                  fillOpacity={0.8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-red-400" />
              Top Engagement Videos
            </CardTitle>
            <p className="text-sm text-gray-400">Videos with highest engagement rates</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEngagementVideos.map((video, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-red-500/20 hover-lift">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-white truncate">
                        {video.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 ml-9">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {formatNumber(video.views)} views
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {formatNumber(video.likes)} likes
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {formatNumber(video.comments)} comments
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-400">
                      {video.engagementRate.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-red-400" />
              Top Interaction Videos
            </CardTitle>
            <p className="text-sm text-gray-400">Videos with highest interaction scores</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topInteractionVideos.map((video, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-red-500/20 hover-lift">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-white truncate">
                        {video.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 ml-9">
                      <span>Engagement: {video.engagementRate.toFixed(2)}%</span>
                      <span>Like Rate: {video.likeRate.toFixed(2)}%</span>
                      <span>Comment Rate: {video.commentRate.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-400">
                      {video.interactionScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">
                      interaction score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngagementInsights;
