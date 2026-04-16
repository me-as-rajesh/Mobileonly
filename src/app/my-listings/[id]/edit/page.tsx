"use client";

import * as React from "react";
import { useForm, type SubmitHandler, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import locationData from '../../../../states-and-districts.json';
import { Textarea } from "@/components/ui/textarea";

const states = locationData.states.map(s => ({ name: s.state, districts: s.districts }));


const EditListingSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  price: z.coerce.number().min(1, "Price is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  ram: z.coerce.number().min(1, "RAM is required"),
  storage: z.coerce.number().min(1, "Storage is required"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  purchaseYear: z.coerce
    .number()
    .min(2010, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  location: z.object({
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    address: z.string().min(10, "Address must be at least 10 characters")
  })
});

type EditListingInput = z.infer<typeof EditListingSchema>;

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    notFound();
  }

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const [districts, setDistricts] = React.useState<string[]>([]);

  const form = useForm<EditListingInput>({
    resolver: zodResolver(EditListingSchema),
    defaultValues: {
      brand: listing.brand,
      model: listing.model,
      ram: listing.variant.ram,
      storage: listing.variant.storage,
      condition: listing.condition,
      purchaseYear: listing.purchaseYear,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: {
        state: listing.location.state,
        district: listing.location.district,
        address: listing.location.address || '',
      }
    },
  });

  const watchedState = useWatch({
    control: form.control,
    name: 'location.state',
  });

  React.useEffect(() => {
    if (watchedState) {
      const stateData = states.find(s => s.name === watchedState);
      setDistricts(stateData?.districts || []);
      form.setValue('location.district', ''); // Reset district when state changes
    } else {
        const stateData = states.find(s => s.name === listing.location.state);
        setDistricts(stateData?.districts || []);
    }
  }, [watchedState, form, listing.location.state]);


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
                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Listing Title</Label>
                  <Input id="title" {...form.register("title")} />
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>
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
                  {form.formState.errors.model && <p className="text-sm text-destructive">{form.formState.errors.model.message}</p>}
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
                  {form.formState.errors.purchaseYear && <p className="text-sm text-destructive">{form.formState.errors.purchaseYear.message}</p>}
                </div>

                 <div className="space-y-2">
                    <Label>State</Label>
                    <Controller
                        name="location.state"
                        control={form.control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                            {states.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {form.formState.errors.location?.state && <p className="text-sm text-destructive">{form.formState.errors.location.state.message}</p>}
                </div>
                
                <div className="space-y-2">
                    <Label>District</Label>
                    <Controller
                        name="location.district"
                        control={form.control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={!watchedState}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent>
                            {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {form.formState.errors.location?.district && <p className="text-sm text-destructive">{form.formState.errors.location.district.message}</p>}
                </div>

                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="locationAddress">Full Address</Label>
                  <Textarea id="locationAddress" placeholder="Enter your full address (street, landmark, etc.)" {...form.register("location.address")} />
                  {form.formState.errors.location?.address && <p className="text-sm text-destructive">{form.formState.errors.location.address.message}</p>}
                </div>
                
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...form.register("description")} />
                    {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="price">Price (INR)</Label>
                    <Input id="price" type="number" {...form.register("price")} />
                    {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
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
