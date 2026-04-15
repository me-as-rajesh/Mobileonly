'use server';

import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {FieldValue} from 'firebase-admin/firestore';

export async function startConversation(listingId: string, sellerId: string, listingDetails: {title: string, price: number, image: string}) {
  const token = await auth.verifyIdToken(''); // This needs a real token from the client
  const buyerId = token.uid;

  if (buyerId === sellerId) {
    return { error: "You cannot start a conversation with yourself." };
  }

  const conversationId = [listingId, buyerId, sellerId].sort().join('_');
  const conversationRef = firestore.collection('conversations').doc(conversationId);
  const conversationDoc = await conversationRef.get();

  if (!conversationDoc.exists) {
    const buyerProfile = await auth.getUser(buyerId);
    const sellerProfile = await auth.getUser(sellerId);
    
    await conversationRef.set({
      listingId,
      buyerId,
      sellerId,
      participants: [buyerId, sellerId],
      createdAt: FieldValue.serverTimestamp(),
      lastMessageAt: FieldValue.serverTimestamp(),
      lastMessageText: '',
      listingTitle: listingDetails.title,
      listingPrice: listingDetails.price,
      listingImage: listingDetails.image,
      buyerName: buyerProfile.displayName,
      buyerAvatar: buyerProfile.photoURL,
      sellerName: sellerProfile.displayName,
      sellerAvatar: sellerProfile.photoURL,
    });
  }

  redirect(`/messages/${conversationId}`);
}
