"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ClientDateProps = {
  date: string | number | Date;
  locale?: string;
  className?: string;
  options: Intl.DateTimeFormatOptions;
};

export function ClientDate({ date, options, locale = "en-IN", className }: ClientDateProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    try {
        setFormatted(new Date(date).toLocaleDateString(locale, options));
    } catch (e) {
        setFormatted("Invalid Date");
    }
  }, [date, locale, options]);

  if (!formatted) {
    return <Skeleton className={cn("h-4 w-20", className)} />;
  }

  return <span className={className}>{formatted}</span>;
}

type ClientTimeProps = {
    date: string | number | Date;
    locale?: string;
    className?: string;
    options: Intl.DateTimeFormatOptions;
};

export function ClientTime({ date, options, locale = "en-IN", className }: ClientTimeProps) {
    const [formatted, setFormatted] = useState<string | null>(null);

    useEffect(() => {
        try {
            setFormatted(new Date(date).toLocaleTimeString(locale, options));
        } catch (e) {
            setFormatted("Invalid Time");
        }
    }, [date, locale, options]);
    
    if (!formatted) {
        return <Skeleton className={cn("h-4 w-16", className)} />;
    }

    return <time className={className}>{formatted}</time>;
}
