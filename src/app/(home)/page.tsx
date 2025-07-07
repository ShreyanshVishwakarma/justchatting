"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLoading, Unauthenticated, Authenticated } from "convex/react";
import Loading from '../loading';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, Lock, MessageCircle, Users, Zap, Eye, Globe, Heart, CheckCircle, ArrowRight, Fingerprint } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

interface FaqItemProps {
  question: string;
  answer: string;
}

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const RedirectToConversation = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/conversations");
  }, [router]);
  return (
    <div className="flex justify-center items-center h-64">
      <Loading message="Redirecting..."/>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-muted-foreground/20 bg-card/50 backdrop-blur-sm animate-stagger-in"
        style={{ animationDelay: `${delay}ms` }}>
    <CardHeader className="text-center pb-3">
      <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors duration-300">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ quote, author, role }: TestimonialProps) => (
  <Card className="bg-card/50 backdrop-blur-sm border-muted-foreground/20 hover:shadow-lg transition-all duration-300 overflow-hidden group animate-stagger-in">
    <CardContent className="p-6 relative">
      <div className="absolute -top-6 -left-6 text-6xl opacity-10 text-primary group-hover:opacity-20 transition-opacity duration-300">
        "
      </div>
      <p className="text-muted-foreground italic mb-4 relative z-10">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <p className="font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <Card className="bg-card/50 backdrop-blur-sm border-muted-foreground/10 overflow-hidden transition-all duration-300 hover:shadow-md">
    <CardHeader>
      <CardTitle className="text-lg flex items-center">
        <span className="text-primary mr-2">Q:</span> {question}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{answer}</p>
    </CardContent>
  </Card>
);

const AnimatedGradientText = ({ children, className = "" }: AnimatedGradientTextProps) => (
  <span className={`bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x ${className}`}>
    {children}
  </span>
);

