'use server';
/**
 * @fileOverview A chat spam detection AI agent.
 *
 * - detectChatSpam - A function that handles the chat spam detection process.
 * - DetectChatSpamInput - The input type for the detectChatSpam function.
 * - DetectChatSpamOutput - The return type for the detectChatSpam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectChatSpamInputSchema = z.object({
  senderId: z.string().describe('The ID of the message sender.'),
  receiverId: z.string().describe('The ID of the message receiver.'),
  messageText: z.string().describe('The content of the chat message to analyze.'),
});
export type DetectChatSpamInput = z.infer<typeof DetectChatSpamInputSchema>;

const DetectChatSpamOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether the message is detected as spam or fraudulent.'),
  confidence: z.number().describe('A confidence score (0-1) for the spam detection.'),
  flags: z.array(z.string()).describe('A list of flags or categories for the detected spam.'),
  reason: z.string().describe('A brief explanation for why the message was flagged as spam.'),
});
export type DetectChatSpamOutput = z.infer<typeof DetectChatSpamOutputSchema>;

export async function detectChatSpam(input: DetectChatSpamInput): Promise<DetectChatSpamOutput> {
  return detectChatSpamFlow(input);
}

const detectChatSpamPrompt = ai.definePrompt({
  name: 'detectChatSpamPrompt',
  input: {schema: DetectChatSpamInputSchema},
  output: {schema: DetectChatSpamOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an AI-powered spam and fraud detection system for a peer-to-peer mobile marketplace chat. Your goal is to identify and flag messages that are suspicious, fraudulent, or spammy to protect users.

Analyze the following chat message for potential spam, fraud, phishing attempts, or inappropriate content. Consider common marketplace scams, attempts to move conversations off-platform too quickly, or irrelevant promotions.

Message from sender '{{{senderId}}}' to receiver '{{{receiverId}}}': "{{{messageText}}}"

Return ONLY valid JSON (no markdown) following the provided schema. If the message appears suspicious, set isSpam to true, provide a confidence score between 0 and 1, list specific flags (e.g., "off-platform communication", "unrealistic offer", "phishing"), and a concise reason.`,
});

const detectChatSpamFlow = ai.defineFlow(
  {
    name: 'detectChatSpamFlow',
    inputSchema: DetectChatSpamInputSchema,
    outputSchema: DetectChatSpamOutputSchema,
  },
  async input => {
    const {output} = await detectChatSpamPrompt(input);
    return output!;
  }
);
