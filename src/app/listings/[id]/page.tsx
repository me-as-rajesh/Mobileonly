import { notFound } from "next/navigation";
import Image from "next/image";
import { listings } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  ChevronRight,
  Cpu,
  HardDrive,
  Heart,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Smartphone,
  CalendarDays,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { ClientDate } from "@/components/client-date";

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    notFound();
  }

  const {
    title,
    price,
    images,
    description,
    brand,
    model,
    variant,
    condition,
    location,
    purchaseYear,
    seller,
    createdAt,
  } = listing;

  const imageDetails = images.map(
    (id) =>
      PlaceHolderImages.find((p) => p.id === id) || {
        id,
        imageUrl: `https://picsum.photos/seed/${id}/800/600`,
        imageHint: "smartphone",
      }
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="md:sticky md:top-24 self-start">
          <Carousel>
            <CarouselContent>
              {imageDetails.map((img) => (
                <CarouselItem key={img.id}>
                  <Card className="overflow-hidden">
                    <div className="aspect-[4/3]">
                      <Image
                        src={img.imageUrl}
                        alt={title}
                        width={800}
                        height={600}
                        className="object-cover w-full h-full"
                        data-ai-hint={img.imageHint}
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold lg:text-4xl">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-primary">
                ₹{price.toLocaleString("en-IN")}
              </p>
              {listing.isNegotiable && (
                <Badge variant="secondary">Negotiable</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Posted in {location.city}, {location.state} on{" "}
              <ClientDate
                date={createdAt}
                options={{
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }}
              />
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <SpecItem icon={Smartphone} label="Brand" value={brand} />
                <SpecItem icon={Smartphone} label="Model" value={model} />
                <SpecItem
                  icon={Cpu}
                  label="RAM"
                  value={`${variant.ram} GB`}
                />
                <SpecItem
                  icon={HardDrive}
                  label="Storage"
                  value={`${variant.storage} GB`}
                />
                <SpecItem icon={Shield} label="Condition" value={condition} />
                {purchaseYear && (
                    <SpecItem icon={CalendarDays} label="Purchase Year" value={String(purchaseYear)} />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback>
                      {seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span>{seller.rating}</span>
                      </div>
                      <span>({seller.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" variant="outline">
                <Heart className="mr-2 h-5 w-5" />
                Favorite
            </Button>
            <Button size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2 font-medium">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="capitalize">{value}</span>
            </div>
        </div>
    )
}
