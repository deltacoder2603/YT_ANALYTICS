
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorDashboardProps {
  error: any;
}

const ErrorDashboard = ({ error }: ErrorDashboardProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto glassmorphism border-destructive/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Unable to Load Channel Data</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              We encountered an error while fetching the channel analytics. This could be due to:
            </p>
            
            <div className="text-left bg-muted/20 rounded-lg p-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                • Channel may be private or terminated
              </div>
              <div className="text-sm text-muted-foreground">
                • Invalid channel ID or URL
              </div>
              <div className="text-sm text-muted-foreground">
                • Temporary API rate limiting
              </div>
              <div className="text-sm text-muted-foreground">
                • Network connectivity issues
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-mono">
                  {error.message || 'Unknown error occurred'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline" className="flex-1 sm:flex-none">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button asChild className="flex-1 sm:flex-none">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Search Another Channel
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorDashboard;
