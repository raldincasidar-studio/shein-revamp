import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../components/shopping/ShoppingPage';

const PRODUCTS_COLLECTION = 'products';

const categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
const colorsList = ['Black', 'White', 'Red', 'Blue', 'Green', 'Beige', 'Pink'];
const sizesList = ['XS', 'S', 'M', 'L', 'XL'];

const images = [
  'https://images.unsplash.com/photo-1515372036736-aca5ca8f5b15?w=500&q=80',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80',
  'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=500&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80',
  'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=500&q=80',
  'https://images.unsplash.com/photo-1507680434267-dbd122b82d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1571513722275-4b41940f54b4?w=500&q=80'
];

const topsNames = ['Rib-Knit Crop Top', 'Oversized Cotton Tee', 'Satin Camisole', 'Chunky Knit Sweater', 'Linen Button-Up'];
const bottomsNames = ['Wide Leg Trousers', 'High Rise Denim Jeans', 'Pleated Mini Skirt', 'Tailored Shorts', 'Maxi Slip Skirt'];
const dressesNames = ['Floral Midi Dress', 'Slinky Maxi Dress', 'Tiered Cotton Dress', 'Wrap Mini Dress', 'Knit Sweater Dress'];
const shoesNames = ['Chunky Sneakers', 'Strappy Heels', 'Leather Loafers', 'Knee-High Boots', 'Platform Sandals'];
const accessoriesNames = ['Cat-Eye Sunglasses', 'Gold Hoop Earrings', 'Layered Necklace Set', 'Leather Crossbody Bag', 'Silk Hair Scarf'];

const getRandomName = (category: string) => {
  switch (category) {
    case 'Tops': return topsNames[Math.floor(Math.random() * topsNames.length)];
    case 'Bottoms': return bottomsNames[Math.floor(Math.random() * bottomsNames.length)];
    case 'Dresses': return dressesNames[Math.floor(Math.random() * dressesNames.length)];
    case 'Shoes': return shoesNames[Math.floor(Math.random() * shoesNames.length)];
    case 'Accessories': return accessoriesNames[Math.floor(Math.random() * accessoriesNames.length)];
    default: return 'Trendy Fashion Item';
  }
};

export const seedProducts = async (): Promise<void> => {
  try {
    const productsToSeed: Omit<Product, 'id'>[] = [];
    
    // Generate 40 random products
    for (let i = 0; i < 40; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const name = getRandomName(category) + ' ' + (Math.floor(Math.random() * 100) + 1);
        const imageUrl = images[Math.floor(Math.random() * images.length)];
        
        productsToSeed.push({
            name,
            price: Number((Math.random() * 80 + 10).toFixed(2)),
            rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
            reviews: Math.floor(Math.random() * 900) + 10,
            sold: Math.floor(Math.random() * 5000) + 50,
            imageUrl,
            category,
            description: `This stylish ${name.toLowerCase()} is a must-have for your wardrobe. Features high-quality materials and exquisite craftsmanship to ensure comfort and durability. Perfect for any occasion.`,
            sizes: category === 'Accessories' ? [] : [sizesList[Math.floor(Math.random() * 2)], sizesList[Math.floor(Math.random() * 2) + 2], sizesList[4]],
            colors: [colorsList[Math.floor(Math.random() * 3)], colorsList[Math.floor(Math.random() * 4) + 3]]
        });
    }

    for (const product of productsToSeed) {
      await addDoc(collection(db, PRODUCTS_COLLECTION), product);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
