interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading" }: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}
