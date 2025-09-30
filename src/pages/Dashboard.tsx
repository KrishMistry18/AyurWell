import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Flame, 
  Heart, 
  Activity,
  Clock,
  CheckCircle,
  Award,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health/`)
      .then((r) => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  // Mock data for charts
  const weeklyProgress = [
    { day: "Mon", calories: 1420, water: 8, sleep: 7.5 },
    { day: "Tue", calories: 1380, water: 9, sleep: 8 },
    { day: "Wed", calories: 1450, water: 7, sleep: 6.5 },
    { day: "Thu", calories: 1320, water: 10, sleep: 8.5 },
    { day: "Fri", calories: 1410, water: 8, sleep: 7 },
    { day: "Sat", calories: 1500, water: 9, sleep: 8 },
    { day: "Sun", calories: 1380, water: 8, sleep: 7.5 },
  ];

  const doshaBalance = [
    { name: 'Vata', value: 35, color: '#8B5CF6' },
    { name: 'Pitta', value: 45, color: '#F59E0B' },
    { name: 'Kapha', value: 20, color: '#10B981' },
  ];

  const monthlyTrends = [
    { month: "Jan", weight: 70, energy: 7 },
    { month: "Feb", weight: 69, energy: 7.5 },
    { month: "Mar", weight: 68, energy: 8 },
    { month: "Apr", weight: 67, energy: 8.2 },
    { month: "May", weight: 66, energy: 8.5 },
    { month: "Jun", weight: 65, energy: 9 },
  ];

  const stats = [
    {
      title: "Current Streak",
      value: "12 days",
      icon: Flame,
      color: "text-orange-600",
      change: "+3 from last week"
    },
    {
      title: "Weight Progress",
      value: "5kg lost",
      icon: TrendingUp,
      color: "text-green-600",
      change: "Goal: 10kg"
    },
    {
      title: "Energy Level",
      value: "9/10",
      icon: Zap,
      color: "text-yellow-600",
      change: "+2.5 this month"
    },
    {
      title: "Sleep Quality",
      value: "7.8 hrs",
      icon: Clock,
      color: "text-blue-600",
      change: "Average this week"
    },
  ];

  const recentPlans = [
    {
      name: "Vata-Balancing Plan",
      date: "June 15, 2024",
      status: "Active",
      adherence: 85
    },
    {
      name: "Detox Protocol",
      date: "May 28, 2024",
      status: "Completed",
      adherence: 92
    },
    {
      name: "Weight Management",
      date: "May 10, 2024",
      status: "Completed",
      adherence: 78
    },
  ];

  const achievements = [
    { title: "7-Day Streak", earned: true },
    { title: "Perfect Week", earned: true },
    { title: "Early Bird", earned: false },
    { title: "Hydration Hero", earned: true },
    { title: "Mindful Eater", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {isAuthenticated ? `Welcome back, ${user?.name || user?.username}!` : 'Welcome back, Sarah!'} 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Here's your wellness journey overview
                {apiOk !== null && (
                  <span className={`ml-2 text-sm ${apiOk ? "text-green-600" : "text-red-600"}`}>
                    API {apiOk ? "online" : "offline"}
                  </span>
                )}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button variant="wellness" asChild>
                <Link to="/diet-generator">Generate New Plan</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-wellness transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-wellness rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dosha Balance */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Current Dosha Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={doshaBalance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {doshaBalance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              6-Month Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Weight (kg)"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name="Energy Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Plans */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Saved Diet Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPlans.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-calm rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">{plan.date}</p>
                      <div className="flex items-center mt-2">
                        <Progress value={plan.adherence} className="w-20 mr-2" />
                        <span className="text-xs text-muted-foreground">{plan.adherence}%</span>
                      </div>
                    </div>
                    <Badge variant={plan.status === "Active" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg text-center transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-gradient-wellness text-white shadow-wellness' 
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-2">
                      {achievement.earned ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <Target className="w-8 h-8" />
                      )}
                    </div>
                    <p className="text-sm font-medium">{achievement.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;