import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Leaf,
  BarChart3,
  Zap,
  Target,
  Brain,
  Shield,
  TrendingUp,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const coreFeatures = [
    {
      icon: Heart,
      title: "Dosha Assessment",
      description: "Advanced constitutional analysis to determine your unique Ayurvedic profile",
      features: ["Vata, Pitta, Kapha analysis", "Personalized recommendations", "Constitutional balance tracking"]
    },
    {
      icon: Leaf,
      title: "Smart Diet Generator",
      description: "AI-powered meal planning that considers both Ayurvedic principles and modern nutrition",
      features: ["Seasonal food suggestions", "Digestive fire optimization", "Nutritional balance analysis"]
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Comprehensive tracking of your wellness journey with detailed insights",
      features: ["Health metrics monitoring", "Progress visualization", "Trend analysis"]
    }
  ];

  const engagementTools = [
    {
      icon: TrendingUp,
      title: "Wellness Streaks",
      description: "Build healthy habits with our gamified tracking system",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "Smart Reminders",
      description: "Personalized notifications for meals, medications, and activities",
      color: "text-blue-600"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and track personalized health and wellness objectives",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals on similar wellness journeys",
      color: "text-orange-600"
    }
  ];

  const uniqueAspects = [
    {
      icon: Brain,
      title: "Ancient Wisdom + Modern Science",
      description: "The perfect fusion of 5000-year-old Ayurvedic principles with cutting-edge nutritional research"
    },
    {
      icon: Shield,
      title: "Holistic Approach",
      description: "Address mind, body, and spirit for complete wellness rather than just treating symptoms"
    },
    {
      icon: Zap,
      title: "Personalization at Scale",
      description: "Each recommendation is tailored to your unique constitution, lifestyle, and health goals"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-calm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Comprehensive Wellness Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Discover AyurTrack's
              <span className="block text-primary">Unique Features</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore how we combine ancient Ayurvedic wisdom with modern technology 
              to create personalized wellness solutions that actually work.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a complete Ayurvedic wellness experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-wellness transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-wellness rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Unique */}
      <section className="py-20 bg-gradient-calm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Makes AyurTrack Unique?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're not just another diet app. Here's what sets us apart from the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {uniqueAspects.map((aspect, index) => (
              <Card key={index} className="text-center group hover:shadow-wellness transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-wellness rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <aspect.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {aspect.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {aspect.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Tools */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Engagement & Motivation Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay motivated and engaged with features designed to make your wellness journey enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementTools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <tool.icon className={`h-12 w-12 mx-auto mb-4 ${tool.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who have already started their personalized wellness journey with AyurTrack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/diet-generator">
                  Start Your Diet Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;