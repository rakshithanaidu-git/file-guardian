import { useState } from "react";
import { 
  File, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  RefreshCw, 
  Copy, 
  Check,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackedFile, IntegrityStatus } from "@/types/file";
import { formatFileSize, getFileExtension } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

interface FileCardProps {
  file: TrackedFile;
  onVerify: (id: string) => void;
  onRemove: (id: string) => void;
}

const statusConfig: Record<IntegrityStatus, {
  icon: typeof ShieldCheck;
  color: string;
  bgColor: string;
  label: string;
}> = {
  verified: {
    icon: ShieldCheck,
    color: "text-success",
    bgColor: "bg-success/10 border-success/30",
    label: "Verified",
  },
  modified: {
    icon: ShieldAlert,
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    label: "Modified!",
  },
  pending: {
    icon: Shield,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/30",
    label: "Pending",
  },
  checking: {
    icon: Loader2,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30",
    label: "Checking...",
  },
};

export function FileCard({ file, onVerify, onRemove }: FileCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const config = statusConfig[file.status];
  const StatusIcon = config.icon;

  const copyHash = async () => {
    await navigator.clipboard.writeText(file.originalHash);
    setCopied(true);
    toast({
      title: "Hash copied",
      description: "SHA-256 hash copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`
      bg-card border rounded-lg p-4 animate-fade-in transition-all duration-300
      ${file.status === 'modified' ? 'border-destructive/50 cyber-glow-destructive' : 'border-border/50'}
      ${file.status === 'verified' ? 'border-success/30' : ''}
      hover:border-primary/30
    `}>
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex-shrink-0">
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <File className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground truncate">
              {file.name}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
              {getFileExtension(file.name)}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {formatFileSize(file.size)} • Added {file.addedAt.toLocaleTimeString()}
          </p>

          {/* Hash Display */}
          <div className="bg-background/50 border border-border/30 rounded-md p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-mono">SHA-256</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={copyHash}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <p className="hash-text text-primary/80 select-all">
              {file.originalHash}
            </p>
            
            {file.status === 'modified' && file.currentHash !== file.originalHash && (
              <div className="mt-2 pt-2 border-t border-destructive/30">
                <span className="text-xs text-destructive font-mono">CURRENT HASH (MISMATCH)</span>
                <p className="hash-text text-destructive/80 select-all mt-1">
                  {file.currentHash}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col items-end gap-2">
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full border
            ${config.bgColor}
          `}>
            <StatusIcon className={`h-4 w-4 ${config.color} ${file.status === 'checking' ? 'animate-spin' : ''}`} />
            <span className={`text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVerify(file.id)}
              disabled={file.status === 'checking'}
            >
              <RefreshCw className={`h-4 w-4 ${file.status === 'checking' ? 'animate-spin' : ''}`} />
              <span className="ml-1">Verify</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(file.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
