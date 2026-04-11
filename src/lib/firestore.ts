import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
  title?: string;
  active: boolean;
}


export interface Product {
  id: string;
  name: string;
  description?: string;
  prices: Record<string, number>;
  offerPrices?: Record<string, number>;
  imageUrls: string[];
  categoryId: string;
  isAvailable: boolean;
  isOnOffer: boolean;
  unit: string;
  colors: string[];
  sizes: string[];
  isInstantDelivery: boolean;
  offerDescription?: string;
  isHidden?: boolean;
  createdAt?: any;
}


export interface PackageItem {
  name: string;
  details: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  prices: Record<string, number>;
  offerPrices?: Record<string, number>;
  imageUrls: string[];
  items: PackageItem[];
  isOnOffer: boolean;
  numPieces: number;
  createdAt?: any;
}


export interface OrderProduct {
  name: string;
  imageUrls?: string[];
  imageUrl?: string;
  quantity: number;
  priceAtPurchase?: number;
  totalItemPrice?: number;
  currencyAtPurchase?: string;
}

export interface Order {
  id?: string;
  userId: string;
  productsList: OrderProduct[];
  status: string;
  orderDate: Date;
  customerName: string;
  customerEmail: string;
  shippingAddress?: Record<string, any>;
  totalPrices: Record<string, number>;
  subtotals: Record<string, number>;
  deliveryFees?: Record<string, number>;
  statusHistory?: any[];
}



export interface Notification {
  id?: string;
  title: string;
  body: string;
  topic: string;
  sentAt: Date;
  sentBy: string;
  status: string;
}

export interface StoreSettings {
  storeName?: string;
  supportPhone?: string;
  supportEmail?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  address?: string;
  storeDescription?: string;
  storePolicies?: string;
  website?: string;
  logoUrl?: string;
}


export interface Policy {
  id: string;
  title: string;
  content: string;
  icon?: string;
  order?: number;
}



// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDate(val: Timestamp | Date | null | undefined): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  return val;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(db, 'categories'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export async function getBanners(): Promise<Banner[]> {
  try {
    const q = query(collection(db, 'banners'), where('active', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
  } catch (e) {
    console.error('Error fetching banners:', e);
    return [];
  }
}


// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(lim = 20): Promise<Product[]> {
  const q = query(collection(db, 'products'), limit(lim));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}


export async function getLatestProducts(lim = 8): Promise<Product[]> {
  const q = query(
    collection(db, 'products'), 
    orderBy('name'), // Usually we would use createdAt if available
    limit(lim)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}


export async function getOfferProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('isOnOffer', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export async function getPackages(): Promise<Package[]> {
  const snap = await getDocs(collection(db, 'packages'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Package));
}

export async function getPackageById(id: string): Promise<Package | null> {
  const snap = await getDoc(doc(db, 'packages', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Package;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    orderDate: Timestamp.fromDate(order.orderDate),
  });
  return docRef.id;
}

export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
) {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('orderDate', 'desc')
  );
  return onSnapshot(q, (snap: QuerySnapshot) => {
    const orders = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        orderDate: toDate(data.orderDate),
      } as Order;
    });
    callback(orders);
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function subscribeToNotifications(
  userId: string,
  callback: (notifs: Notification[]) => void
) {
  const q = query(
    collection(db, 'notifications'),
    orderBy('sentAt', 'desc')
  );
  return onSnapshot(q, (snap: QuerySnapshot) => {
    const all = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        sentAt: toDate(data.sentAt),
      } as Notification;
    });
    const filtered = all.filter(
      n => n.topic === 'all' || n.topic === `user_${userId}`
    );
    callback(filtered);
  });
}

// ─── Store Settings ───────────────────────────────────────────────────────────

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'store'));
    if (snap.exists()) return snap.data() as StoreSettings;
  } catch (_) {}
  return {};
}

// ─── Policies ─────────────────────────────────────────────────────────────────

export async function getPolicies(): Promise<Policy[]> {
  try {
    const q = query(collection(db, 'policies'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Policy));
  } catch (e) {
    console.error('Error fetching policies:', e);
    return [];
  }
}

