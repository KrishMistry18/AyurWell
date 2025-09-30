import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Leaf, BarChart3, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: "Ayurvedic Wisdom",
      description: "Ancient healing principles combined with modern nutrition science",
    },
    {
      icon: Leaf,
      title: "Personalized Plans",
      description: "Diet charts tailored to your dosha, constitution, and health goals",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your wellness journey with detailed analytics and insights",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Evidence-based tips and community support for your wellness journey",
    },
  ];

  const benefits = [
    "Dosha-based personalized nutrition",
    "Modern nutritional analysis",
    "Progress tracking & analytics",
    "Mindful routines and habits",
    "Community guidance",
    "Holistic wellness approach",
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">
                Where Ancient Wisdom Meets Modern Nutrition
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Your Ayurvedic
              <span className="block bg-gradient-to-r from-orange-200 to-yellow-200 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
              Personalized diet charts and nutrition plans combining 5000-year-old Ayurvedic principles 
              with cutting-edge nutritional science for optimal health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button variant="hero" size="lg" asChild>
                <Link to="/diet-generator">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-orange-200/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-green-200/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Holistic Health Made Simple
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of traditional Ayurvedic wisdom and modern nutritional science
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-wellness transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-wellness rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-calm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose AyurTrack?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform bridges the gap between ancient Ayurvedic principles and modern nutritional needs, 
                providing you with personalized wellness solutions.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button variant="wellness" size="lg" asChild>
                  <Link to="/auth">Get Started Today</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 shadow-wellness">
                <CardContent className="text-center">
                  <div className="w-24 h-24 bg-gradient-wellness rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Start Your Wellness Journey
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of users who have transformed their health with our personalized approach
                  </p>
                  <Button variant="default" className="w-full" asChild>
                    <Link to="/diet-generator">Create Diet Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;