"use server";

import {
  suggestListingPrice,
  type SuggestListingPriceInput,
  type SuggestListingPriceOutput,
} from "@/ai/flows/suggest-listing-price";
import { z } from "zod";

export type PriceSuggestion = SuggestListingPriceOutput;
export type { SuggestListingPriceInput };

const PriceSuggestionSchema = z.object({
  brand: z.string(),
  model: z.string(),
  ram: z.coerce.number(),
  storage: z.coerce.number(),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  purchaseYear: z.coerce.number(),
});

export async function getSuggestedPrice(
  input: SuggestListingPriceInput
): Promise<{ data: PriceSuggestion | null; error: string | null }> {
  const parsed = PriceSuggestionSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: "Invalid input." };
  }

  try {
    const suggestion = await suggestListingPrice(parsed.data);
    return { data: suggestion, error: null };
  } catch (error) {
    console.error("AI price suggestion failed:", error);
    return {
      data: null,
      error: "Failed to get price suggestion from AI. Please try again.",
    };
  }
}
