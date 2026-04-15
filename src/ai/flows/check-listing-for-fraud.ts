'use server';
/**
 * @fileOverview An AI agent for detecting fraudulent or suspicious listings.
 *
 * - checkListingForFraud - A function that handles the listing fraud detection process.
 * - CheckListingForFraudInput - The input type for the checkListingForFraud function.
 * - CheckListingForFraudOutput - The return type for the checkListingForFraud function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CheckListingForFraudInputSchema = z.object({
  title: z.string().describe('The title of the listing.'),
  description: z.string().describe('The description of the listing.'),
  price: z.number().describe('The asking price of the item.'),
  brand: z.string().describe('The brand of the mobile phone.'),
  model: z.string().describe('The model of the mobile phone.'),
});
export type CheckListingForFraudInput = z.infer<typeof CheckListingForFraudInputSchema>;

const CheckListingForFraudOutputSchema = z.object({
  isSuspicious: z.boolean().describe('Whether the listing is deemed suspicious.'),
  confidence: z.number().min(0).max(1).describe('The confidence score (0-1) of the detection.'),
  flags: z.array(z.string()).describe('A list of flags indicating specific issues found.'),
  reason: z.string().describe('A brief explanation of why the listing was flagged as suspicious.'),
});
export type CheckListingForFraudOutput = z.infer<typeof CheckListingForFraudOutputSchema>;

export async function checkListingForFraud(input: CheckListingForFraudInput): Promise<CheckListingForFraudOutput> {
  return checkListingForFraudFlow(input);
}

const checkListingFraudPrompt = ai.definePrompt({
  name: 'checkListingFraudPrompt',
  input: { schema: CheckListingForFraudInputSchema },
  output: { schema: CheckListingForFraudOutputSchema },
  prompt: `You are a fraud detection system for a used mobile marketplace. Analyze: Title={{{title}}}, Description={{{description}}}, Price={{{price}}} INR, Brand={{{brand}}}, Model={{{model}}}. Check for: unrealistically low price, suspicious description, copy-paste spam, misleading specs. Return ONLY valid JSON: { "isSuspicious": Boolean, "confidence": Number, "flags": ["string"], "reason": "string" }`,
});

const checkListingForFraudFlow = ai.defineFlow(
  {
    name: 'checkListingForFraudFlow',
    inputSchema: CheckListingForFraudInputSchema,
    outputSchema: CheckListingForFraudOutputSchema,
  },
  async (input) => {
    const { output } = await checkListingFraudPrompt(input);
    return output!;
  }
);
