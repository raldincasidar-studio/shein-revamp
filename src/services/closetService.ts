import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ClosetItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  category: string;
  addedAt: Timestamp | null;
}

function closetCollection(userId: string) {
  return collection(db, 'closets', userId, 'items');
}

export async function addToCloset(
  userId: string,
  item: Omit<ClosetItem, 'addedAt'>
): Promise<void> {
  await setDoc(doc(db, 'closets', userId, 'items', item.productId), {
    ...item,
    addedAt: serverTimestamp()
  });
}

export async function removeFromCloset(userId: string, productId: string): Promise<void> {
  await deleteDoc(doc(db, 'closets', userId, 'items', productId));
}

export async function isInCloset(userId: string, productId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'closets', userId, 'items', productId));
  return snap.exists();
}

export async function getClosetItems(userId: string): Promise<ClosetItem[]> {
  const q = query(closetCollection(userId), orderBy('addedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ClosetItem);
}
