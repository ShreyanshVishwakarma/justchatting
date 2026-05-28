"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLoading, Unauthenticated, Authenticated } from "convex/react";
import Loading from '../../loading';
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Shield, Lock, MessageCircle, Users, Zap, Eye, Heart, CheckCircle, ArrowRight, Fingerprint, PenTool } from "lucide-react";
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

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const rotations = ["odd:-rotate-2", "even:rotate-2", "odd:rotate-1", "even:-rotate-1"];
  const rot = rotations[Math.floor(Math.random() * rotations.length)];
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card className={`group relative transition-all duration-300 bg-[#fdfbf7] border-[3px] border-border shadow-[6px_6px_0px_0px_#2d2d2d] transform ${rot} hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#ff4d4d] ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    style={{ borderRadius: "var(--radius-wobbly)" }}>
      <div className="absolute top-2 right-2 opacity-50"><PenTool size={16} /></div>
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-4 p-3 border-2 border-dashed border-border rounded-full bg-muted w-fit group-hover:bg-accent group-hover:text-white transition-colors duration-300">
          <Icon className="h-8 w-8 relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5}/>
        </div>
        <CardTitle className="text-2xl font-bold font-[family-name:var(--font-kalam)]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-lg text-foreground/80 leading-relaxed font-[family-name:var(--font-patrick-hand)]">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ quote, author, role }: TestimonialProps) => {
  const isPostIt = Math.random() > 0.5;
  const bgClass = isPostIt ? "bg-[#fdf8c1]" : "bg-muted";
  
  return (
    <Card 
      className={`${bgClass} border-[3px] border-border hover:shadow-[4px_4px_0px_0px_#2d5da1] transition-all overflow-hidden group transform hover:-translate-y-1 odd:rotate-1 even:-rotate-2`}
      style={{ borderRadius: "var(--radius-wobbly)" }}
    >
      <CardContent className="p-6 relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-400/20 rotate-[-5deg]"></div>
        <p className="text-foreground text-xl mb-4 relative z-10 italic font-[family-name:var(--font-patrick-hand)]">"{quote}"</p>
        <div className="flex items-center relative z-10 mt-4 border-t-2 border-dashed border-border/50 pt-4">
          <div className="w-12 h-12 border-2 border-border flex items-center justify-center text-foreground font-bold bg-white" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
            <span className="font-[family-name:var(--font-kalam)] text-xl">{author.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <p className="font-bold text-lg font-[family-name:var(--font-kalam)]">{author}</p>
            <p className="text-foreground/70">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <Card className="bg-white border-[3px] border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#ff4d4d]"
        style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
    <CardHeader>
      <CardTitle className="text-2xl flex items-start font-[family-name:var(--font-kalam)]">
        <span className="text-accent mr-3 font-bold text-3xl leading-none">Q:</span> 
        <span>{question}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-lg bg-muted/50 p-4 border border-dashed border-border" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
        {answer}
      </p>
    </CardContent>
  </Card>
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = useMemo(() => [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Messages locked up tight! Only you and your friends hold the key.",
      delay: 0
    },
    {
      icon: Eye,
      title: "Local-First Experience",
      description: "Everything lives in your browser. Fast, private, and always yours.",
      delay: 100
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "No loading Spinners. Instant messaging like it was meant to be.",
      delay: 200
    },
    {
      icon: Users,
      title: "Connect Globally",
      description: "Chat securely across borders. Because friends don't let friends use unencrypted apps.",
      delay: 300
    },
    {
      icon: Lock,
      title: "You Own Your Data",
      description: "No sneaky tracking. We literally can't read your messages even if we wanted to.",
      delay: 400
    },
    {
      icon: Heart,
      title: "Human Centric",
      description: "Friendly, quirky design that doesn't feel like a corporate board room.",
      delay: 500
    }
  ], []);
  
  const testimonials: TestimonialProps[] = useMemo(() => [
    {
      quote: "It's so fast I thought it was broken. It wasn't. It's just that fast.",
      author: "Alex C.",
      role: "Impatient texter"
    },
    {
      quote: "Love the doodle aesthetic. And knowing my data is safe is pretty cool too.",
      author: "Sarah J.",
      role: "Design nerd"
    },
    {
      quote: "Finally an app that doesn't try to read my thoughts to show me shoe ads.",
      author: "Mike R.",
      role: "Shoe enthusiast"
    }
  ], []);
  
  const faqs: FaqItemProps[] = useMemo(() => [
    {
      question: "How secure is this really?",
      answer: "Super secure! We use server-side encryption with local keys. Simply put: the server just holds scrambled gibberish."
    },
    {
      question: "Is it actually free?",
      answer: "Yep! Privacy shouldn't cost you an arm and a leg. Use it for personal chats completely free."
    },
    {
      question: "What does local-first mean?",
      answer: "It means we store the chat history on your device first (in IndexedDB). This makes it blazingly fast."
    },
    {
      question: "Can anyone read my messages?",
      answer: "No. Since you control the encryption keys on your device, nobody else can decipher them. Not even us."
    }
  ], []);

  return (
    <div className="min-h-screen bg-transparent overflow-hidden selection:bg-accent selection:text-white">
      <AuthLoading>
        <div className="flex justify-center items-center h-screen">
          <div className="text-3xl font-bold font-[family-name:var(--font-kalam)] animate-bounce-subtle flex flex-col items-center">
            <PenTool className="animate-spin mb-4" size={48} />
            Drawing up the app...
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          
          

          {/* Hero Section */}
          <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-block mb-4 px-4 py-1 border-[3px] border-border bg-muted transform -rotate-2 font-bold text-lg" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                v2.0 (Hand-drawn edition) ✏️
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] font-[family-name:var(--font-kalam)]">
                Chat securely, <br />
                <span className="text-accent underline decoration-wavy decoration-border underline-offset-4">without the polish.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-foreground font-[family-name:var(--font-patrick-hand)] mb-8 max-w-2xl mx-auto lg:mx-0 bg-white/50 inline-block p-2 border-2 border-dashed border-border/20 rounded-md">
                Fast, private, and refreshingly human. We left out the straight lines and clinical designs so you can just focus on talking.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="text-xl rotate-1 hover:-rotate-1 w-full sm:w-auto h-16 px-8">
                  Get Started for Free <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <Button size="lg" variant="outline" className="text-xl -rotate-1 hover:rotate-1 w-full sm:w-auto h-16">
                  <Lock className="mr-2 h-5 w-5" /> Read the Manifesto
                </Button>
              </div>
            </div>

            {/* Hero Image / Graphic */}
            <div className="w-full lg:w-1/2 relative flex justify-center py-10 mt-10 lg:mt-0">
              <div className="bg-white border-4 border-border shadow-[12px_12px_0px_0px_#2d2d2d] transform rotate-3 flex flex-col max-w-sm w-full"
                   style={{ borderRadius: "var(--radius-wobbly)" }}>
                <div className="border-b-4 border-border p-4 flex items-center justify-between bg-muted" style={{ borderRadius: "15px 15px 0 0" }}>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-border bg-destructive"></div>
                    <div className="w-4 h-4 rounded-full border-2 border-border bg-[#eab308]"></div>
                    <div className="w-4 h-4 rounded-full border-2 border-border bg-green-400"></div>
                  </div>
                  <span className="font-bold text-lg font-[family-name:var(--font-kalam)]">Just a chat...</span>
                </div>
                <div className="p-6 flex flex-col gap-4 h-64 overflow-hidden bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:16px_16px]">
                  <div className="flex self-start max-w-[80%]">
                    <div className="bg-white border-2 border-border p-3 shadow-[3px_3px_0_0_#2d2d2d] -rotate-1" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                      <p className="text-lg">Hey! Look at this wobbly chat box.</p>
                    </div>
                  </div>
                  <div className="flex self-end max-w-[80%]">
                    <div className="bg-[#fdf8c1] border-2 border-border p-3 shadow-[3px_3px_0_0_#2d2d2d] rotate-2" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                      <p className="text-lg">I know, right? It feels so organic!</p>
                    </div>
                  </div>
                  <div className="flex self-start max-w-[80%] mt-2">
                    <div className="bg-white border-2 border-border p-3 shadow-[3px_3px_0_0_#2d2d2d] -rotate-2" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                      <p className="text-lg">And secure? 🔒</p>
                    </div>
                  </div>
                </div>
                <div className="border-t-4 border-border p-4 bg-white flex gap-2" style={{ borderRadius: "0 0 15px 15px" }}>
                   <div className="flex-1 border-2 border-border rounded-full px-4 py-2 flex items-center bg-muted/50 border-dashed">
                      <span className="text-muted-foreground text-lg">Type a message...</span>
                   </div>
                   <div className="w-12 h-12 bg-accent rounded-full border-2 border-border flex items-center justify-center text-white shadow-[2px_2px_0_0_#2d2d2d]">
                     <ArrowRight size={20} className="stroke-[3px]" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
             <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-kalam)]">
                 Why it's kind of awesome.
              </h2>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 h-4 border-b-4 border-dashed border-accent rotate-[-2deg]"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
              {features.map((feature, idx) => (
                 <FeatureCard key={idx} {...feature} />
              ))}
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/20 border-y-4 border-border border-dashed my-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-kalam)]">
                What they're scribbling
              </h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                Don't just take our word for it. Look at these post-its.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-kalam)]">
                Frequently Scribbled Questions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <FaqItem key={index} {...faq} />
              ))}
            </div>
          </div>

          <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-accent rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_0px_#2d2d2d] border-[4px] border-border text-center relative overflow-hidden transform -rotate-1" style={{ borderRadius: "var(--radius-wobbly)" }}>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white font-[family-name:var(--font-kalam)]">
                  Ready to Ditch the Polish?
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90 font-[family-name:var(--font-patrick-hand)]">
                  Join JustChatting today and experience the perfect balance of quirky design, lightning speed, and serious security.
                </p>
                <Button size="lg" variant="outline" className="bg-white text-foreground hover:bg-muted text-2xl font-bold shadow-[6px_6px_0px_0px_#2d2d2d] py-8 px-12 rotate-2 hover:rotate-3">
                  Start Chatting Now
                </Button>
              </div>
            </div>
          </div>

        </div>
      </Unauthenticated>

      <Authenticated>
        <RedirectToConversation />
      </Authenticated>
    </div>
  );
}
