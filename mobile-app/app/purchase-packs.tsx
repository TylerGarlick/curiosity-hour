// Purchase Packs Screen - Show available packs for purchase
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../src/constants/theme';
import { useQuestionBank } from '../src/context/QuestionBankContext';
import {
  initializeIAP,
  endIAP,
  getProducts,
  purchasePack,
  restorePurchases,
  getPurchasedPacks,
  PACK_INFO,
  PACK_PRODUCT_IDS,
  Product,
  PackId,
} from '../src/services/inAppPurchases';

interface PackDisplayInfo {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  isOwned: boolean;
  isFree: boolean;
}

export default function PurchasePacksScreen() {
  const router = useRouter();
  const { addEntitlement, isEntitled, getOwnedPacks, state } = useQuestionBank();

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize IAP
  useEffect(() => {
    let mounted = true;

    async function init() {
      setIsLoading(true);
      setError(null);

      const success = await initializeIAP();
      if (!mounted) return;

      if (success) {
        await loadProducts();
      } else {
        // IAP not available - still show UI with simulated data
        console.log('[Purchase] IAP not available, showing demo mode');
        setProducts([]);
      }

      setIsLoading(false);
    }

    init();

    return () => {
      mounted = false;
      endIAP();
    };
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      console.error('[Purchase] Failed to load products:', err);
      setError('Failed to load products');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, []);

  // Check if a pack is owned
  const checkOwned = (packId: string): boolean => {
    // Free packs are always owned
    const freePacks = ['deep', 'funny', 'nostalgia', 'would-you-rather'];
    if (freePacks.includes(packId)) return true;

    // Check from question bank context entitlements
    return isEntitled(packId as PackId);
  };

  // Get pack display info
  const getPackDisplayInfo = (): PackDisplayInfo[] => {
    const ownedPacks = getOwnedPacks();

    return [
      {
        id: 'intimate',
        name: 'Intimate Pack',
        description: 'Personal questions to build deeper intimacy with your partner',
        price: '$1.99',
        icon: '❤️',
        color: '#d53f8c',
        isOwned: checkOwned('intimate'),
        isFree: false,
      },
      {
        id: 'nsfw',
        name: 'NSFW Pack',
        description: 'Adult questions for open-minded couples',
        price: '$1.99',
        icon: '⚠️',
        color: '#ec4899',
        isOwned: checkOwned('nsfw'),
        isFree: false,
      },
      {
        id: 'spicy',
        name: 'Spicy Pack',
        description: 'Bold questions to spice things up',
        price: '$1.99',
        icon: '🌶️',
        color: '#e94560',
        isOwned: checkOwned('spicy'),
        isFree: false,
      },
      {
        id: 'remove_ads',
        name: 'Remove Ads',
        description: 'Enjoy an ad-free experience forever',
        price: '$0.99',
        icon: '🚫',
        color: '#805ad5',
        isOwned: state.entitlements.includes('remove_ads'),
        isFree: false,
      },
      {
        id: 'premium',
        name: 'Premium Bundle',
        description: 'All question packs + Remove Ads at a special price',
        price: '$3.99',
        icon: '👑',
        color: '#ffd700',
        isOwned: checkOwned('premium'),
        isFree: false,
      },
    ];
  };

  // Handle purchase
  const handlePurchase = async (packId: string) => {
    if (isPurchasing) return;

    setIsPurchasing(packId);

    try {
      // For demo/development, simulate purchase if IAP not available
      const productId = PACK_PRODUCT_IDS[packId as keyof typeof PACK_PRODUCT_IDS];
      
      if (!productId) {
        Alert.alert('Error', 'Invalid product');
        return;
      }

      const result = await purchasePack(productId);

      if (result.success) {
        // Unlock the pack in the question bank
        if (packId === 'premium') {
          // Premium unlocks all packs
          addEntitlement('intimate' as PackId);
          addEntitlement('nsfw' as PackId);
          addEntitlement('spicy' as PackId);
          addEntitlement('remove_ads' as PackId);
        } else {
          addEntitlement(packId as PackId);
        }

        Alert.alert(
          'Thank You! 🎉',
          `You've successfully unlocked the ${PACK_INFO[packId as keyof typeof PACK_INFO]?.name || 'pack'}!`,
          [{ text: 'OK' }]
        );
      } else if (result.error !== 'Purchase cancelled') {
        Alert.alert('Purchase Failed', result.error || 'Something went wrong');
      }
    } catch (error: any) {
      console.error('[Purchase] Error:', error);
      
      // For development: simulate successful purchase
      if (__DEV__) {
        if (packId === 'premium') {
          addEntitlement('intimate' as PackId);
          addEntitlement('nsfw' as PackId);
          addEntitlement('spicy' as PackId);
          addEntitlement('remove_ads' as PackId);
        } else {
          addEntitlement(packId as PackId);
        }
        
        Alert.alert(
          'Development Mode 🔧',
          `Simulated purchase of ${PACK_INFO[packId as keyof typeof PACK_INFO]?.name || packId}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', error.message || 'Purchase failed');
      }
    } finally {
      setIsPurchasing(null);
    }
  };

  // Handle restore
  const handleRestore = async () => {
    if (isRestoring) return;

    setIsRestoring(true);

    try {
      const result = await restorePurchases();

      if (result.success) {
        if (result.productId) {
          // Reload products and entitlements
          const purchasedPacks = await getPurchasedPacks();
          
          Alert.alert(
            'Restored! 🔄',
            'Your previous purchases have been restored.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'No Purchases Found',
            'No previous purchases were found to restore.',
            [{ text: 'OK' }]
          );
        }
      } else if (result.error !== 'Purchase cancelled') {
        Alert.alert('Restore Failed', result.error || 'Something went wrong');
      }
    } catch (error: any) {
      console.error('[Purchase] Restore error:', error);
      
      // For development: simulate restore
      if (__DEV__) {
        Alert.alert(
          'Development Mode 🔧',
          'Simulated restore (no actual purchases found)',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', error.message || 'Restore failed');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const packs = getPackDisplayInfo();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Get More Packs</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading store...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              💡 Deep Talk category is FREE. Unlock more question packs below!
            </Text>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* Pack Cards */}
          <View style={styles.packsContainer}>
            {packs.map((pack) => (
              <View
                key={pack.id}
                style={[
                  styles.packCard,
                  { borderLeftColor: pack.color },
                  pack.isOwned && styles.packCardOwned,
                ]}
              >
                <View style={styles.packHeader}>
                  <View style={styles.packIconContainer}>
                    <Text style={styles.packIcon}>{pack.icon}</Text>
                  </View>
                  <View style={styles.packInfo}>
                    <Text style={styles.packName}>{pack.name}</Text>
                    <Text style={styles.packPrice}>
                      {pack.isOwned ? '✓ Owned' : pack.price}
                    </Text>
                  </View>
                </View>

                <Text style={styles.packDescription}>{pack.description}</Text>

                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    pack.isOwned && styles.purchaseButtonOwned,
                    isPurchasing === pack.id && styles.purchaseButtonLoading,
                  ]}
                  onPress={() => !pack.isOwned && handlePurchase(pack.id)}
                  disabled={pack.isOwned || isPurchasing !== null}
                >
                  {isPurchasing === pack.id ? (
                    <ActivityIndicator size="small" color={colors.textPrimary} />
                  ) : pack.isOwned ? (
                    <Text style={styles.purchaseButtonTextOwned}>✓ Unlocked</Text>
                  ) : (
                    <Text style={styles.purchaseButtonText}>
                      {pack.id === 'remove_ads' ? 'Remove Ads' : `Unlock ${pack.name}`}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Restore Button */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Text style={styles.restoreButtonText}>
                🔄 Restore Previous Purchases
              </Text>
            )}
          </TouchableOpacity>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              Purchases are synced across all your devices. Questions are stored
              locally on your device.
            </Text>
            <Text style={styles.disclaimerText}>
              All sales are final. Prices are in USD.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.xxl + 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  title: {
    ...typography.h3,
  },
  placeholder: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  infoBanner: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  infoBannerText: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  errorBannerText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  packsContainer: {
    gap: spacing.md,
  },
  packCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  packCardOwned: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
  },
  packHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  packIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  packIcon: {
    fontSize: 24,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    ...typography.h3,
    marginBottom: spacing.xxs,
  },
  packPrice: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  packDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  purchaseButtonOwned: {
    backgroundColor: colors.success + '20',
  },
  purchaseButtonLoading: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  purchaseButtonTextOwned: {
    ...typography.button,
    color: colors.success,
  },
  restoreButton: {
    marginTop: spacing.xl,
    padding: spacing.md,
    alignItems: 'center',
  },
  restoreButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  disclaimer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    alignItems: 'center',
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
