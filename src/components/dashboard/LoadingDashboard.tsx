
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, BarChart3 } from 'lucide-react';

const LoadingDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Loading Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <div className="h-6 w-px bg-border" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading Animation */}
        <div className="text-center py-16">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <BarChart3 className="h-16 w-16 text-primary animate-pulse" />
              <Loader2 className="h-8 w-8 text-primary absolute -bottom-2 -right-2 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Analyzing Channel Data</h2>
          <p className="text-muted-foreground mb-8">
            Fetching comprehensive analytics and generating insights...
          </p>
          
          {/* Progress indicators */}
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Channel Information</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Video Analytics</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Performance Metrics</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Cards */}
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glassmorphism">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Cards */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glassmorphism">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingDashboard;
