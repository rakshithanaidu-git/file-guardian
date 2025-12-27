import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { StatsPanel } from "@/components/StatsPanel";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { TrackedFile } from "@/types/file";
import { calculateSHA256 } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [files, setFiles] = useState<TrackedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (fileList: FileList) => {
    setIsProcessing(true);
    
    const newFiles: TrackedFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check if file already exists
      const exists = files.some(f => f.name === file.name && f.size === file.size);
      if (exists) {
        toast({
          title: "File already tracked",
          description: `${file.name} is already being monitored`,
          variant: "destructive",
        });
        continue;
      }

      const hash = await calculateSHA256(file);
      
      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        originalHash: hash,
        currentHash: hash,
        status: 'verified',
        addedAt: new Date(),
        lastChecked: new Date(),
        file: file,
      });
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...newFiles, ...prev]);
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) added for integrity monitoring`,
      });
    }
    
    setIsProcessing(false);
  }, [files, toast]);

  const handleVerify = useCallback(async (id: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'checking' as const } : f
    ));

    // Simulate network delay for demo
    await new Promise(resolve => setTimeout(resolve, 1000));

    const file = files.find(f => f.id === id);
    if (!file) return;

    const currentHash = await calculateSHA256(file.file);
    const isMatch = currentHash === file.originalHash;

    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { 
            ...f, 
            currentHash,
            status: isMatch ? 'verified' : 'modified',
            lastChecked: new Date(),
          } 
        : f
    ));

    toast({
      title: isMatch ? "Integrity verified" : "Integrity compromised!",
      description: isMatch 
        ? `${file.name} matches original hash`
        : `${file.name} has been modified!`,
      variant: isMatch ? "default" : "destructive",
    });
  }, [files, toast]);

  const handleVerifyAll = useCallback(async () => {
    for (const file of files) {
      await handleVerify(file.id);
    }
  }, [files, handleVerify]);

  const handleRemove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({
      title: "File removed",
      description: "File removed from monitoring",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <StatsPanel files={files} />

        {/* Upload Section */}
        <section>
          <FileUploader 
            onFileSelect={handleFileSelect} 
            isProcessing={isProcessing} 
          />
        </section>

        {/* Actions */}
        {files.length > 0 && (
          <div className="flex justify-end gap-2">
            <Button 
              variant="cyber" 
              onClick={handleVerifyAll}
              disabled={isProcessing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Verify All Files
            </Button>
          </div>
        )}

        {/* File List */}
        <FileList 
          files={files} 
          onVerify={handleVerify}
          onRemove={handleRemove}
        />

        {/* Footer Info */}
        <footer className="border-t border-border/30 pt-8 mt-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-mono">
              FileGuard uses SHA-256 cryptographic hashing for file integrity verification
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
