"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import {
  Copy,
  RefreshCw,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
} from "lucide-react";
import { toast } from "./ui/use-toast";

type Platform = "twitter" | "facebook" | "instagram" | "linkedin" | "other";
type Tone = "professional" | "casual" | "humorous";

interface PostVariation {
  id: number;
  content: string;
}

const MAX_CHARS = {
  twitter: 280,
  facebook: 2000,
  instagram: 2200,
  linkedin: 3000,
  other: 1000,
};

const PLATFORM_ICONS = {
  twitter: <Twitter className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  other: <Globe className="h-5 w-5" />,
};

const SAMPLE_POSTS = {
  professional: {
    twitter: [
      "Excited to announce our latest product update! Check out the new features that will streamline your workflow. #ProductUpdate #Efficiency",
      "Just published our Q2 report. We've exceeded growth targets by 15%. Thanks to our amazing team and customers! #BusinessGrowth",
    ],
    facebook: [
      "We're thrilled to announce the launch of our new service designed to help businesses optimize their social media strategy. Our team of experts has developed a comprehensive approach that combines data analytics with creative content development. Learn more at the link below!",
      "Our company is proud to share that we've been recognized as a leader in innovation by Industry Magazine for the third consecutive year. This achievement reflects our commitment to developing cutting-edge solutions for our clients. Read the full article to learn about our innovative approach.",
    ],
    instagram: [
      "Proud to share our team's latest achievement! 🏆 We've been recognized for excellence in customer service for the second year running. Swipe to see our team celebrating this milestone. #BusinessAchievement #CustomerExcellence",
      "Behind every successful project is a dedicated team. Here's a glimpse of our recent strategy session where we mapped out our Q3 goals. We're committed to delivering exceptional results for our clients. #BusinessStrategy #TeamWork",
    ],
    linkedin: [
      "I'm pleased to announce that our company has formed a strategic partnership with Industry Leader Corp. This collaboration will allow us to expand our service offerings and provide even more value to our clients. We're looking forward to the innovations this partnership will bring to the market. #StrategicPartnership #BusinessGrowth",
      "Reflecting on the key takeaways from yesterday's industry conference. The discussions on emerging technologies and market trends were particularly insightful. I'd love to connect with other attendees who are implementing these innovations in their organizations. #ProfessionalDevelopment #IndustryInsights",
    ],
    other: [
      "We're excited to share our latest white paper on industry trends and future projections. This comprehensive analysis provides valuable insights for businesses looking to stay ahead of the curve. Download now to access expert perspectives and data-driven forecasts.",
      "Join us for our upcoming webinar where our panel of experts will discuss effective strategies for business growth in the current economic climate. Registration is now open - secure your spot today!",
    ],
  },
  casual: {
    twitter: [
      "Just tried the new coffee shop downtown - their lattes are amazing! ☕ Anyone else checked it out yet? #CoffeeLovers",
      "Friday vibes! What's everyone up to this weekend? I'm thinking hiking if the weather holds up 🌞 #WeekendPlans",
    ],
    facebook: [
      "Had such a great time at the beach yesterday! The weather was perfect and the kids had a blast building sandcastles. Sometimes you just need a day to unwind and enjoy the simple things. Who else is making the most of this beautiful summer weather?",
      "Just finished reading this amazing book that I can't stop thinking about! The characters were so well-developed and the plot kept me guessing until the very end. Has anyone else read it? I'd love to hear your thoughts!",
    ],
    instagram: [
      "Sunday funday! 🌞 Nothing beats a relaxing day at the park with good friends and great food. What's your favorite way to spend the weekend? #WeekendVibes #SundayFunday",
      "Kitchen experiments today! 🍳 Tried making that viral recipe everyone's been talking about. Swipe to see how it turned out (spoiler: not quite like the video 😂). #CookingAdventures #RecipeTry",
    ],
    linkedin: [
      "Just wrapped up an interesting project with a great team! It's amazing what can be accomplished when talented people collaborate. Looking forward to sharing some insights from this experience soon. #TeamWork #ProjectComplete",
      "Enjoying a coffee break while catching up on industry news. What's one article or resource that's caught your attention this week? Always looking to expand my reading list! #ProfessionalDevelopment #ContinuousLearning",
    ],
    other: [
      "Hey everyone! Just wanted to drop a quick update on what's been happening. We've been super busy working on some cool new stuff that we can't wait to share with you all. Stay tuned for the big reveal coming next week!",
      "Quick poll: What's your go-to productivity hack when working from home? Mine is the Pomodoro technique - 25 minutes of focused work followed by a 5-minute break. It's been a game-changer for me!",
    ],
  },
  humorous: {
    twitter: [
      "My coffee told me it's too hot for a relationship right now. It just wants to be cooled. ☕😂 #CoffeeJokes #MondayMood",
      "Just tried to fold a fitted sheet. In unrelated news, does anyone know a good therapist? 🛏️😅 #LaundryProblems",
    ],
    facebook: [
      "Attempted a DIY home project today based on a '10-minute easy tutorial.' Three hours, two trips to the hardware store, and one minor injury later... I now have something that vaguely resembles the picture. The tutorial should have been called '10-minute easy way to ruin your day.' Anyone else fall for these misleading tutorials? 😂",
      "My fitness app just sent me a notification asking if I'm still alive. Apparently, not moving from the couch for 48 hours straight triggers some kind of wellness check. The audacity! I was just perfecting the art of becoming one with my furniture. #LivingMyBestLife",
    ],
    instagram: [
      "When the recipe says 'lightly brown' but your cooking style is more 'charcoal art.' 🔥👨‍🍳 Chef's special: Carbonara with extra carbon! #CookingFail #BonAppetit",
      "My plants and I have a great relationship. They're dying to get away from me and I'm killing them slowly. 🌵💀 #PlantParentFail #BlackThumbClub",
    ],
    linkedin: [
      "Just had a 'productive' meeting that could have been an email. The highlight was watching everyone's creative 'I'm paying attention' faces while secretly online shopping. Who else has mastered the art of the professional nod while thinking about lunch? #MeetingRealities #WorkLifeHumor",
      "Career milestone: Successfully pretended to understand what the IT person was explaining for a full 10 minutes before finally admitting I was lost at 'Hello.' We've all been there, right? #TechChallenges #ProfessionalGrowth",
    ],
    other: [
      "Breaking news: Local person attempts to follow a healthy meal plan. Day 1 was successful. Day 2 involved eating ice cream straight from the container at midnight while questioning all life decisions. Experts call this 'completely normal behavior.' #WellnessJourney",
      "Exciting announcement: After extensive research (scrolling through social media for 3 hours), I've concluded that everyone else has their life together except me. Further studies pending after I find my other sock. #LifeResearch #AdultingFail",
    ],
  },
};

