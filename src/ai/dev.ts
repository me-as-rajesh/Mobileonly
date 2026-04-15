import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-listing-price.ts';
import '@/ai/flows/detect-chat-spam.ts';
import '@/ai/flows/check-listing-for-fraud.ts';