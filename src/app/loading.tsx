import { JustChattingLogo } from "@/components/JustChattingLogo";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading" }: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <JustChattingLogo size={48} />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}
