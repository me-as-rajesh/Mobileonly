
'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock user data
const currentUser = {
    name: 'Alex R.',
    email: 'alex@example.com',
};


export default function SettingsPage() {
  const { toast } = useToast();
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
    },
  });

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsSavingProfile(true);
    console.log('Updating profile:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully saved.',
    });
    setIsSavingProfile(false);
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account settings and notification preferences.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Profile Settings Card */}
            <Card>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your public profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...profileForm.register('name')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...profileForm.register('email')} disabled />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Notifications Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive emails about new messages and offers.</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get push notifications on your devices.</p>
                        </div>
                        <Switch id="push-notifications" />
                    </div>
                </CardContent>
                 <CardFooter>
                  <Button disabled>
                    <Save className="mr-2" />
                    Save Preferences
                  </Button>
                </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
