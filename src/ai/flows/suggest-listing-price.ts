'use server';
/**
 * @fileOverview A Genkit flow for suggesting a resale price range for a used smartphone listing.
 *
 * - suggestListingPrice - A function that handles the AI price suggestion process.
 * - SuggestListingPriceInput - The input type for the suggestListingPrice function.
 * - SuggestListingPriceOutput - The return type for the suggestListingPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestListingPriceInputSchema = z.object({
  brand: z.string().describe('The brand of the smartphone (e.g., Apple, Samsung, OnePlus).'),
  model: z.string().describe('The model of the smartphone (e.g., iPhone 15 Pro).'),
  ram: z.number().describe('The RAM of the smartphone in GB.'),
  storage: z.number().describe('The storage of the smartphone in GB.'),
  condition: z.enum(['new', 'like_new', 'good', 'fair']).describe('The physical condition of the smartphone.'),
  purchaseYear: z.number().describe('The year the smartphone was purchased.'),
});
export type SuggestListingPriceInput = z.infer<typeof SuggestListingPriceInputSchema>;

const SuggestListingPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The AI-suggested fair resale price in Indian Rupees (INR).'),
  minPrice: z.number().describe('The minimum suggested resale price in INR.'),
  maxPrice: z.number().describe('The maximum suggested resale price in INR.'),
  reasoning: z.string().describe('A one-sentence explanation for the price suggestion.'),
});
export type SuggestListingPriceOutput = z.infer<typeof SuggestListingPriceOutputSchema>;

export async function suggestListingPrice(input: SuggestListingPriceInput): Promise<SuggestListingPriceOutput> {
  return suggestListingPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestListingPricePrompt',
  input: {schema: SuggestListingPriceInputSchema},
  output: {schema: SuggestListingPriceOutputSchema},
  prompt: `You are a smartphone resale pricing expert for the Indian market. Given: Brand={{{brand}}}, Model={{{model}}}, RAM={{{ram}}}GB, Storage={{{storage}}}GB, Condition={{{condition}}} (scale: new > like_new > good > fair), Purchase Year={{{purchaseYear}}}. Today's year=2026. Calculate fair market resale price in INR. Return ONLY valid JSON (no markdown): { "suggestedPrice": Number, "minPrice": Number, "maxPrice": Number, "reasoning": "one sentence" }`
});

const suggestListingPriceFlow = ai.defineFlow(
  {
    name: 'suggestListingPriceFlow',
    inputSchema: SuggestListingPriceInputSchema,
    outputSchema: SuggestListingPriceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
