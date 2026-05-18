import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  category: string;
  addedAt: Timestamp | null;
}

export interface AddToCartPayload {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  category: string;
}

function cartCollection(userId: string) {
  return collection(db, 'carts', userId, 'items');
}

export async function addToCart(userId: string, payload: AddToCartPayload): Promise<string> {
  const existing = await getDocs(cartCollection(userId));
  const match = existing.docs.find(d => {
    const data = d.data();
    return (
      data.productId === payload.productId &&
      data.selectedSize === payload.selectedSize &&
      data.selectedColor === payload.selectedColor
    );
  });

  if (match) {
    const newQty = (match.data().quantity || 1) + payload.quantity;
    await updateDoc(match.ref, { quantity: newQty });
    return match.id;
  }

  const ref = await addDoc(cartCollection(userId), {
    ...payload,
    addedAt: serverTimestamp()
  });
  return ref.id;
}

export async function removeFromCart(userId: string, cartItemId: string): Promise<void> {
  await deleteDoc(doc(db, 'carts', userId, 'items', cartItemId));
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<void> {
  await updateDoc(doc(db, 'carts', userId, 'items', cartItemId), { quantity });
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const q = query(cartCollection(userId), orderBy('addedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<CartItem, 'id'>)
  }));
}

export function subscribeToCartCount(userId: string, onChange: (count: number) => void): Unsubscribe {
  return onSnapshot(cartCollection(userId), snap => {
    onChange(snap.size);
  });
}

export async function clearCartItems(userId: string, cartItemIds: string[]): Promise<void> {
  await Promise.all(cartItemIds.map(id => deleteDoc(doc(db, 'carts', userId, 'items', id))));
}
