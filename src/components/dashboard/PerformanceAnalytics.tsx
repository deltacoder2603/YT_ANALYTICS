import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Award, Calendar, Clock, Zap, Activity } from 'lucide-react';
import { ChannelData, VideoData } from '@/services/youtube-api';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface PerformanceAnalyticsProps {
  channel: ChannelData;
  videos: VideoData[];
}

const PerformanceAnalytics = ({ channel, videos }: PerformanceAnalyticsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  // Calculate enhanced analytics
  const totalViews = parseInt(channel.statistics.viewCount);
  const totalVideos = parseInt(channel.statistics.videoCount);
  const totalSubscribers = parseInt(channel.statistics.subscriberCount);
  const averageViewsPerVideo = Math.round(totalViews / totalVideos);
  
  // Enhanced video performance data
  const videoPerformanceData = videos
    .slice(0, 30)
    .map((video, index) => {
      const views = parseInt(video.statistics.viewCount || '0');
      const likes = parseInt(video.statistics.likeCount || '0');
      const comments = parseInt(video.statistics.commentCount || '0');
      const daysAgo = Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        name: `Video ${videos.length - index}`,
        title: video.title.substring(0, 20) + '...',
        views,
        likes,
        comments,
        engagement: views > 0 ? ((likes + comments) / views) * 100 : 0,
        daysAgo,
        viewsPerDay: daysAgo > 0 ? views / daysAgo : views,
      };
    })
    .reverse();

  // Upload patterns analysis
  const uploadPatterns = videos.reduce((acc, video) => {
    const date = new Date(video.publishedAt);
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    // Hour analysis
    acc.byHour[hour] = (acc.byHour[hour] || 0) + 1;
    
    // Day of week analysis
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    acc.byDay[days[dayOfWeek]] = (acc.byDay[days[dayOfWeek]] || 0) + 1;
    
    // Monthly analysis
    acc.byMonth[month] = (acc.byMonth[month] || 0) + 1;
    
    return acc;
  }, { byHour: {}, byDay: {}, byMonth: {} } as any);

  // Performance metrics calculations
  const performanceMetrics = {
    avgEngagement: videoPerformanceData.reduce((sum, video) => sum + video.engagement, 0) / videoPerformanceData.length,
    avgViewsPerDay: videoPerformanceData.reduce((sum, video) => sum + video.viewsPerDay, 0) / videoPerformanceData.length,
    consistency: calculateConsistency(videos),
    growthRate: calculateGrowthRate(videos),
    peakPerformance: Math.max(...videoPerformanceData.map(v => v.views)),
    lowPerformance: Math.min(...videoPerformanceData.map(v => v.views)),
  };

  // Helper functions
  function calculateConsistency(videos: VideoData[]) {
    if (videos.length < 2) return 0;
    const views = videos.map(v => parseInt(v.statistics.viewCount || '0'));
    const mean = views.reduce((a, b) => a + b, 0) / views.length;
    const variance = views.reduce((sum, view) => sum + Math.pow(view - mean, 2), 0) / views.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - (stdDev / mean) * 100);
  }

  function calculateGrowthRate(videos: VideoData[]) {
    if (videos.length < 10) return 0;
    const recent = videos.slice(0, 10);
    const older = videos.slice(-10);
    const recentAvg = recent.reduce((sum, v) => sum + parseInt(v.statistics.viewCount || '0'), 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + parseInt(v.statistics.viewCount || '0'), 0) / older.length;
    return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  }

  // Chart data preparations
  const hourlyData = Object.entries(uploadPatterns.byHour).map(([hour, count]) => ({
    hour: `${hour}:00`,
    uploads: count
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  const dailyData = Object.entries(uploadPatterns.byDay).map(([day, count]) => ({
    day,
    uploads: count
  }));

  console.log("dailyData:", dailyData);
  console.log("videos:", videos);

  const monthlyData = Object.entries(uploadPatterns.byMonth)
    .slice(-12)
    .map(([month, count]) => ({ month, uploads: count }));

  const COLORS = ['#ff0000', '#cc0000', '#990000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Avg Views/Video",
            value: formatNumber(averageViewsPerVideo),
            subtitle: "Per video performance",
            icon: Target,
            trend: performanceMetrics.growthRate > 0 ? "up" : "down",
            trendValue: `${Math.abs(performanceMetrics.growthRate).toFixed(1)}%`
          },
          {
            title: "Engagement Rate",
            value: `${performanceMetrics.avgEngagement.toFixed(2)}%`,
            subtitle: "Likes + comments / views",
            icon: TrendingUp,
            trend: "up",
            trendValue: "Good"
          },
          {
            title: "Upload Consistency",
            value: `${performanceMetrics.consistency.toFixed(1)}%`,
            subtitle: "Performance consistency",
            icon: Activity,
            trend: performanceMetrics.consistency > 70 ? "up" : "down",
            trendValue: performanceMetrics.consistency > 70 ? "Excellent" : "Needs Work"
          },
          {
            title: "Peak Performance",
            value: formatNumber(performanceMetrics.peakPerformance),
            subtitle: "Best performing video",
            icon: Award,
            trend: "up",
            trendValue: "All-time high"
          }
        ].map((metric, index) => (
          <Card key={index} className="glassmorphism-card border-glow hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
              <metric.icon className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white group-hover:text-red-300 transition-colors">
                {metric.value}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">{metric.subtitle}</p>
                <div className={`flex items-center text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-yellow-400'}`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  {metric.trendValue}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Video Performance Trend */}
      <Card className="glassmorphism-card border-glow">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-400" />
            Video Performance Analysis
          </CardTitle>
          <p className="text-sm text-gray-400">
            Comprehensive view and engagement metrics for recent videos
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            views: {
              label: "Views",
              color: "hsl(var(--chart-1))",
            },
            likes: {
              label: "Likes",
              color: "hsl(var(--chart-2))",
            },
            comments: {
              label: "Comments",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="aspect-auto h-[250px] w-full"
          >
            <LineChart data={videoPerformanceData}>
              <CartesianGrid vertical={false} stroke="#333" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#666"
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#666"
                tickFormatter={formatNumber}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="views"
                type="natural"
                stroke="var(--color-views)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-views)",
                }}
                activeDot={{
                  r: 6,
                  fill: "var(--color-views)",
                  stroke: "var(--color-views)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Upload Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-red-400" />
              Uploads by Hour
            </CardTitle>
            <p className="text-sm text-gray-400">
              Optimal times for content release based on historical data
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              uploads: {
                label: "Uploads",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-auto h-[250px] w-full"
            >
              <BarChart data={hourlyData}>
                <CartesianGrid vertical={false} stroke="#333" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#666"
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#666"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="uploads"
                  fill="var(--color-uploads)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-400" />
              Uploads by Day of Week
            </CardTitle>
            <p className="text-sm text-gray-400">
              Understand daily content rhythm for better planning
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              uploads: {
                label: "Uploads",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-auto h-[250px] w-full"
            >
              <PieChart data={dailyData} cx="50%" cy="50%" outerRadius={80}>
                <Pie
                  data={dailyData}
                  dataKey="uploads"
                  nameKey="day"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}
                >
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="glassmorphism-card border-glow">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-400" />
              Uploads by Month
            </CardTitle>
            <p className="text-sm text-gray-400">
              Long-term trends in content publication
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              uploads: {
                label: "Uploads",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={monthlyData}>
                <CartesianGrid vertical={false} stroke="#333" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#666"
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#666"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  type="natural"
                  dataKey="uploads"
                  stroke="var(--color-uploads)"
                  fill="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-uploads)",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "var(--color-uploads)",
                    stroke: "var(--color-uploads)",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
};

export default PerformanceAnalytics;
