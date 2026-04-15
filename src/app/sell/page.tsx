"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getSuggestedPrice,
  type PriceSuggestion,
  type PriceSuggestionInput,
} from "./actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BRANDS,
  CONDITIONS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
} from "@/lib/types";
import { AlertCircle, Bot, Check, Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PriceSuggestionSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  ram: z.coerce.number().min(1, "RAM is required"),
  storage: z.coerce.number().min(1, "Storage is required"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  purchaseYear: z.coerce
    .number()
    .min(2010, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

export default function SellPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const { toast } = useToast();

  const form = useForm<PriceSuggestionInput>({
    resolver: zodResolver(PriceSuggestionSchema),
  });

  const onSubmit: SubmitHandler<PriceSuggestionInput> = async (data) => {
    setIsSubmitting(true);
    setPriceSuggestion(null);
    try {
      const result = await getSuggestedPrice(data);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        setPriceSuggestion(result.data!);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
          Sell Your Smartphone
        </h1>
        <p className="text-muted-foreground text-lg">
          Follow our simple steps to list your device and get the best price.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-accent"/>
            AI Price Suggestion
          </CardTitle>
          <CardDescription>
            Fill in your phone's details to get a fair market price suggestion from our AI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select {...form.register("brand")} onValueChange={(value) => form.setValue("brand", value)}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.brand && <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g., iPhone 15 Pro" {...form.register("model")} />
               {form.formState.errors.model && <p className="text-sm text-destructive">{form.formState.errors.model.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Select {...form.register("ram")} onValueChange={(value) => form.setValue("ram", Number(value))}>
                <SelectTrigger id="ram">
                  <SelectValue placeholder="Select RAM" />
                </SelectTrigger>
                <SelectContent>
                  {RAM_OPTIONS.map((ram) => (
                    <SelectItem key={ram} value={String(ram)}>{ram} GB</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {form.formState.errors.ram && <p className="text-sm text-destructive">{form.formState.errors.ram.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage">Storage</Label>
              <Select {...form.register("storage")} onValueChange={(value) => form.setValue("storage", Number(value))}>
                <SelectTrigger id="storage">
                  <SelectValue placeholder="Select Storage" />
                </SelectTrigger>
                <SelectContent>
                  {STORAGE_OPTIONS.map((storage) => (
                    <SelectItem key={storage} value={String(storage)}>
                      {storage >= 1024 ? `${storage / 1024} TB` : `${storage} GB`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {form.formState.errors.storage && <p className="text-sm text-destructive">{form.formState.errors.storage.message}</p>}
            </div>

             <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select {...form.register("condition")} onValueChange={(value) => form.setValue("condition", value as any)}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {form.formState.errors.condition && <p className="text-sm text-destructive">{form.formState.errors.condition.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseYear">Purchase Year</Label>
              <Input id="purchaseYear" type="number" placeholder="e.g., 2022" {...form.register("purchaseYear")} />
               {form.formState.errors.purchaseYear && <p className="text-sm text-destructive">{form.formState.errors.purchaseYear.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
             <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get AI Price Suggestion
            </Button>

            {priceSuggestion && (
              <Alert variant="default" className="bg-accent/20 border-accent/50">
                 <Bot className="h-4 w-4 text-accent" />
                <AlertTitle className="font-headline text-accent">AI Pricing Analysis Complete!</AlertTitle>
                <AlertDescription>
                  <p className="font-semibold mb-2">{priceSuggestion.reasoning}</p>
                  <div className="flex justify-around items-center text-center my-4">
                      <div>
                          <div className="text-sm text-muted-foreground">Min Price</div>
                          <div className="text-lg font-bold">₹{priceSuggestion.minPrice.toLocaleString('en-IN')}</div>
                      </div>
                       <div>
                          <div className="text-sm font-bold text-primary">Suggested</div>
                          <div className="text-3xl font-bold text-primary">₹{priceSuggestion.suggestedPrice.toLocaleString('en-IN')}</div>
                      </div>
                       <div>
                          <div className="text-sm text-muted-foreground">Max Price</div>
                          <div className="text-lg font-bold">₹{priceSuggestion.maxPrice.toLocaleString('en-IN')}</div>
                      </div>
                  </div>
                   <div className="flex gap-2 mt-4">
                     <Button className="w-full" onClick={() => {}}>
                       <Check className="mr-2 h-4 w-4"/> Use This Price & Continue
                     </Button>
                   </div>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
