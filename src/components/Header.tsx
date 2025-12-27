import { Shield, Terminal } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="text-primary">&gt;</span>
              FileGuard
              <span className="text-primary animate-pulse">_</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              integrity verification system v1.0
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
