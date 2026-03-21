// In-App Purchase Service for Curiosity Hour
// Handles StoreKit (iOS) and Play Billing (Android) integration

import * as IAP from 'expo-iap';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// TYPES
// ============================================

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAmount: number;
  priceCurrencyCode: string;
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  error?: string;
}

// Pack ID mapping - these are the product IDs in App Store Connect / Play Console
export const PACK_PRODUCT_IDS = {
  intimate: 'com.curiosityhour.pack.intimate',
  nsfw: 'com.curiosityhour.pack.nsfw',
  spicy: 'com.curiosityhour.pack.spicy',
  remove_ads: 'com.curiosityhour.remove_ads',
  premium: 'com.curiosityhour.premium',
} as const;

// Pack metadata
export const PACK_INFO = {
  intimate: {
    id: 'intimate',
    name: 'Intimate Pack',
    description: 'Personal questions to build deeper intimacy with your partner',
    price: '$1.99',
    icon: '❤️',
    color: '#d53f8c',
  },
  nsfw: {
    id: 'nsfw',
    name: 'NSFW Pack',
    description: 'Adult questions for open-minded couples',
    price: '$1.99',
    icon: '⚠️',
    color: '#ec4899',
  },
  spicy: {
    id: 'spicy',
    name: 'Spicy Pack',
    description: 'Bold questions to spice things up',
    price: '$1.99',
    icon: '🌶️',
    color: '#e94560',
  },
  remove_ads: {
    id: 'remove_ads',
    name: 'Remove Ads',
    description: 'Enjoy an ad-free experience',
    price: '$0.99',
    icon: '🚫',
    color: '#805ad5',
  },
  premium: {
    id: 'premium',
    name: 'Premium Bundle',
    description: 'All question packs + Remove Ads at a special price',
    price: '$3.99',
    icon: '👑',
    color: '#ffd700',
  },
} as const;

export type PackId = keyof typeof PACK_PRODUCT_IDS;

// Storage key for purchased entitlements
const ENTITLEMENTS_STORAGE_KEY = '@curiosity/entitlements';

// ============================================
// SERVICE STATE
// ============================================

let isInitialized = false;
let products: IAP.Product[] = [];
let purchaseListener: IAP.Subscription | null = null;

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the IAP service and establish connection with the store
 */
export async function initializeIAP(): Promise<boolean> {
  if (isInitialized) {
    console.log('[IAP] Already initialized');
    return true;
  }

  try {
    console.log('[IAP] Initializing...');
    
    // Check if IAP is available on this device
    const available = await IAP.getCanFetch();
    if (!available) {
      console.warn('[IAP] In-app purchases not available on this device');
      return false;
    }

    // Connect to the store
    await IAP.connectToStore();
    console.log('[IAP] Connected to store');
    
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('[IAP] Failed to initialize:', error);
    return false;
  }
}

/**
 * End connection to the store (call when app unmounts)
 */
export async function endIAP(): Promise<void> {
  if (!isInitialized) return;
  
  try {
    if (purchaseListener) {
      purchaseListener.remove();
      purchaseListener = null;
    }
    await IAP.disconnectStore();
    isInitialized = false;
    console.log('[IAP] Disconnected from store');
  } catch (error) {
    console.error('[IAP] Error ending IAP:', error);
  }
}

// ============================================
// PRODUCTS
// ============================================

/**
 * Fetch available products from the store
 */
export async function getProducts(): Promise<Product[]> {
  if (!isInitialized) {
    console.warn('[IAP] IAP not initialized, cannot fetch products');
    return [];
  }

  try {
    const productIds = Object.values(PACK_PRODUCT_IDS);
    console.log('[IAP] Fetching products:', productIds);
    
    products = await IAP.getProducts({ productIds });
    console.log('[IAP] Products fetched:', products.length);
    
    return products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      priceAmount: p.priceAmount,
      priceCurrencyCode: p.priceCurrencyCode,
    }));
  } catch (error) {
    console.error('[IAP] Failed to fetch products:', error);
    return [];
  }
}

// ============================================
// PURCHASES
// ============================================

/**
 * Purchase a product by its ID
 */
