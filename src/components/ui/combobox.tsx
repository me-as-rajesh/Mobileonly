"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "./scroll-area"

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsMessage?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  noResultsMessage = "No results found.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          {value ? selectedLabel : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2">
            <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
            />
        </div>
        <ScrollArea className="h-72">
          {filteredOptions.length > 0 ? (
            <div className="p-1">
                {filteredOptions.map((option) => (
                <Button
                    variant="ghost"
                    key={option.value}
                    onClick={() => {
                    onChange(option.value === value ? "" : option.value)
                    setOpen(false)
                    setSearch("")
                    }}
                    className="w-full justify-start font-normal h-auto py-2 px-2"
                >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                        )}
                    />
                    <div className="flex flex-col items-start">
                        {option.label}
                    </div>
                </Button>
                ))}
            </div>
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">{noResultsMessage}</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
