'use client';

import { Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Logo } from './logo';

export function FirebaseConfigError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-center mb-6">
            <Logo />
        </div>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="text-xl font-bold font-headline">
            Firebase Configuration Error
          </AlertTitle>
          <AlertDescription className="mt-4 space-y-4 text-base">
            <p>
              Your application is missing an essential Firebase setting. The app cannot connect to the database without it.
            </p>
            <p>
              Please copy your{' '}
              <strong>Firebase Realtime Database URL</strong> from your Firebase project console and add it to the{' '}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                .env
              </code>{' '}
              file.
            </p>
            <div className="p-4 bg-background/50 rounded-md">
              <pre className="text-sm text-destructive-foreground/80">
                <code>
                  NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://&lt;your-project-id&gt;-default-rtdb.firebaseio.com
                </code>
              </pre>
            </div>
             <p>
              After updating the file, you may need to restart the development server for the changes to take effect.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
