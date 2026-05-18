import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  category: string;
}

export interface Order {
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: unknown;
}

export async function saveOrder(
  userId: string,
  userEmail: string,
  items: OrderItem[],
  subtotal: number
): Promise<string> {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const order: Omit<Order, 'createdAt'> & { createdAt: unknown } = {
    userId,
    userEmail,
    items,
    totalItems: items.length,
    totalQuantity,
    subtotal,
    status: 'pending',
    createdAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, 'orders'), order);
  return ref.id;
}
