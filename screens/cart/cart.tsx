import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { observer } from "mobx-react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Linking,
  AppState,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ToggleButton, Divider } from "react-native-paper";
import DashedLine from "react-native-dashed-line";
import { LinearGradient } from "expo-linear-gradient";

/* styles */
import theme from "../../styles/theme.style";
import * as Location from "expo-location";
import { StoreContext } from "../../stores";
import Counter from "../../components/controls/counter";
import Icon from "../../components/icon";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import BackButton from "../../components/back-button";
import PaymentMethodDialog from "../../components/dialogs/delivery-method";
import NewPaymentMethodDialog from "../../components/dialogs/new-credit-card";
import {
  TOrderSubmitResponse,
  TUpdateCCPaymentRequest,
} from "../../stores/cart";
import { TCCDetails } from "../../components/credit-card/api/validate-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import chargeCreditCard, {
  TPaymentProps,
} from "../../components/credit-card/api/payment";
import Button from "../../components/controls/button/button";
import LocationIsDisabledDialog from "../../components/dialogs/location-is-disabled";
import { getCurrentLang } from "../../translations/i18n";
import { useTranslation } from "react-i18next";
import themeStyle from "../../styles/theme.style";
import InvalidAddressdDialog from "../../components/dialogs/invalid-address";
import StoreIsCloseDialog from "../../components/dialogs/store-is-close";

export const SHIPPING_METHODS = {
  shipping: "DELIVERY",
  takAway: "TAKEAWAY",
};
const PAYMENT_METHODS = {
  creditCard: "CREDITCARD",
  cash: "CASH",
};
type TShippingMethod = {
  shipping: string;
  takAway: string;
};

