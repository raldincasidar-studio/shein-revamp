import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../components/shopping/ShoppingPage';

const PRODUCTS_COLLECTION = 'products';

const categories = [
  'Women', 'Women Clothing', 'Men', 'Men clothing', 'Kids',
  'New In', 'Sale', 'Just for You', 'Beachwear', 'Curve',
  'Shoes', 'Jewelry & Accessories', 'Underwear & Sleepwear',
  'Baby & Maternity', 'Bags & Luggage', 'Home & Living',
  'Beauty & Health', 'Sports & Outdoors', 'Home Textiles',
  'Tools & Home Improvement', 'Pet Supplies',
  'Tops', 'Bottoms', 'Dresses', 'Accessories',
];

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

const namesByCategory: Record<string, string[]> = {
  'Tops': ['Rib-Knit Crop Top', 'Oversized Cotton Tee', 'Satin Camisole', 'Chunky Knit Sweater', 'Linen Button-Up'],
  'Bottoms': ['Wide Leg Trousers', 'High Rise Denim Jeans', 'Pleated Mini Skirt', 'Tailored Shorts', 'Maxi Slip Skirt'],
  'Dresses': ['Floral Midi Dress', 'Slinky Maxi Dress', 'Tiered Cotton Dress', 'Wrap Mini Dress', 'Knit Sweater Dress'],
  'Shoes': ['Chunky Sneakers', 'Strappy Heels', 'Leather Loafers', 'Knee-High Boots', 'Platform Sandals'],
  'Accessories': ['Cat-Eye Sunglasses', 'Gold Hoop Earrings', 'Layered Necklace Set', 'Leather Crossbody Bag', 'Silk Hair Scarf'],
  'Women': ['Floral Wrap Dress', 'Lace Bodysuit', 'Satin Midi Skirt', 'Cropped Blazer', 'Ribbed Leggings'],
  'Women Clothing': ['Smocked Sundress', 'Puff Sleeve Top', 'Wide Leg Palazzo', 'Corset Mini Dress', 'Off-Shoulder Blouse'],
  'Men': ['Classic Oxford Shirt', 'Slim Chino Pants', 'Graphic Print Tee', 'Linen Blazer', 'Cargo Shorts'],
  'Men clothing': ['Flannel Check Shirt', 'Athletic Joggers', 'Denim Jacket', 'Polo Shirt', 'Knit Cardigan'],
  'Kids': ['Cartoon Print Tee', 'Ruffled Party Dress', 'Denim Overalls', 'Striped Hoodie', 'School Uniform Set'],
  'New In': ['Mesh Ballet Flats', 'Ruched Bandeau Top', 'Faux Leather Pants', 'Pastel Varsity Jacket', 'Sheer Overlay Dress'],
  'Sale': ['Basic V-Neck Tee', 'Elastic Waist Shorts', 'Simple Slip Dress', 'Plain Hoodie', 'Cotton Joggers'],
  'Just for You': ['Personalized Tote Bag', 'Monogram Bracelet', 'Custom Print Hoodie', 'Initials Necklace', 'Bespoke Scarf'],
  'Beachwear': ['Tie-Dye Bikini', 'Crochet Cover-Up', 'Tropical Print Swimsuit', 'Beach Sarong', 'Rash Guard Set'],
  'Curve': ['Plus Size Wrap Dress', 'Curve Fit Jeans', 'Stretchy Bodycon Dress', 'Full Figure Swimwear', 'Wide Leg Culottes'],
  'Jewelry & Accessories': ['Pearl Stud Earrings', 'Charm Bracelet', 'Statement Ring', 'Chain Belt', 'Velvet Headband'],
  'Underwear & Sleepwear': ['Satin Pajama Set', 'Lace Bralette', 'Cozy Robe', 'Seamless Brief Set', 'Thermal Sleep Shirt'],
  'Baby & Maternity': ['Baby Onesie Set', 'Maternity Wrap Top', 'Nursing Bra', 'Baby Romper', 'Maternity Leggings'],
  'Bags & Luggage': ['Mini Shoulder Bag', 'Laptop Backpack', 'Canvas Tote', 'Spinner Suitcase', 'Fanny Pack'],
  'Home & Living': ['Linen Throw Pillow', 'Scented Candle Set', 'Ceramic Mug Set', 'Wall Art Print', 'Woven Basket'],
  'Beauty & Health': ['Vitamin C Serum', 'Moisturizing Face Mask', 'Lip Gloss Set', 'Jade Roller', 'Aromatherapy Diffuser'],
  'Sports & Outdoors': ['Yoga Mat', 'Sports Water Bottle', 'Running Shorts', 'Resistance Band Set', 'Gym Duffle Bag'],
  'Home Textiles': ['Sherpa Fleece Blanket', 'Cotton Bedsheet Set', 'Velvet Curtains', 'Memory Foam Pillow', 'Bath Towel Set'],
  'Tools & Home Improvement': ['Multifunction Tool Set', 'LED Desk Lamp', 'Storage Organizer', 'Cable Management Kit', 'Mini Toolkit'],
  'Pet Supplies': ['Dog Harness', 'Cat Scratching Post', 'Pet Food Bowl Set', 'Dog Plush Toy', 'Bird Cage Cover'],
};

const getRandomName = (category: string): string => {
  const names = namesByCategory[category] || namesByCategory['Tops'];
  return names[Math.floor(Math.random() * names.length)];
};

const noSizeCategories = new Set([
  'Accessories', 'Jewelry & Accessories', 'Baby & Maternity', 'Bags & Luggage',
  'Home & Living', 'Beauty & Health', 'Home Textiles', 'Tools & Home Improvement', 'Pet Supplies',
]);

export const seedProducts = async (): Promise<void> => {
  try {
    const productsToSeed: Omit<Product, 'id'>[] = [];

    for (let i = 0; i < 40; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const name = getRandomName(category) + ' ' + (Math.floor(Math.random() * 100) + 1);
      const imageUrl = images[Math.floor(Math.random() * images.length)];

      productsToSeed.push({
        name,
        price: Number((Math.random() * 80 + 10).toFixed(2)),
        rating: Number((Math.random() * 2 + 3).toFixed(1)),
        reviews: Math.floor(Math.random() * 900) + 10,
        sold: Math.floor(Math.random() * 5000) + 50,
        imageUrl,
        category,
        description: `This stylish ${name.toLowerCase()} is a must-have for your wardrobe. Features high-quality materials and exquisite craftsmanship to ensure comfort and durability. Perfect for any occasion.`,
        sizes: noSizeCategories.has(category) ? [] : [sizesList[Math.floor(Math.random() * 2)], sizesList[Math.floor(Math.random() * 2) + 2], sizesList[4]],
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
