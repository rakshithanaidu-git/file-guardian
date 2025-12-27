import { useCallback, useState } from "react";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileSelect: (files: FileList) => void;
  isProcessing: boolean;
}

export function FileUploader({ onFileSelect, isProcessing }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
        ${isDragging 
          ? "border-primary bg-primary/10 cyber-glow" 
          : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card"
        }
        ${isProcessing ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`
          p-4 rounded-full bg-primary/10 border border-primary/30
          ${isDragging ? "animate-pulse-glow" : ""}
        `}>
          {isDragging ? (
            <FileUp className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-primary" />
          )}
        </div>
        
        <div>
          <p className="text-foreground font-medium">
            {isDragging ? "Drop files here" : "Drag & drop files to monitor"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>

        <Button variant="outline" size="sm" disabled={isProcessing}>
          <Upload className="h-4 w-4 mr-2" />
          Select Files
        </Button>

        <p className="text-xs text-muted-foreground font-mono">
          SHA-256 hash will be calculated for integrity verification
        </p>
      </div>
    </div>
  );
}
