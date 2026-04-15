"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type SuggestListingPriceInput } from "@/app/sell/actions";

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
import {
  BRANDS,
  CONDITIONS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  type Location,
} from "@/lib/types";
import { Check, Loader2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listings } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import PlacesAutocomplete from "@/components/ui/places-autocomplete";

const EditListingSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  ram: z.coerce.number().min(1, "RAM is required"),
  storage: z.coerce.number().min(1, "Storage is required"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  purchaseYear: z.coerce
    .number()
    .min(2010, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  location: z.custom<Location>().nullable().refine(val => val !== null, {
    message: "Please select a valid location from the suggestions.",
  }),
});

type EditListingInput = z.infer<typeof EditListingSchema>;

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    notFound();
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EditListingInput>({
    resolver: zodResolver(EditListingSchema),
    defaultValues: {
      brand: listing.brand,
      model: listing.model,
      ram: listing.variant.ram,
      storage: listing.variant.storage,
      condition: listing.condition,
      purchaseYear: listing.purchaseYear,
      location: listing.location,
    },
  });

  const onSubmit: SubmitHandler<EditListingInput> = async (data) => {
    setIsSubmitting(true);
    console.log("Updated data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Listing Updated",
      description: `${data.model} has been successfully updated.`,
    });
    setIsSubmitting(false);
    router.push("/my-listings");
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
          <div className="space-y-4 mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
              Edit Your Listing
            </h1>
            <p className="text-muted-foreground text-lg">
              Make changes to your device listing.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pencil className="text-accent" />
                Editing: {listing.title}
              </CardTitle>
              <CardDescription>
                Update your phone's details below.
              </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select
                    defaultValue={listing.brand}
                    onValueChange={(value) => form.setValue("brand", value)}
                  >
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" {...form.register("model")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Select
                    defaultValue={String(listing.variant.ram)}
                    onValueChange={(value) =>
                      form.setValue("ram", Number(value))
                    }
                  >
                    <SelectTrigger id="ram">
                      <SelectValue placeholder="Select RAM" />
                    </SelectTrigger>
                    <SelectContent>
                      {RAM_OPTIONS.map((ram) => (
                        <SelectItem key={ram} value={String(ram)}>
                          {ram} GB
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Select
                    defaultValue={String(listing.variant.storage)}
                    onValueChange={(value) =>
                      form.setValue("storage", Number(value))
                    }
                  >
                    <SelectTrigger id="storage">
                      <SelectValue placeholder="Select Storage" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORAGE_OPTIONS.map((storage) => (
                        <SelectItem key={storage} value={String(storage)}>
                          {storage >= 1024
                            ? `${storage / 1024} TB`
                            : `${storage} GB`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    defaultValue={listing.condition}
                    onValueChange={(value) =>
                      form.setValue("condition", value as any)
                    }
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseYear">Purchase Year</Label>
                  <Input
                    id="purchaseYear"
                    type="number"
                    {...form.register("purchaseYear")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Controller
                    name="location"
                    control={form.control}
                    render={({ field }) => (
                      <PlacesAutocomplete
                        id="edit-location"
                        onPlaceSelect={(place) => {
                          if (place) {
                            const { address, ...locationData } = place;
                            field.onChange(locationData);
                          } else {
                            field.onChange(null);
                          }
                        }}
                        defaultValue={field.value ? `${field.value.city}, ${field.value.state}` : ''}
                      />
                    )}
                  />
                   {form.formState.errors.location && (
                    <p className="text-sm text-destructive">
                      {(form.formState.errors.location as any).message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
