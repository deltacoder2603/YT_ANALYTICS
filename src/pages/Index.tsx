
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Youtube, Search, TrendingUp, BarChart3, Users, Video, Play, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import { extractChannelId } from '@/services/youtube-api';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [channelInput, setChannelInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!channelInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a YouTube channel URL, handle, or ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const channelId = await extractChannelId(channelInput);
      navigate(`/dashboard/${channelId}`);
    } catch (error) {
      toast({
        title: "Channel Not Found",
        description: "Please check the channel URL, handle, or ID and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/5 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center items-center mb-8">
            <div className="relative animate-pulse-red">
              <Youtube className="h-20 w-20 text-red-500 animate-glow" />
              <BarChart3 className="h-10 w-10 text-red-400 absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
            <span className="gradient-text">YouTube</span>
            <span className="text-white"> Analytics</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto animate-slide-up">
            Unlock the power of professional YouTube analytics with real-time insights, 
            advanced metrics, and stunning visualizations
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-scale-in">
            {[
              { icon: TrendingUp, label: "Growth Analytics", desc: "Track growth trends" },
              { icon: Users, label: "Audience Insights", desc: "Understand your viewers" },
              { icon: Video, label: "Content Analysis", desc: "Optimize your content" },
              { icon: BarChart3, label: "Performance Metrics", desc: "Measure success" },
              { icon: Eye, label: "View Analytics", desc: "Monitor viewership" },
              { icon: ThumbsUp, label: "Engagement Tracking", desc: "Boost interactions" }
            ].map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="glassmorphism-card text-sm py-3 px-5 hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-4 h-4 mr-2 text-red-400 group-hover:text-red-300 transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">{feature.label}</span>
                  <span className="text-gray-400 text-xs">{feature.desc}</span>
                </div>
              </Badge>
            ))}
          </div>
        </div>

        {/* Enhanced Input Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="glassmorphism border-glow shadow-2xl hover-lift animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl mb-3 gradient-text">Start Your Analysis</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Enter any YouTube channel URL, handle (@username), or channel ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-hover:text-red-400 transition-colors" />
                <Input
                  placeholder="https://youtube.com/@channel or @username or channel-id"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-14 h-16 text-lg bg-black/50 border-red-500/30 focus:border-red-500 text-white placeholder:text-gray-500 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !channelInput.trim()}
                className="w-full h-16 text-xl font-bold gradient-primary hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0 animate-pulse-red"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Analyzing Channel...
                  </>
                ) : (
                  <>
                    <Play className="mr-3 h-6 w-6" />
                    Analyze Channel
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Get detailed insights • No login required • 100% Free
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {[
            {
              icon: TrendingUp,
              title: "Advanced Growth Analysis",
              description: "Track subscriber growth, view velocity, and performance trends with interactive time-series charts and predictive analytics",
              metrics: ["Subscriber Growth Rate", "View Velocity", "Engagement Trends", "Growth Predictions"]
            },
            {
              icon: Video,
              title: "Deep Content Insights",
              description: "Analyze video performance, upload patterns, content strategy effectiveness, and optimal publishing times",
              metrics: ["Video Performance", "Upload Patterns", "Content Categories", "Optimal Timing"]
            },
            {
              icon: Users,
              title: "Audience Intelligence",
              description: "Understand viewer behavior, engagement patterns, and audience demographics with comprehensive analytics",
              metrics: ["Engagement Rates", "Viewer Retention", "Audience Behavior", "Demographics"]
            },
            {
              icon: BarChart3,
              title: "Performance Metrics",
              description: "Monitor key performance indicators, benchmark against competitors, and track channel health",
              metrics: ["KPI Tracking", "Competitor Analysis", "Channel Health", "Success Metrics"]
            },
            {
              icon: Eye,
              title: "View Analytics",
              description: "Detailed view analytics including view sources, retention rates, and traffic patterns analysis",
              metrics: ["View Sources", "Retention Rates", "Traffic Patterns", "Click-through Rates"]
            },
            {
              icon: MessageCircle,
              title: "Engagement Analytics",
              description: "Track likes, comments, shares, and overall engagement with sentiment analysis and interaction patterns",
              metrics: ["Like/Comment Ratios", "Sentiment Analysis", "Interaction Patterns", "Community Engagement"]
            }
          ].map((feature, index) => (
            <Card 
              key={index} 
              className="glassmorphism-card border-glow hover-lift group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-red-300 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                      <span className="text-gray-400">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Example Inputs */}
        <div className="max-w-5xl mx-auto">
          <Card className="glassmorphism-card border-glow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center text-2xl gradient-text">Supported Input Formats</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Multiple ways to analyze any YouTube channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-red-400 mb-4">Channel URLs</h4>
                  <div className="space-y-3">
                    {[
                      "youtube.com/@channelname",
                      "youtube.com/c/channelname", 
                      "youtube.com/channel/UC...",
                      "youtube.com/user/username"
                    ].map((url, i) => (
                      <div key={i} className="flex items-center text-sm font-mono bg-black/40 p-3 rounded-lg border border-red-500/20">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">{url}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-red-400 mb-4">Direct Input</h4>
                  <div className="space-y-3">
                    {[
                      "@channelhandle",
                      "channelname",
                      "UCxxxxxxxxxxxxxxxxxx",
                      "username"
                    ].map((input, i) => (
                      <div key={i} className="flex items-center text-sm font-mono bg-black/40 p-3 rounded-lg border border-red-500/20">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">{input}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
