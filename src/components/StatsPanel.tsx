import { Shield, ShieldAlert, ShieldCheck, FileSearch } from "lucide-react";
import { TrackedFile } from "@/types/file";

interface StatsPanelProps {
  files: TrackedFile[];
}

export function StatsPanel({ files }: StatsPanelProps) {
  const verified = files.filter(f => f.status === 'verified').length;
  const modified = files.filter(f => f.status === 'modified').length;
  const pending = files.filter(f => f.status === 'pending').length;

  const stats = [
    {
      label: "Total Files",
      value: files.length,
      icon: FileSearch,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Verified",
      value: verified,
      icon: ShieldCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Modified",
      value: modified,
      icon: ShieldAlert,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: Shield,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border/50 rounded-lg p-4 animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
