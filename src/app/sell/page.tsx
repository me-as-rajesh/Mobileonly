"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getSuggestedPrice,
  type PriceSuggestion,
  type SuggestListingPriceInput,
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
import { Bot, Check, Loader2, Sparkles, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { locationOptions } from "@/lib/locations";

const CreateListingSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  ram: z.coerce.number().min(1, "RAM is required"),
  storage: z.coerce.number().min(1, "Storage is required"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  purchaseYear: z.coerce
    .number()
    .min(2010, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  price: z.coerce.number().min(1, "Price is required"),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required").max(8, "You can upload a maximum of 8 images."),
});

type CreateListingInput = z.infer<typeof CreateListingSchema>;

export default function SellPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateListingInput>({
    resolver: zodResolver(CreateListingSchema),
    defaultValues: {
      images: [],
    }
  });

  const handlePriceSuggest: SubmitHandler<PriceSuggestionInput> = async (data) => {
    setIsPriceLoading(true);
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
        form.setValue('price', result.data!.suggestedPrice);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsPriceLoading(false);
    }
  };

  const onFinalSubmit: SubmitHandler<CreateListingInput> = async (data) => {
    setIsSubmitting(true);
    console.log("Final Listing Data:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Listing Created!",
      description: "Your new listing has been successfully created.",
    });
    form.reset();
    setPriceSuggestion(null);
    setIsSubmitting(false);
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentImageCount = form.getValues('images').length;
    if (files.length + currentImageCount > 8) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: `You can only upload a maximum of 8 images. You have already selected ${currentImageCount}.`,
      });
      return;
    }
    
    setIsUploading(true);
    const uploadedUrls = form.getValues('images');

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          uploadedUrls.push(result.url);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: (error as Error).message,
        });
        break; 
      }
    }
    form.setValue('images', uploadedUrls);
    setIsUploading(false);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const currentImages = form.getValues('images');
    form.setValue('images', currentImages.filter(url => url !== urlToRemove));
  }


  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
          Sell Your Smartphone
        </h1>
        <p className="text-muted-foreground text-lg">
          Fill in your device details to create a new listing.
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onFinalSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Device Details</CardTitle>
            <CardDescription>
              Provide the core specifications of the phone you want to sell.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input id="title" placeholder="e.g., Excellent Condition iPhone 15 Pro 256GB" {...form.register("title")} />
              {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select onValueChange={(value) => form.setValue("brand", value)}>
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
              <Select onValueChange={(value) => form.setValue("ram", Number(value))}>
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
              <Select onValueChange={(value) => form.setValue("storage", Number(value))}>
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
              <Select onValueChange={(value) => form.setValue("condition", value as any)}>
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

             <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Combobox
                    options={locationOptions}
                    value={form.watch('location')}
                    onChange={(value) => form.setValue('location', value)}
                    placeholder="Select your city..."
                    searchPlaceholder="Search for a city..."
                />
                 {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}
            </div>
            
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the phone's condition, any accessories included, etc." {...form.register("description")} />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="images">Images</Label>
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                    <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading}/>
                    <label htmlFor="image-upload" className={cn("cursor-pointer", {"cursor-not-allowed opacity-50": isUploading})}>
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground"/>
                        <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload images (up to 8)</p>
                        {isUploading && <div className="flex items-center justify-center mt-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</div>}
                    </label>
                </div>
                 {form.formState.errors.images && <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>}

                <div className="grid grid-cols-4 gap-4 mt-4">
                    {form.watch('images').map(url => (
                        <div key={url} className="relative group aspect-square">
                            <Image src={url} alt="Uploaded image" fill className="object-cover rounded-md"/>
                             <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveImage(url)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    {isUploading && Array.from({length: 1}).map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="price">Price (INR)</Label>
              <div className="flex gap-2">
                <Input id="price" type="number" placeholder="e.g., 45000" {...form.register("price")} className="flex-1"/>
                <Button type="button" variant="outline" disabled={isPriceLoading} onClick={form.handleSubmit(handlePriceSuggest)}>
                  {isPriceLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get AI Suggestion
                </Button>
              </div>
              {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
            </div>

          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
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
                </AlertDescription>
              </Alert>
            )}
             <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Create Listing
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