export async function purchasePack(packId: string): Promise<PurchaseResult> {
  if (!isInitialized) {
    return { success: false, error: 'IAP not initialized' };
  }

  try {
    const product = products.find(p => p.id === packId);
    if (!product) {
      // Try to fetch products first
      await getProducts();
      const retryProduct = products.find(p => p.id === packId);
      if (!retryProduct) {
        return { success: false, error: 'Product not found' };
      }
      return initiatePurchase(retryProduct.id);
    }
    
    return await initiatePurchase(product.id);
  } catch (error: any) {
    console.error('[IAP] Purchase failed:', error);
    
    // Handle specific error codes
    if (error.code === 'E_USER_CANCELLED') {
      return { success: false, error: 'Purchase cancelled' };
    }
    if (error.code === 'E_ALREADY_OWNED') {
      // Item already owned, treat as success
      return { success: true, productId: packId };
    }
    
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

async function initiatePurchase(productId: string): Promise<PurchaseResult> {
  try {
    console.log('[IAP] Initiating purchase for:', productId);
    
    // Request purchase
    const result = await IAP.requestPurchase({ sku: productId });
    console.log('[IAP] Purchase result:', result);
    
    // Parse the result - IAP returns { transactionId, productId } on success
    if (result && result.productId) {
      // Mark as purchased locally
      await addPurchaseToStorage(productId);
      
      return {
        success: true,
        productId: productId,
      };
    }
    
    return { success: false, error: 'Unknown purchase result' };
  } catch (error: any) {
    console.error('[IAP] Purchase error:', error);
    
    if (error.code === 'E_ALREADY_OWNED' || error.code === 'E_IAP_PURCHASED') {
      // Already owned - add to storage and return success
      await addPurchaseToStorage(productId);
      return { success: true, productId };
    }
    
    if (error.code === 'E_USER_CANCELLED') {
      return { success: false, error: 'Purchase cancelled' };
    }
    
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

// ============================================
// RESTORE PURCHASES
// ============================================

/**
 * Restore all previous purchases
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (!isInitialized) {
    return { success: false, error: 'IAP not initialized' };
  }

  try {
    console.log('[IAP] Restoring purchases...');
    
    const purchases = await IAP.getProducts(Object.values(PACK_PRODUCT_IDS));
    
    // Get all previous transactions
    const history = await IAP.getPurchaseHistory();
    console.log('[IAP] Purchase history:', history?.length || 0, 'transactions');
    
    if (!history || history.length === 0) {
      console.log('[IAP] No previous purchases found');
      return { success: true, productId: undefined };
    }
    
    // Add all restored purchases to storage
    const restoredIds: string[] = [];
    for (const transaction of history) {
      if (transaction.productId) {
        await addPurchaseToStorage(transaction.productId);
        restoredIds.push(transaction.productId);
      }
    }
    
    console.log('[IAP] Restored purchases:', restoredIds);
    
    return {
      success: true,
      productId: restoredIds.length > 0 ? restoredIds.join(',') : undefined,
    };
  } catch (error: any) {
    console.error('[IAP] Restore failed:', error);
    
    if (error.code === 'E_USER_CANCELLED') {
      return { success: false, error: 'Restore cancelled' };
    }
    
    return { success: false, error: error.message || 'Restore failed' };
  }
}

// ============================================
// ENTITLEMENT CHECK
// ============================================

/**
 * Check if user has purchased a specific pack
 */
export function isPurchased(productId: string): boolean {
  // Check free packs
  const freePacks = ['deep', 'funny', 'nostalgia', 'would-you-rather'];
  if (freePacks.includes(productId)) {
    return true;
  }
  
  // Check in storage (sync check)
  try {
    const stored = AsyncStorage.getItemSync(ENTITLEMENTS_STORAGE_KEY);
    if (stored) {
      const purchases: string[] = JSON.parse(stored);
      return purchases.includes(productId);
    }
  } catch (error) {
    console.error('[IAP] Error checking purchase status:', error);
  }
  
  return false;
}

/**
 * Get all purchased pack IDs
 */
export async function getPurchasedPacks(): Promise<string[]> {
  try {
    // Free packs are always included
    const freePacks = ['deep', 'funny', 'nostalgia', 'would-you-rather'];
    const stored = await AsyncStorage.getItem(ENTITLEMENTS_STORAGE_KEY);
    const purchased: string[] = stored ? JSON.parse(stored) : [];
    
    return [...new Set([...freePacks, ...purchased])];
  } catch (error) {
    console.error('[IAP] Error getting purchased packs:', error);
    return ['deep', 'funny', 'nostalgia', 'would-you-rather'];
  }
}

// ============================================
// STORAGE HELPERS
// ============================================

async function addPurchaseToStorage(productId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(ENTITLEMENTS_STORAGE_KEY);
    const purchases: string[] = stored ? JSON.parse(stored) : [];
    
    if (!purchases.includes(productId)) {
      purchases.push(productId);
      await AsyncStorage.setItem(ENTITLEMENTS_STORAGE_KEY, JSON.stringify(purchases));
      console.log('[IAP] Added purchase to storage:', productId);
    }
  } catch (error) {
    console.error('[IAP] Error saving purchase:', error);
  }
}

// ============================================
// UTILITY
// ============================================

/**
 * Get product info from product ID
 */
export function getProductInfo(productId: string): typeof PACK_INFO[keyof typeof PACK_INFO] | null {
  const entry = Object.entries(PACK_PRODUCT_IDS).find(([, id]) => id === productId);
  if (!entry) return null;
  return PACK_INFO[entry[0] as keyof typeof PACK_INFO] || null;
}

/**
 * Get pack ID from product ID
 */
export function getPackIdFromProductId(productId: string): string | null {
  const entry = Object.entries(PACK_PRODUCT_IDS).find(([, id]) => id === productId);
  return entry ? entry[0] : null;
}

export default {
  initializeIAP,
  endIAP,
  getProducts,
  purchasePack,
  restorePurchases,
  isPurchased,
  getPurchasedPacks,
  getProductInfo,
  getPackIdFromProductId,
  PACK_PRODUCT_IDS,
  PACK_INFO,
};
