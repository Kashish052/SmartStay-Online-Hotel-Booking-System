import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <section className="flex-1 flex items-center justify-center py-24 bg-gradient-to-br from-blue-50 via-background to-background">
        <div className="text-center px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h2>

          <p className="text-lg text-foreground/60 mb-2">
            We couldn't find the page you're looking for.
          </p>
          <p className="text-base text-foreground/50 mb-8">
            The page{" "}
            <code className="bg-muted px-2 py-1 rounded text-primary">
              {location.pathname}
            </code>{" "}
            doesn't exist in our hotel booking system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <a href="/">
                <Home className="w-4 h-4" />
                Back to Home
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
            >
              <a href="/stays">
                <ArrowLeft className="w-4 h-4" />
                Browse Hotels
              </a>
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-foreground/50 mb-4">Need help?</p>
            <div className="flex gap-4 justify-center text-sm">
              <a href="#" className="text-primary hover:underline">
                Contact Support
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="text-primary hover:underline">
                Help Center
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="text-primary hover:underline">
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotFound;
