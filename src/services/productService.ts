import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../components/shopping/ShoppingPage';

const PRODUCTS_COLLECTION = 'products';

interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fetch all products
export const getTrendingProducts = async (limitCount: number = 4): Promise<Product[]> => {
  try {
    const { query, orderBy, limit } = await import('firebase/firestore');
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('sold', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    handleFirestoreError(error, 'list', PRODUCTS_COLLECTION);
    return [];
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    handleFirestoreError(error, 'get', PRODUCTS_COLLECTION);
    return [];
  }
};

export const getRelatedProducts = async (limitCount: number = 5): Promise<Product[]> => {
  try {
    const { query, limit } = await import('firebase/firestore');
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    handleFirestoreError(error, 'list', PRODUCTS_COLLECTION);
    return [];
  }
};

// Add a product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', PRODUCTS_COLLECTION);
    return '';
  }
};

// Update a product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, product);
  } catch (error) {
    handleFirestoreError(error, 'update', `${PRODUCTS_COLLECTION}/${id}`);
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    handleFirestoreError(error, 'delete', `${PRODUCTS_COLLECTION}/${id}`);
  }
};
