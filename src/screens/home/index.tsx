import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useIAP } from 'react-native-iap';
import { SafeAreaView } from 'react-native-safe-area-context';

const subscriptionIds = ['monthly_299', '6monthly_1500'];

const subscriptionCardWidth = Dimensions.get('screen').width - 120;

const Home = () => {
  const {
    connected,
    subscriptions,
    fetchProducts,
    products,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
    availablePurchases,
  } = useIAP({
    onPurchaseSuccess: async purchase => {
      console.log('Purchase success:', purchase);
      await getAvailablePurchases();

      await finishTransaction({
        purchase,
        isConsumable: false,
      });
    },
    onPurchaseError: error => {
      console.log('Purchase error:', error);
    },
  });

  useEffect(() => {
    if (!connected) {
      return;
    }

    fetchProducts({
      skus: subscriptionIds,
      type: 'subs',
    });

    getAvailablePurchases();
  }, [connected, fetchProducts, getAvailablePurchases]);

  useEffect(() => {
    console.log('subscriptions state:', subscriptions);
  }, [subscriptions]);

  const activePurchase = availablePurchases.find(
    p =>
      subscriptionIds.includes(p.productId) &&
      (!p?.expirationDateIOS || p?.expirationDateIOS > Date.now()),
  );

  console.log('activePurchase', activePurchase);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text style={styles.header}>{'Subscription'}</Text>
      </View>

      <Text style={styles.pricingText}>{'Our Pricing'}</Text>

      <View style={styles.subscriptionContainer}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        >
          {subscriptions?.map((subs, index) => (
            <View
              style={[
                styles.subscriptionWrapper,
                { width: subscriptionCardWidth },
              ]}
              key={subs?.id}
            >
              <Text style={styles.displayName}>{subs?.displayName}</Text>
              <Text style={styles.descName}>{subs?.description}</Text>
              <Text
                style={styles.price}
              >{`${subs?.displayPrice} ${subs?.currency} for ${subs?.subscriptionPeriodNumberIOS} months`}</Text>
              <Text style={styles.price}>{`i.e. ${(
                subs?.price / subs?.subscriptionPeriodNumberIOS
              )?.toFixed(2)} / month`}</Text>
              <Text style={styles.autoRenew}>{`Auto Renew Enabled`}</Text>

              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Button
                  title="Purchase"
                  onPress={() => {
                    requestPurchase({
                      request: {
                        apple: {
                          sku: subs?.id,
                        },
                      },
                      type: 'subs',
                    });
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  pricingText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 32,
  },
  subscriptionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subscriptionWrapper: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.8,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginHorizontal: 8,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
  },
  descName: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  price: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 12,
  },
  autoRenew: {
    marginTop: 10,
  },
});