export default function SocialPostGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [tone, setTone] = useState<Tone>("professional");
  const [charLimit, setCharLimit] = useState<number>(280);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
  const [postVariations, setPostVariations] = useState<PostVariation[]>([]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handlePlatformChange = (value: string) => {
    const platformValue = value as Platform;
    setPlatform(platformValue);
    setCharLimit(MAX_CHARS[platformValue]);
  };

  const generatePost = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your post",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, we'll use sample posts
      const samplePosts = SAMPLE_POSTS[tone][platform];

      // Create variations based on the sample posts
      const variations: PostVariation[] = samplePosts.map((post, index) => ({
        id: index,
        content: post.includes(topic)
          ? post
          : post.replace(/our latest|our new|yesterday's|today/i, topic),
      }));

      setPostVariations(variations);
      setCurrentVariationIndex(0);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyToClipboard = () => {
    if (postVariations.length === 0) return;

    const content = postVariations[currentVariationIndex].content;
    navigator.clipboard.writeText(content);

    toast({
      title: "Copied to clipboard",
      description: "Your post has been copied to clipboard",
    });
  };

  const handleNextVariation = () => {
    if (postVariations.length === 0) return;
    setCurrentVariationIndex((prev) => (prev + 1) % postVariations.length);
  };

  const renderPlatformPreview = () => {
    if (postVariations.length === 0) return null;

    const content = postVariations[currentVariationIndex].content;

    return (
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {PLATFORM_ICONS[platform]}
                <CardTitle className="text-lg capitalize">{platform}</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground">
                {content.length} / {charLimit} characters
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{content}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-3 border-t">
            <Button variant="outline" size="sm" onClick={handleNextVariation}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Next Variation
            </Button>
            <Button size="sm" onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Social Media Post</CardTitle>
              <CardDescription>
                Fill in the details to generate your perfect social media post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Key Message</Label>
                <Textarea
                  id="topic"
                  placeholder="What do you want to post about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value as Tone)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="charLimit">
                    Character Limit: {charLimit}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    Max for {platform}: {MAX_CHARS[platform]}
                  </span>
                </div>
                <Slider
                  id="charLimit"
                  min={50}
                  max={MAX_CHARS[platform]}
                  step={10}
                  value={[charLimit]}
                  onValueChange={(value) => setCharLimit(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={generatePost}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Post"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Post Preview</CardTitle>
              <CardDescription>
                See how your post will look on {platform}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {postVariations.length > 0 ? (
                renderPlatformPreview()
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                  <div className="mb-4">{PLATFORM_ICONS[platform]}</div>
                  <p>
                    Fill out the form and click "Generate Post" to see your
                    content here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
