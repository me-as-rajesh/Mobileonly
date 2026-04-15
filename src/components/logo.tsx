import React from "react";
import { cn } from "@/lib/utils";
import { Smartphone } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg font-bold font-headline",
        className
      )}
    >
      <div className="p-1.5 bg-primary text-primary-foreground rounded-lg">
        <Smartphone className="h-5 w-5" />
      </div>
      <span>ConnectCell</span>
    </div>
  );
}
