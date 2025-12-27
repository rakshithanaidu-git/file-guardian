import { TrackedFile } from "@/types/file";
import { FileCard } from "./FileCard";
import { Shield } from "lucide-react";

interface FileListProps {
  files: TrackedFile[];
  onVerify: (id: string) => void;
  onRemove: (id: string) => void;
}

export function FileList({ files, onVerify, onRemove }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="bg-card/30 border border-border/30 rounded-lg p-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No files being monitored</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Upload files above to start integrity monitoring
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary font-mono">[</span>
          Monitored Files
          <span className="text-primary font-mono">]</span>
        </h2>
        <span className="text-xs font-mono text-muted-foreground">
          {files.length} file{files.length !== 1 ? 's' : ''} tracked
        </span>
      </div>

      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={file.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-slide-in"
          >
            <FileCard
              file={file}
              onVerify={onVerify}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
