"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BRANDS, CONDITIONS, RAM_OPTIONS, STORAGE_OPTIONS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export function Filters() {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState(50);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand.toLowerCase()}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
            <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
          </div>
          <Slider
            min={0}
            max={150000}
            step={1000}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Label htmlFor="location" className="sr-only">Your City</Label>
            <Input 
                id="location" 
                placeholder="Enter your city..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            
            <div className="space-y-2 pt-2">
                <Label>Radius</Label>
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 km</span>
                    <span>500 km</span>
                </div>
                <Slider
                    min={1}
                    max={500}
                    step={1}
                    value={[distance]}
                    onValueChange={(value) => setDistance(value[0])}
                />
                 <div className="text-center text-sm font-medium">
                    Show listings within {distance} km
                 </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="all" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r-all" />
              <Label htmlFor="r-all">All</Label>
            </div>
            {CONDITIONS.map((c) => (
              <div key={c.value} className="flex items-center space-x-2">
                <RadioGroupItem value={c.value} id={`r-${c.value}`} />
                <Label htmlFor={`r-${c.value}`}>{c.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RAM</CardTitle>
        </CardHeader>
        <CardContent>
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Any RAM" />
                </SelectTrigger>
                <SelectContent>
                {RAM_OPTIONS.map((ram) => (
                    <SelectItem key={ram} value={String(ram)}>
                    {ram} GB
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent>
        <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any Storage" />
            </SelectTrigger>
            <SelectContent>
              {STORAGE_OPTIONS.map((storage) => (
                <SelectItem key={storage} value={String(storage)}>
                  {storage >= 1024 ? `${storage/1024} TB` : `${storage} GB`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="flex-1">Apply Filters</Button>
        <Button variant="ghost" className="flex-1">Reset</Button>
      </div>
    </div>
  );
}
