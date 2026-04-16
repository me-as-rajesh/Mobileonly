"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MapPin } from "lucide-react";
import type { FilterState } from "@/app/listings/client";
import { Combobox } from "@/components/ui/combobox";
import locationData from '../../states-and-districts.json';

const allDistricts: { label: string; value: string }[] = locationData.states.flatMap(s => s.districts.map(d => ({ label: `${d}, ${s.state}`, value: d })) );

interface FiltersProps {
  filters: FilterState;
  setFilters: (
    filters: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
  className?: string;
}

export function Filters({ filters, setFilters, className }: FiltersProps) {
  
  const handleReset = () => {
    setFilters({
      brand: "all",
      priceRange: [0, 150000],
      condition: "all",
      ram: null,
      storage: null,
      district: 'all',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.brand}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, brand: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
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
        <CardContent className="space-y-4 pt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString("en-IN")}</span>
            <span>₹{filters.priceRange[1].toLocaleString("en-IN")}</span>
          </div>
          <Slider
            min={0}
            max={150000}
            step={1000}
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            District
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <Combobox 
            options={[{label: "All Districts", value: "all"}, ...allDistricts]}
            value={filters.district}
            onChange={(value) => setFilters((prev) => ({ ...prev, district: value }))}
            placeholder="Select a district"
            searchPlaceholder="Search district..."
            noResultsMessage="No district found."
           />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={filters.condition}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, condition: value }))
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r-all" />
              <Label htmlFor="r-all" className="font-normal">All</Label>
            </div>
            {CONDITIONS.map((c) => (
              <div key={c.value} className="flex items-center space-x-2">
                <RadioGroupItem value={c.value} id={`r-${c.value}`} />
                <Label htmlFor={`r-${c.value}`} className="font-normal">{c.label}</Label>
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
          <Select
            value={String(filters.ram || 'all')}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, ram: value === 'all' ? null : Number(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any RAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any RAM</SelectItem>
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
          <Select
             value={String(filters.storage || 'all')}
             onValueChange={(value) =>
               setFilters((prev) => ({ ...prev, storage: value === 'all' ? null : Number(value) }))
             }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Storage" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">Any Storage</SelectItem>
              {STORAGE_OPTIONS.map((storage) => (
                <SelectItem key={storage} value={String(storage)}>
                  {storage >= 1024 ? `${storage / 1024} TB` : `${storage} GB`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button className="flex-1" onClick={handleReset} variant="secondary">Reset Filters</Button>
      </div>
    </div>
  );
}