const CartScreen = () => {
  const { cartStore, authStore, languageStore, storeDataStore } = useContext(
    StoreContext
  );
  const [t, i18n] = useTranslation();

  const navigation = useNavigation();

  const [shippingMethod, setShippingMethod] = React.useState(
    SHIPPING_METHODS.shipping
  );
  const [paymentMthod, setPaymentMthod] = React.useState(PAYMENT_METHODS.cash);

  const [isShippingMethodAgrred, setIsShippingMethodAgrred] = React.useState(
    false
  );
  const [
    isOpenShippingMethodDialog,
    setIsOpenShippingMethodDialog,
  ] = React.useState(false);

  const [
    isOpenLocationIsDisabledDialog,
    setIsOpenLocationIsDisableDialog,
  ] = React.useState(false);
  const [
    isOpenNewCreditCardDialog,
    setOpenNewCreditCardDialog,
  ] = React.useState(false);

  const [ccData, setCCData] = React.useState<TCCDetails | undefined>();

  const [itemsPrice, setItemsPrice] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showStoreIsCloseDialog, setShowStoreIsCloseDialog] = useState(false);

  const [isLoadingOrderSent, setIsLoadingOrderSent] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [
    isOpenInvalidAddressDialod,
    setIsOpenInvalidAddressDialod,
  ] = React.useState(false);
  const [
    locationPermissionStatus,
    requestPermission,
  ] = Location.useForegroundPermissions();

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          const res = await Location.hasServicesEnabledAsync();
          if (!res) {
            setIsOpenLocationIsDisableDialog(false);
            setIsOpenLocationIsDisableDialog(true);
          } else {
            askForLocation();
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (locationPermissionStatus?.granted) {
      askForLocation();
    }
  }, [locationPermissionStatus]);

  const askForLocation = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy:
        Platform.OS === "android"
          ? Location.Accuracy.Low
          : Location.Accuracy.Lowest,
    });
    setLocation(location);
    cartStore
      .isValidGeo(location.coords.latitude, location.coords.longitude)
      .then((res) => {
        setIsValidAddress(res.result);
        setIsOpenInvalidAddressDialod(!res.result);
      });
  };
  useEffect(() => {
    if (shippingMethod === SHIPPING_METHODS.shipping) {
      (async () => {
        if (!location) {
          const res = await Location.hasServicesEnabledAsync();
          if (!res) {
            setIsOpenLocationIsDisableDialog(true);
          } else {
            requestPermission();
          }
        }
      })();
    }
  }, [shippingMethod]);

  useEffect(() => {
    const shippingPrice = shippingMethod === SHIPPING_METHODS.shipping ? 15 : 0;
    setTotalPrice(shippingPrice + itemsPrice);
  }, [shippingMethod, itemsPrice]);

  useEffect(() => {
    if (paymentMthod === PAYMENT_METHODS.creditCard && !ccData) {
      setOpenNewCreditCardDialog(true);
    }
  }, [paymentMthod]);

  useEffect(() => {
    if (cartStore.cartItems.length === 0) {
      navigation.navigate("homeScreen");
      return;
    }
    let tmpOrderPrice = 0;
    cartStore.cartItems.forEach((item) => {
      tmpOrderPrice += item.data.price;
    });
    setItemsPrice(tmpOrderPrice);
  }, [cartStore.cartItems]);

  const getCCData = async () => {
    //await AsyncStorage.setItem("@storage_CCData","");
    const data = await AsyncStorage.getItem("@storage_CCData");
    setCCData(JSON.parse(data));
  };

  useEffect(() => {
    getCCData();
  }, []);

  const onCounterChange = (product, index, value) => {
    cartStore.updateProductCount(product.data.id + index, value);
  };

  const onRemoveProduct = (product, index) => {
    cartStore.removeProduct(product.data.id + index);
  };

  const isStoreAvailable = () => {
    return storeDataStore.getStoreData().then((res) => {
      return {
        isOpen: res.isOpen,
        isBusy: false,
      };
    });
  };

  const onSendCart = async () => {
    const isLoggedIn = authStore.isLoggedIn();
    if (isLoggedIn) {
      const storeStatus = await isStoreAvailable();
      if (storeStatus.isOpen) {
        if (isValidAddress) {
          if (
            shippingMethod === SHIPPING_METHODS.shipping &&
            !isShippingMethodAgrred
          ) {
            setIsOpenShippingMethodDialog(true);
            return;
          } else {
            submitCart();
          }
        } else {
          setIsOpenInvalidAddressDialod(true);
        }
      } else {
        setShowStoreIsCloseDialog(true);
      }
    } else {
      navigation.navigate("login");
    }
  };

  const chargeOrder = (chargeData: TPaymentProps) => {
    chargeCreditCard(chargeData).then((res) => {
      console.log("chargeCreditCardHasError", res.HasError);

      if (res.HasError) {
        return;
      }
      const updateCCData: TUpdateCCPaymentRequest = {
        order_id: chargeData.orderId,
        creditcard_ReferenceNumber: res.ReferenceNumber,
        datetime: new Date(),
      };
      cartStore.UpdateCCPayment(updateCCData).then((res) => {
        if (res.has_err) {
          return;
        }
        console.log("UpdateCCPayment", res.has_err);

        postChargeOrderActions();
      });
    });
  };

  const postChargeOrderActions = () => {
    setIsLoadingOrderSent(false);
    cartStore.resetCart();
    navigation.navigate("order-submitted", { shippingMethod });
  };
  const postSubmitOrderActions = (orderData: TOrderSubmitResponse) => {
    if (paymentMthod === PAYMENT_METHODS.creditCard) {
      // TODO handle credit card

      const chargeData: TPaymentProps = {
        cardNumber: ccData.ccToken,
        expDate: ccData.expDate,
        cvv: ccData.cvv,
        totalPrice: totalPrice,
        holderId: ccData.id,
        orderId: orderData.order_id,
      };
      console.log("chargeOrder", chargeData);

      chargeOrder(chargeData);
    } else {
      postChargeOrderActions();
    }
  };
  const submitCart = () => {
    setIsLoadingOrderSent(true);
    const order: any = {
      paymentMthod,
      shippingMethod,
      totalPrice,
      products: cartStore.cartItems,
    };
    if (shippingMethod === SHIPPING_METHODS.shipping) {
      order.geo_positioning = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    }
    //cartStore.addOrderToHistory(order,userDetailsStore.userDetails.phone);
    cartStore.submitOrder(order).then((res: TOrderSubmitResponse) => {
      console.log("has_err", res.has_err);

      if (res.has_err) {
        return;
      }
      postSubmitOrderActions(res);
    });
  };

  const onEditProduct = (index) => {
    navigation.navigate("meal", { index });
  };

  const handleLocationIsDiabledAnswer = (value: boolean) => {
    console.log("handleLocationIsDiabledAnswer", value);
    if (value) {
      Platform.OS === "android"
        ? Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS")
        : Linking.openURL("App-Prefs:Privacy&path=LOCATION");
    } else {
      setIsOpenLocationIsDisableDialog(false);
      setShippingMethod(SHIPPING_METHODS.takAway);
    }
  };
  const handleShippingMethoAnswer = (value: boolean) => {
    setIsOpenShippingMethodDialog(value);
    setIsShippingMethodAgrred(value);
    setIsLoadingOrderSent(value);
    if (value) {
      submitCart();
    }
  };
  const handleInvalidLocationAnswer = (value: boolean) => {
    setIsOpenInvalidAddressDialod(false);
  };
  const handleStoreIsCloseAnswer = (value: boolean) => {
    setShowStoreIsCloseDialog(false);
  };
  const handleNewPMAnswer = (value: any) => {
    if (value === "close") {
      setPaymentMthod(PAYMENT_METHODS.cash);
      setOpenNewCreditCardDialog(false);
      return;
    }
    getCCData();
  };

  const isCartValid = () => {
    if (shippingMethod === SHIPPING_METHODS.shipping) {
      if (!location) {
        return false;
      }
      return true;
    }
    return true;
  };

  const replaceCreditCard = () => {
    setOpenNewCreditCardDialog(true);
  };

  const filterMealExtras = (extras) => {
    const filteredExtras = extras.filter(
      (extra) =>
        extra.value &&
        extra.isdefault != extra.value &&
        extra.counter_init_value != extra.value
    );
    return filteredExtras;
  };

  return (
    <View style={{ position: "relative" }}>
      <ScrollView>
        <View style={{ ...styles.container }}>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.backContainer}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(112,112,112,0.1)",
                  borderRadius: 30,
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 10,
                  marginLeft: 10,
                }}
              >
                <BackButton />
              </View>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  {cartStore.getProductsCount()} وجبات
                </Text>
              </View>
            </View>

            <View style={{ marginTop: -20 }}>
              {cartStore.cartItems.map((product, index) => (
                <View
                  style={{
                    marginTop: 25,
                    borderColor: "#707070",
                    borderRadius: 20,
                    padding: 10,
                    backgroundColor: themeStyle.WHITE_COLOR,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "left",
                          fontFamily: `${getCurrentLang()}-SemiBold`,
                          fontSize: 20,
                        }}
                      >
                        {product.data[`name_${languageStore.selectedLang}`]}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 130,
                            height: 80,
                            padding: 0,
                          }}
                        >
                          <Image
                            style={{ width: "90%", height: "100%" }}
                            source={{ uri: product.data.image_url }}
                          />
                        </View>
                        <View style={{ marginLeft: 0, marginTop: 5 }}>
                          {product.extras &&
                            Object.keys(product.extras).map((key) => {
                              const filteredExtras = filterMealExtras(
                                product.extras[key]
                              );
                              return filteredExtras.map((extra, index) => {
                                let lastKey = filteredExtras.length;
                                if (
                                  extra.value &&
                                  extra.isdefault != extra.value &&
                                  extra.counter_init_value != extra.value
                                ) {
                                  return (
                                    <View>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          paddingBottom: 10,
                                        }}
                                      >
                                        <View
                                          style={{
                                            height: 8,
                                            width: 8,
                                            backgroundColor:
                                              themeStyle.PRIMARY_COLOR,
                                            borderRadius: 100,
                                            marginRight: 5,
                                          }}
                                        ></View>
                                        <View>
                                          <Text
                                            style={{
                                              textAlign: "left",
                                              fontFamily: `${getCurrentLang()}-SemiBold`,
                                              fontSize: 14,
                                              color: themeStyle.SUCCESS_COLOR,
                                            }}
                                          >
                                            {extra.name} {extra.value}
                                          </Text>
                                        </View>
                                      </View>
                                      {lastKey - 1 !== index && (
                                        <View
                                          style={{
                                            borderWidth: 1,
                                            width: 1,
                                            height: 20,
                                            position: "absolute",
                                            top: 10,
                                            left: 3,
                                            borderColor:
                                              themeStyle.PRIMARY_COLOR,
                                          }}
                                        ></View>
                                      )}
                                    </View>
                                  );
                                }
                              });
                            })}
                        </View>
                      </View>
                    </View>

                    <View style={{ alignItems: "center", marginRight: 20 }}>
                      <View style={{ width: "35%" }}>
                        <Counter
                          value={product.others.count}
                          minValue={1}
                          onCounterChange={(value) => {
                            onCounterChange(product, index, value);
                          }}
                          isVertical
                        />
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 15,
                      marginTop: 10,
                    }}
                  >
                    <DashedLine
                      dashLength={5}
                      dashThickness={1}
                      dashGap={5}
                      dashColor={themeStyle.GRAY_300}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            padding: 5,
                            flexDirection: "row",
                            marginRight: 15,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              onEditProduct(index);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: `${getCurrentLang()}-SemiBold`,
                              }}
                            >
                              {t("edit")}
                            </Text>
                            <View>
                              <Icon
                                icon="edit"
                                size={20}
                                style={{ color: theme.GRAY_700 }}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{ padding: 5, flexDirection: "row" }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onPress={() => {
                              onRemoveProduct(product, index);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: `${getCurrentLang()}-SemiBold`,
                                height: "100%",
                              }}
                            >
                              {t("delete")}
                            </Text>

                            <View style={{ top: -1 }}>
                              <Icon icon="delete" size={20} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          marginTop: 0,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                          {product.data.price}
                        </Text>
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                          ₪
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View>
            <LinearGradient
              colors={["#F1F1F1", "white"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.1 }}
              style={styles.background}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 30,
                paddingHorizontal: 20,
              }}
            >
              <View style={{ flexBasis: "49%" }}>
                <Button
                  onClickFn={() => setShippingMethod(SHIPPING_METHODS.shipping)}
                  text={t("delivery")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.shipping
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="shipping_icon"
                  iconSize={25}
                />
              </View>
              <View style={{ flexBasis: "49%" }}>
                <Button
                  onClickFn={() => setShippingMethod(SHIPPING_METHODS.takAway)}
                  text={t("take-away")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.takAway
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="cart_burger_icon"
                  iconSize={25}
                  iconPosition={"left"}
                />
              </View>
            </View>

            {shippingMethod === SHIPPING_METHODS.shipping && (
              <View
                pointerEvents="none"
                style={{
                  alignItems: "center",
                  marginTop: 5,
                  paddingHorizontal: 20,
                }}
              >
                {location ? (
                  <MapView
                    style={styles.mapContainer}
                    initialRegion={{
                      latitude: location.coords.latitude,
                      latitudeDelta: 0.01,
                      longitude: location.coords.longitude,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      }}
                    />
                  </MapView>
                ) : (
                  <Text>טוען מיקום...</Text>
                )}
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 30,
                paddingHorizontal: 20,
              }}
            >
              <View style={{ flexBasis: "49%" }}>
                <Button
                  onClickFn={() => setPaymentMthod(PAYMENT_METHODS.cash)}
                  text={t("cash")}
                  bgColor={
                    paymentMthod === PAYMENT_METHODS.cash
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="shekel"
                  iconSize={25}
                />
              </View>
              <View style={{ flexBasis: "49%" }}>
                <Button
                  onClickFn={() => setPaymentMthod(PAYMENT_METHODS.creditCard)}
                  text={t("credit-card")}
                  bgColor={
                    paymentMthod === PAYMENT_METHODS.creditCard
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="credit_card_icom"
                  iconSize={25}
                  iconPosition={"left"}
                />
              </View>
            </View>

            {paymentMthod === PAYMENT_METHODS.creditCard &&
              ccData?.last4Digits && (
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: "#F5F5F5",
                    borderRadius: 15,
                    padding: 2,
                    marginTop: 5,
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={replaceCreditCard}
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      padding: 5,
                    }}
                  >
                    <Icon
                      icon="circle-down-arrow"
                      size={20}
                      style={{ color: theme.GRAY_700 }}
                    />
                    <Text
                      style={{ fontSize: 20, paddingTop: 3, paddingLeft: 5 }}
                    >
                      {"החלפה"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{ fontSize: 20 }}
                  >{`****_****_****_${ccData?.last4Digits}`}</Text>
                </View>
              )}
          </View>
          <View style={styles.totalPrictContainer}>
            {shippingMethod === SHIPPING_METHODS.shipping && (
              <View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }}>{t("total")}</Text>
                </View>
                <View style={{ marginTop: 30 }}>
                  <View style={styles.priceRowContainer}>
                    <View>
                      <Text
                        style={{
                          fontFamily: `${getCurrentLang()}-Light`,
                          fontSize: 20,
                        }}
                      >
                        {t("order-price")}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: `${getCurrentLang()}-Light`,
                          fontSize: 17,
                        }}
                      >
                        ₪{itemsPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.priceRowContainer}>
                    <View>
                      <Text
                        style={{
                          fontFamily: `${getCurrentLang()}-Light`,
                          fontSize: 20,
                        }}
                      >
                        {t("delivery")}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: `${getCurrentLang()}-Light`,
                          fontSize: 17,
                        }}
                      >
                        ₪15
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={{ borderWidth: 0.3 }}></View>

            <View style={[styles.priceRowContainer, { marginTop: 10 }]}>
              <View>
                <Text
                  style={{
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 20,
                  }}
                >
                  {t("final-price")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  {totalPrice}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  ₪
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 30, marginHorizontal: 20 }}>
              <Button
                bgColor={theme.SUCCESS_COLOR}
                onClickFn={onSendCart}
                disabled={
                  !isCartValid() ||
                  isLoadingOrderSent ||
                  isOpenShippingMethodDialog
                }
                text={t("send-order")}
                fontSize={22}
                textColor={theme.WHITE_COLOR}
                isLoading={isLoadingOrderSent}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <NewPaymentMethodDialog
        handleAnswer={handleNewPMAnswer}
        isOpen={isOpenNewCreditCardDialog}
      />
      <PaymentMethodDialog
        handleAnswer={handleShippingMethoAnswer}
        isOpen={isOpenShippingMethodDialog}
      />
      <LocationIsDisabledDialog
        handleAnswer={handleLocationIsDiabledAnswer}
        isOpen={isOpenLocationIsDisabledDialog}
      />
      <InvalidAddressdDialog
        handleAnswer={handleInvalidLocationAnswer}
        isOpen={isOpenInvalidAddressDialod}
      />
      <StoreIsCloseDialog
        handleAnswer={handleStoreIsCloseAnswer}
        isOpen={showStoreIsCloseDialog}
      />
    </View>
  );
};

export default observer(CartScreen);
// MapScreen.navigationOptions = {
//     header: null
// }

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#F1F1F1",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  togglleContainer: {
    borderRadius: 50,
    marginTop: 30,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: theme.PRIMARY_COLOR,
    flexDirection: "row",
    width: "100%",
  },
  togglleCItem: {
    borderRadius: 50,
    flex: 1,
    alignItems: "flex-start",
  },
  togglleItemContent: {},
  togglleItemContentContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  mapContainer: {
    width: "90%",
    height: 200,
  },
  totalPrictContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,

    paddingTop: 40,
    backgroundColor: themeStyle.WHITE_COLOR,
  },
  priceRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    fontSize: 25,
  },
  submitButton: {
    backgroundColor: theme.SUCCESS_COLOR,
    borderRadius: 15,
    marginTop: 30,
  },
  submitContentButton: {
    height: 50,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
