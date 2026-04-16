'use client';

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for the modern marketplace.
          </p>
        </div>
        <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-right">
            © {year || ''} ConnectCell Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