// Typing animation component for text
const TypingAnimation = ({ text, delay = 100, className = "" }: { text: string, delay?: number, className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let currentIndex = 0;
    setIsComplete(false);
    
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
        
        if (currentIndex > text.length) {
          setIsComplete(true);
        }
      } else {
        clearInterval(interval);
      }
    }, delay);
    
    return () => clearInterval(interval);
  }, [text, delay]);
  
  return (
    <span className={className}>
      {displayText}
      <span className={`typing-cursor ${isComplete ? "opacity-0" : ""}`}></span>
    </span>
  );
};

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your messages are encrypted on the server and the server cannot decrypt them. Only you and your recipient have the keys.",
      delay: 0
    },
    {
      icon: Eye,
      title: "Local-First Experience",
      description: "Your messages are stored securely in your browser (IndexedDB) for fast access while also being encrypted on the server.",
      delay: 100
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time messaging with zero lag. Our local-first approach ensures messages appear instantly, even with slower connections.",
      delay: 200
    },
    {
      icon: Users,
      title: "Connect Globally",
      description: "Chat with people from around the world. Build meaningful connections across borders with private, secure messaging.",
      delay: 300
    },
    {
      icon: Lock,
      title: "You Own Your Data",
      description: "Only you hold the encryption keys. No one else, including us, can access your private conversations.",
      delay: 400
    },
    {
      icon: Heart,
      title: "User-Centric Design",
      description: "A beautiful, intuitive interface with dark mode support and responsive design for any device.",
      delay: 500
    }
  ];
  
  const testimonials: TestimonialProps[] = [
    {
      quote: "Just Chatting has completely transformed the way I communicate with friends. The privacy features are unmatched.",
      author: "Alex Johnson",
      role: "Software Engineer"
    },
    {
      quote: "I was looking for a secure messaging app that respects my privacy. Just Chatting exceeds all expectations.",
      author: "Samantha Lee",
      role: "Privacy Advocate"
    },
    {
      quote: "The speed and reliability of Just Chatting make it my go-to for all important conversations.",
      author: "Michael Chen",
      role: "Tech Consultant"
    }
  ];
  
  const faqs: FaqItemProps[] = [
    {
      question: "How secure is Just Chatting?",
      answer: "Just Chatting uses strong encryption to protect your messages. Messages are encrypted on the server, and only you and your recipient hold the keys needed to decrypt them. The server cannot read your messages."
    },
    {
      question: "Is Just Chatting free to use?",
      answer: "Yes! Just Chatting is completely free for personal use with all security features included."
    },
    {
      question: "How does the local-first approach work?",
      answer: "Your messages are stored in your browser using IndexedDB for immediate access and offline capability, while also being securely synced to our servers in encrypted form. This creates a seamless experience that's both fast and secure."
    },
    {
      question: "How does Just Chatting protect my privacy?",
      answer: "We encrypt your messages on the server where we can't decrypt them, store them locally in your browser for speed, and minimize the metadata we collect. Your conversations are truly private because you control the encryption keys."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      <AuthLoading>
        <div className="flex justify-center items-center h-screen">
          <Loading message="Checking authentication" />
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="relative overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-primary/30 animate-pulse-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border border-purple-500/20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full border border-primary/20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-primary/5 to-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Hero Section with enhanced animations */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>
            
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
              <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>
            
            <div className="text-center space-y-16">
              {/* Main Heading with staggered animation */}                <div className="space-y-10 animate-fade-in">
                <div className="relative">
                  <div className="absolute -top-16 -z-10 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                      Welcome to{" "}
                    </h1>
                    <div className="mt-4 relative">
                      <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg animate-pulse-slow"></div>
                      <div className="backdrop-blur-sm border border-primary/20 rounded-xl shadow-lg p-4 md:p-6">
                        <TypingAnimation 
                          text="Just Chatting" 
                          delay={150} 
                          className="block leading-tight text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent" 
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full shadow-lg"></div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full shadow-lg"></div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full shadow-lg"></div>
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full shadow-lg"></div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced message display */}
                <div className="relative bg-card/40 backdrop-blur-md border border-primary/20 rounded-xl p-6 md:p-8 max-w-3xl mx-auto shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute -top-5 left-6">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="shrink-0">
                      <div className="bg-gradient-to-br from-primary/30 to-purple-600/30 p-4 rounded-full shadow-lg shadow-primary/10">
                        <Shield className="h-8 w-8 text-primary animate-pulse-slow" />
                      </div>
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl md:text-2xl font-bold mb-3">
                        <TypingAnimation 
                          text="Secure messaging with true privacy" 
                          delay={80}
                        />
                      </h2>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary/70 rounded-full mr-2"></div>
                          <p className="text-base md:text-lg text-foreground leading-relaxed">
                            Your messages are <span className="text-highlight active relative px-1 text-primary font-semibold">encrypted on the server</span>
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500/70 rounded-full mr-2"></div>
                          <p className="text-base md:text-lg text-foreground leading-relaxed">
                            And <span className="text-highlight active relative px-1 text-primary font-semibold">stored locally</span> for instant access
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 backdrop-blur-sm bg-gradient-to-r from-primary/10 to-purple-500/10 p-3 rounded-lg border border-primary/10">
                        <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                          You own the keys. You control your data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Section */}
              <div className="relative bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-2xl border border-primary/20 max-w-md mx-auto animate-slide-up transform hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -z-10 inset-0 bg-primary/5 rounded-2xl blur-xl"></div>
                <div className="absolute -z-10 -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="space-y-5">
                  <div className="flex items-center justify-center">
                    <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 p-4 rounded-xl shadow-inner">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-md animate-pulse"></div>
                        <MessageCircle className="h-8 w-8 text-primary animate-bounce-subtle relative z-10" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x">
                    Experience Local-First Chat
                  </h2>
                  <div className="bg-gradient-to-r from-card to-background/80 p-4 rounded-xl border border-primary/10 shadow-inner">
                    <p className="text-foreground text-center text-base md:text-lg">
                      Chat instantly with messages that load from your device, while being securely backed up with encryption.
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-5 pt-2">
                    <Button className="w-full py-7 bg-gradient-to-r from-primary to-purple-600 hover:opacity-95 hover:scale-[1.02] transition-all shadow-lg hover:shadow-primary/30 text-base font-medium rounded-xl group">
                      <span>Get Started Now</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full">
                      <Globe className="h-4 w-4 text-primary/70" />
                      <span>Join users who value privacy & speed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
              <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>
          </div>

          {/* Features Section with enhanced styling */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 bg-muted/20 backdrop-blur-sm rounded-3xl my-16 border border-muted/10">
            <div className="absolute inset-x-0 top-1/2 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
              <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose <AnimatedGradientText>Just Chatting?</AnimatedGradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of messaging with our cutting-edge features designed for security, privacy, and user experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>

          {/* Showcase Section */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Seamless <AnimatedGradientText>Experience</AnimatedGradientText> Across Devices
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Chat anywhere, anytime. Just Chatting stores messages locally on each device for instant access, while securely synchronizing your encrypted conversations across all your devices.
                </p>
                <ul className="space-y-3">
                  {[
                    "Messages load instantly from local storage (IndexedDB)",
                    "Encrypted sync keeps all your devices up to date",
                    "Works offline with seamless reconnection",
                    "Native-like performance on both desktop and mobile"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-1 text-primary">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-4 flex items-center gap-2">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative h-[400px] flex items-center justify-center p-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="absolute w-full h-full bg-gradient-to-br from-primary/10 to-purple-500/20 rounded-3xl transform rotate-3 scale-95"></div>
                <div className="absolute w-full h-full bg-card rounded-3xl transform -rotate-2 scale-95 border border-primary/20 shadow-lg"></div>
                <div className="relative w-full h-full bg-card rounded-3xl overflow-hidden border border-muted shadow-xl">
                  {/* This would be a screenshot or mockup of your app */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6 animate-float">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                      <p className="text-muted-foreground">App preview would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 my-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] flex items-center justify-center p-4 animate-fade-in order-last lg:order-first" style={{ animationDelay: '300ms' }}>
                <div className="absolute w-full h-full bg-gradient-to-br from-purple-500/10 to-primary/20 rounded-3xl transform -rotate-3 scale-95"></div>
                <div className="relative w-full h-full bg-card/80 rounded-3xl overflow-hidden border border-muted shadow-xl backdrop-blur-sm flex items-center justify-center">
                  <div className="animate-bounce-subtle">
                    <Fingerprint className="h-24 w-24 mx-auto mb-4 text-primary/70" />
                  </div>
                </div>
              </div>
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Security is Our <AnimatedGradientText>Top Priority</AnimatedGradientText>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We've built Just Chatting with a privacy-first approach. Your data security is non-negotiable.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/10 rounded-full">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Server-side encryption</h3>
                      <p className="text-sm text-muted-foreground">Your messages are encrypted on our servers, and we don't hold the keys. Only you and your recipient can decrypt them.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/10 rounded-full">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Local-first architecture</h3>
                      <p className="text-sm text-muted-foreground">Messages are stored in your browser using IndexedDB, making chats instantly accessible while still being securely backed up.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/10 rounded-full">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Secure authentication</h3>
                      <p className="text-sm text-muted-foreground">Industry-standard authentication protects your account with optional multi-factor security.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-muted/20 backdrop-blur-sm rounded-3xl my-8 border border-muted/10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our <AnimatedGradientText>Users Say</AnimatedGradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied users who've made Just Chatting their primary messaging platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently <AnimatedGradientText>Asked Questions</AnimatedGradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <FaqItem key={index} {...faq} />
              ))}
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10 text-center animate-pulse-slow">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready for Truly Private Messaging?</h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
                Join Just Chatting today and experience the perfect balance of speed and security. Local-first for performance, encrypted storage for privacy.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity px-8">
                Start Chatting Now
              </Button>
            </div>
          </div>

          {/* Enhanced Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-primary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-500/10 to-primary/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <RedirectToConversation />
      </Authenticated>
    </div>
  );
}
