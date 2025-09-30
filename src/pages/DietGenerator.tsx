import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Clock, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DietFormData {
  age: string;
  sex: string;
  height: string;
  weight: string;
  dominantDosha: string;
  healthGoals: string;
  allergies: string;
  activityLevel: string;
  dietPreference: string;
}

const DietGenerator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<DietFormData>({
    age: "",
    sex: "",
    height: "",
    weight: "",
    dominantDosha: "",
    healthGoals: "",
    allergies: "",
    activityLevel: "",
    dietPreference: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const handleInputChange = (field: keyof DietFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDietPlan = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated diet plan
    const mockPlan = {
      planName: "Personalized Vata-Balancing Nutrition Plan",
      overview: "A carefully crafted meal plan to balance your Vata dosha while supporting weight management and digestive health.",
      meals: [
        {
          time: "Early Morning (6:00 AM)",
          meal: "Warm Lemon Water with Ginger",
          foods: ["1 glass warm water", "1/2 lemon juice", "1/4 tsp fresh ginger"],
          reasoning: "Stimulates digestive fire (Agni) and helps balance Vata's cold, dry qualities",
          calories: 15
        },
        {
          time: "Breakfast (8:00 AM)",
          meal: "Nourishing Oatmeal Bowl",
          foods: ["1 cup cooked oats", "1/2 banana", "1 tbsp ghee", "1 tsp honey", "Pinch of cardamom"],
          reasoning: "Warm, moist foods help ground Vata energy. Ghee provides healthy fats for lubrication.",
          calories: 320
        },
        {
          time: "Mid-Morning (10:30 AM)",
          meal: "Herbal Tea & Nuts",
          foods: ["1 cup chamomile tea", "5 soaked almonds", "2 dates"],
          reasoning: "Calming herbs and nourishing snacks prevent Vata aggravation between meals",
          calories: 150
        },
        {
          time: "Lunch (12:30 PM)",
          meal: "Kitchari with Vegetables",
          foods: ["1 cup kitchari (rice & lentils)", "Mixed seasonal vegetables", "1 tsp ghee", "Cumin, coriander spices"],
          reasoning: "Complete protein, easy to digest, warming spices support Agni and Vata balance",
          calories: 400
        },
        {
          time: "Evening Snack (4:00 PM)",
          meal: "Golden Milk",
          foods: ["1 cup warm almond milk", "1/2 tsp turmeric", "Pinch of black pepper", "1 tsp honey"],
          reasoning: "Anti-inflammatory and grounding, helps maintain energy without aggravating Vata",
          calories: 120
        },
        {
          time: "Dinner (7:00 PM)",
          meal: "Mung Bean Soup with Rice",
          foods: ["1 cup mung bean soup", "1/2 cup basmati rice", "Steamed vegetables", "Fresh herbs"],
          reasoning: "Light, easily digestible evening meal supports rest and doesn't overburden digestion",
          calories: 350
        }
      ],
      totalCalories: 1355,
      keyPrinciples: [
        "Eat warm, cooked foods to balance Vata's cold quality",
        "Include healthy fats like ghee for lubrication",
        "Regular meal times to ground Vata's irregular nature",
        "Use warming spices to support digestive fire",
        "Stay hydrated with warm beverages"
      ],
      supplements: [
        "Triphala powder (1/2 tsp before bed)",
        "Ashwagandha for stress management",
        "Vitamin D3 as needed"
      ]
    };
    
    setGeneratedPlan(mockPlan);
    setIsGenerating(false);
    
    toast({
      title: "Diet Plan Generated!",
      description: "Your personalized Ayurvedic nutrition plan is ready.",
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== "");
  };

  if (generatedPlan) {
    return (
      <div className="min-h-screen bg-gradient-calm py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-2 h-4 w-4" />
                Your Personalized Plan
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {generatedPlan.planName}
              </h1>
              <p className="text-lg text-muted-foreground">
                {generatedPlan.overview}
              </p>
            </div>

            {/* Plan Overview */}
            <Card className="mb-8 shadow-wellness">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  Daily Nutrition Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-calm rounded-lg">
                    <div className="text-2xl font-bold text-primary">{generatedPlan.totalCalories}</div>
                    <div className="text-sm text-muted-foreground">Total Calories</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-calm rounded-lg">
                    <div className="text-2xl font-bold text-primary">{generatedPlan.meals.length}</div>
                    <div className="text-sm text-muted-foreground">Meals & Snacks</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-calm rounded-lg">
                    <div className="text-2xl font-bold text-primary">Vata</div>
                    <div className="text-sm text-muted-foreground">Balanced Dosha</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground">Daily Meal Plan</h2>
              {generatedPlan.meals.map((meal: any, index: number) => (
                <Card key={index} className="hover:shadow-soft transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{meal.meal}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{meal.time}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Ingredients:</h4>
                        <ul className="space-y-1">
                          {meal.foods.map((food: string, idx: number) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              {food}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <Badge variant="outline" className="text-xs">
                            {meal.calories} calories
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Ayurvedic Reasoning:</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {meal.reasoning}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Key Principles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {generatedPlan.keyPrinciples.map((principle: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Supplements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {generatedPlan.supplements.map((supplement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                        <span className="text-sm text-foreground">{supplement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="wellness" onClick={() => setGeneratedPlan(null)}>
                Generate New Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Diet Generation
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Personalized Diet Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Answer a few questions about yourself, and we'll generate a customized Ayurvedic nutrition plan 
              tailored to your dosha, health goals, and dietary preferences.
            </p>
          </div>

          <Card className="shadow-wellness">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height in cm"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight in kg"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosha">Dominant Dosha</Label>
                <Select value={formData.dominantDosha} onValueChange={(value) => handleInputChange("dominantDosha", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your dominant dosha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vata">Vata (Air & Space)</SelectItem>
                    <SelectItem value="pitta">Pitta (Fire & Water)</SelectItem>
                    <SelectItem value="kapha">Kapha (Earth & Water)</SelectItem>
                    <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                    <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                    <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                    <SelectItem value="tridoshic">Tridoshic (Balanced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange("activityLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Desk job, minimal exercise)</SelectItem>
                    <SelectItem value="light">Light (Light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (Exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (Exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (Physical job + exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diet-preference">Dietary Preference</Label>
                <Select value={formData.dietPreference} onValueChange={(value) => handleInputChange("dietPreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dietary preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Ketogenic</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Health Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="Describe your health goals (e.g., weight loss, better digestion, more energy, stress reduction)"
                  value={formData.healthGoals}
                  onChange={(e) => handleInputChange("healthGoals", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies & Food Restrictions</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any food allergies, intolerances, or foods you avoid"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                variant="wellness" 
                size="lg" 
                className="w-full" 
                onClick={generateDietPlan}
                disabled={!isFormValid() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate My Diet Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DietGenerator;