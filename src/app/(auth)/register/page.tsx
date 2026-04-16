'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useAuth, useFirestore } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createUserProfile } from "@/lib/firestore";
import { doc, getDoc } from 'firebase/firestore';

const RegisterSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["buyer", "seller", "both"]),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      role: "buyer",
    },
  });

  const handleRegister = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      await createUserProfile(firestore, userCredential.user, data.role, data.name);
      
      toast({ title: "Account Created", description: "You have been successfully registered." });
      router.push(`/profile/${userCredential.user.uid}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(firestore, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await createUserProfile(firestore, result.user, 'buyer', result.user.displayName || 'New User');
      }

      toast({ title: "Success", description: "Logged in successfully." });
      router.push(`/profile/${result.user.uid}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-up Failed",
        description: error.message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-2" />
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Join ConnectCell to start buying and selling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleRegister)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label>I want to:</Label>
                 <Controller
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4 pt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="buyer" id="r-buyer" />
                          <Label htmlFor="r-buyer" className="font-normal">Buy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="seller" id="r-seller" />
                          <Label htmlFor="r-seller" className="font-normal">Sell</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="r-both" />
                          <Label htmlFor="r-both" className="font-normal">Both</Label>
                        </div>
                      </RadioGroup>
                    )}
                 />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              Create Account
            </Button>
          </form>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-72.5 67.7C338.1 100.3 300.9 88 248 88c-73.2 0-132.3 59.2-132.3 132.3s59.1 132.3 132.3 132.3c76.9 0 111.2-51.8 115.7-77.9H248v-94.2h238.2c1.2 6.6 2.3 13.2 2.3 20.2z"></path></svg>}
              Sign up with Google
            </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
