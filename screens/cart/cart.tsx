import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { observer } from "mobx-react";
import {
  Image,
  View,
  StyleSheet,
  Linking,
  AppState,
  Platform,
  Animated,
  LayoutAnimation,
  DeviceEventEmitter,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import DashedLine from "react-native-dashed-line";
import { LinearGradient } from "expo-linear-gradient";

/* styles */
import theme from "../../styles/theme.style";
import * as Location from "expo-location";
import { StoreContext } from "../../stores";
import Counter from "../../components/controls/counter";
import Text from "../../components/controls/Text";
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
import PaymentFailedDialog from "../../components/dialogs/payment-failed";
import { menuStore } from "../../stores/menu";
import BarcodeScannerCMP from "../../components/barcode-scanner";
import OpenBarcodeScannerdDialog from "../../components/dialogs/barcode-scanner/open-barcode-scannte";
import BarcodeScannedDialog from "../../components/dialogs/barcode-scanner/barcode-scanned";
import RecipetNotSupportedDialog from "../../components/dialogs/recipet-service/recipet-not-supported";
import StoreErrorMsgDialog from "../../components/dialogs/store-errot-msg";
import DeliveryMethodDialog from "../../components/dialogs/delivery-method";
import { SHIPPING_METHODS, bcoindId } from "../../consts/shared";

const PAYMENT_METHODS = {
  creditCard: "CREDITCARD",
  cash: "CASH",
};
type TShippingMethod = {
  shipping: string;
  takAway: string;
};

const CartScreen = () => {
  const { t } = useTranslation();
  const {
    cartStore,
    authStore,
    languageStore,
    storeDataStore,
    userDetailsStore,
  } = useContext(StoreContext);

  const navigation = useNavigation();

  const [shippingMethod, setShippingMethod] = React.useState(
    SHIPPING_METHODS.takAway
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
  const [bcoinUpdatePrice, setBcoinUpdatePrice] = React.useState(0);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showStoreIsCloseDialog, setShowStoreIsCloseDialog] = useState(false);
  const [showPaymentFailedDialog, setShowPaymentFailedDialog] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState();
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isOpenBarcodeSacnnerDialog, stIsOpenBarcodeSacnnerDialog] = useState(
    false
  );
  const [isOpenBarcodeSacnnedDialog, stIsOpenBarcodeSacnnedDialog] = useState(
    false
  );
  const [
    isOpenRecipetNotSupportedDialog,
    setIOpenRecipetNotSupportedDialog,
  ] = useState(false);
  const [isOpenStoreErrorMsgDialog, setIsOpenStoreErrorMsgDialog] = useState(
    false
  );
  const [barcodeSacnnedDialogText, setBarcodeSacnnedDialogText] = useState("");
  const [recipetSupportText, setRecipetSupportText] = useState({
    text: "",
    icon: null,
  });
  const [storeErrorText, setStoreErrorText] = useState("");
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
    if (menuStore.categories["OTHER"]) {
      const bcoinMeal = {
        data: menuStore.categories["OTHER"][0],
        others: { count: 0, note: "" },
      };
      const bcoinFound = cartStore.cartItems.find(
        (product) => product.data.id === bcoindId
      );
      if (
        bcoinFound ||
        userDetailsStore.userDetails?.credit <=
          userDetailsStore.userDetails?.creditMinimum
      ) {
        return;
      }
      bcoinMeal.data.price = userDetailsStore.userDetails?.credit;
      // setTotalPrice(itemsPrice + bcoinMeal.data.price);
      cartStore.addProductToCart(bcoinMeal, true);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          if (shippingMethod === SHIPPING_METHODS.shipping) {
            const res = await Location.hasServicesEnabledAsync();
            if (!res) {
              setIsOpenLocationIsDisableDialog(false);
              setIsOpenLocationIsDisableDialog(true);
            } else {
              askForLocation();
            }
          }
          if (shippingMethod === SHIPPING_METHODS.table) {
            setShippingMethod(SHIPPING_METHODS.takAway);
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [shippingMethod]);

  useEffect(() => {
    if (
      locationPermissionStatus?.granted &&
      shippingMethod === SHIPPING_METHODS.shipping
    ) {
      askForLocation();
    }
  }, [locationPermissionStatus]);

  const askForLocation = async () => {
    let lastLocation = await Location.getCurrentPositionAsync({
      accuracy:
        Platform.OS === "android"
          ? Location.Accuracy.Low
          : Location.Accuracy.Low,
    });
    setLocation(lastLocation);
    let location = await Location.getCurrentPositionAsync({
      accuracy:
        Platform.OS === "android"
          ? Location.Accuracy.Highest
          : Location.Accuracy.Highest,
    });
    setLocation(location);
    cartStore
      .isValidGeo(location.coords.latitude, location.coords.longitude)
      .then((res) => {
        if (res) {
          setIsValidAddress(res.result);
          setIsOpenInvalidAddressDialod(!res.result);
        }
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
    let bcoinPrice = 0;
    const shippingPrice = shippingMethod === SHIPPING_METHODS.shipping ? 15 : 0;
    if (isBcoinInCart()) {
      if (itemsPrice < userDetailsStore?.userDetails?.credit) {
        bcoinPrice = itemsPrice;
      } else {
        bcoinPrice = userDetailsStore?.userDetails?.credit;
      }
    }
    setBcoinUpdatePrice(bcoinPrice);
    setTotalPrice(shippingPrice + itemsPrice + bcoinPrice * -1);
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
    if (cartStore.cartItems.length === 1 && isBcoinInCart()) {
      const bcoinMeal = {
        data: menuStore.categories["OTHER"][0],
        others: { count: 1, note: "" },
      };
      cartStore.removeProduct(getProductIndexId(bcoinMeal, 0));

      navigation.navigate("homeScreen");
      return;
    }
    let tmpOrderPrice = 0;
    cartStore.cartItems.forEach((item) => {
      if (item && item.data.id !== bcoindId) {
        tmpOrderPrice += item.data.price * item.others.count;
      }
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

  const getProductIndexId = (product, index) => {
    if (product) {
      return product?.data.id.toString() + index;
    }
  };

  const onCounterChange = (product, index, value) => {
    cartStore.updateProductCount(getProductIndexId(product, index), value);
  };
  const itemRefs = useRef([]);

  const [itemToRemove, setItemToRemove] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const onRemoveProduct = (product, index) => {
    if (isAnimating) {
      return false;
    }
    setIsAnimating(true);
    setItemToRemove(getProductIndexId(product, index));

    handleAnimation();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      // Remove the item from the list
    });

    setTimeout(() => {
      cartStore.removeProduct(getProductIndexId(product, index));
      setIsAnimating(false);
    }, 600);
  };

  // const isStoreAvailable = () => {
  //   return storeDataStore.getStoreData().then((res) => {
  //     return {
  //       isOpen: res.alwaysOpen || res.isOpen,
  //       isBusy: false,
  //     };
  //   });
  // };
  const isStoreSupport = (key: string) => {
    return storeDataStore.getStoreData().then((res) => {
      return res[key];
    });
  };

  const isStoreAvailable = () => {
    return storeDataStore.getStoreData().then((res) => {
      return {
        ar: res["invalid_message_ar"],
        he: res["invalid_message_he"],
        isOpen: res.alwaysOpen || res.isOpen,
        isBusy: false,
      };
    });
  };

  const isErrMessage = async () => {
    let data = await isStoreAvailable();
    if (data.ar || data.he) {
      setStoreErrorText(data[getCurrentLang()]);
      setIsOpenStoreErrorMsgDialog(true);
    }
    return data;
  };
  const onSendCart = async () => {
    const isLoggedIn = authStore.isLoggedIn();
    if (isLoggedIn) {
      const data = await isErrMessage();
      if (!(data.ar || data.he)) {
        if (data.isOpen) {
          if (shippingMethod === SHIPPING_METHODS.shipping) {
            if (isValidAddress) {
              if (!isShippingMethodAgrred) {
                setIsOpenShippingMethodDialog(true);
                return;
              } else {
                submitCart();
              }
            } else {
              setIsOpenInvalidAddressDialod(true);
            }
          } else {
            if (shippingMethod === SHIPPING_METHODS.takAway) {
              setIsOpenShippingMethodDialog(true);
            } else {
              submitCart();
            }
          }
        } else {
          setShowStoreIsCloseDialog(true);
        }
      }
    } else {
      navigation.navigate("login");
    }
  };

  const chargeOrder = (chargeData: TPaymentProps) => {
    chargeCreditCard(chargeData).then((resCharge) => {
      const updateCCData: TUpdateCCPaymentRequest = {
        order_id: chargeData.orderId,
        creditcard_ReferenceNumber: resCharge.ReferenceNumber,
        datetime: new Date(),
      };
      cartStore.UpdateCCPayment(updateCCData).then((res) => {
        if (resCharge.HasError) {
          setPaymentErrorMessage(resCharge.ReturnMessage);
          setShowPaymentFailedDialog(true);
          setIsLoadingOrderSent(false);
          return;
        }
        if (res.has_err) {
          setShowPaymentFailedDialog(true);
          return;
        }
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
        token: ccData.ccToken,
        id: ccData.id,
        totalPrice: totalPrice,
        orderId: orderData.order_id,
      };
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
      bcoinUpdatePrice,
    };

    if (shippingMethod === SHIPPING_METHODS.shipping) {
      order.geo_positioning = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    }
    //cartStore.addOrderToHistory(order,userDetailsStore.userDetails.phone);
    cartStore.submitOrder(order).then((res: TOrderSubmitResponse | any) => {
      if (res == "sameHashKey") {
        if (paymentMthod === PAYMENT_METHODS.creditCard) {
        }
      }
      if (res?.has_err) {
        DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
          show: true,
        });
      }
      postSubmitOrderActions(res);
    });
  };

  const onEditProduct = (index) => {
    navigation.navigate("meal", { index });
  };

  const handleLocationIsDiabledAnswer = (value: boolean) => {
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
  const handlePaymentFailedAnswer = (value: boolean) => {
    setShowPaymentFailedDialog(false);
    setIsLoadingOrderSent(false);
    setIsOpenShippingMethodDialog(false);
  };
  const handleNewPMAnswer = (value: any) => {
    if (value === "close") {
      setPaymentMthod(PAYMENT_METHODS.cash);
      setOpenNewCreditCardDialog(false);
      return;
    }
    setOpenNewCreditCardDialog(false);
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
    const filteredExtras = extras.filter((extra) => {
      if (extra.available_on_app) {
        if (extra.type === "CHOICE" && !extra.multiple_choice) {
          if (extra.value !== false && extra.value !== extra.isdefault) {
            return extra;
          }
          return false;
        }
        if (extra.type === "COUNTER") {
          if (extra.counter_init_value !== extra.value) {
            return extra;
          }
          return false;
        }
        if (extra.type === "CHOICE" && extra.multiple_choice) {
          if (
            extra.isdefault !== extra.value &&
            extra.value !== extra.isdefault
          ) {
            return extra;
          }
          return false;
        }
      }
    });

    return filteredExtras;
  };

  // extra.value &&
  // extra.isdefault != extra.value &&
  // extra.counter_init_value != extra.value
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const handleAnimation = () => {
    // @ts-ignore
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      rotateAnimation.setValue(0);
    });
  };
  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const interpolateRotating2 = rotateAnimation.interpolate({
    inputRange: [0, 10],
    outputRange: [0, -6000],
  });

  const animatedStyle = {
    opacity: interpolateRotating,
    color: themeStyle.PRIMARY_COLOR,
    transform: [{ translateX: interpolateRotating2 }],
  };

  const isBcoinProduct = (product) => {
    return product.data.id === bcoindId;
  };

  const isBcoinInCart = () => {
    const bcoinFound = cartStore.cartItems.find(
      (product) => product.data.id === bcoindId
    );
    return bcoinFound;
  };

  const renderExtras = (filteredExtras, extrasLength, key) => {
    return (
      <View>{renderFilteredExtras(filteredExtras, extrasLength, key)}</View>
    );
  };

  const handleBarcodeAnswer = (answer: string) => {
    setIsBarcodeOpen(false);
    if (answer === "canceled") {
      setBarcodeSacnnedDialogText("scann-canceled");
      setShippingMethod(SHIPPING_METHODS.takAway);
    } else {
      setBarcodeSacnnedDialogText("scanned-succefully");
    }
    stIsOpenBarcodeSacnnedDialog(true);
  };
  const handleOpenBarcodeScannerAnswer = (answer: string) => {
    setIsBarcodeOpen(true);
    stIsOpenBarcodeSacnnerDialog(false);
  };
  const handleOpenBarcodeScannedAnswer = (answer: string) => {
    stIsOpenBarcodeSacnnedDialog(false);
  };

  const handleDeliverySelect = async () => {
    const isSupported = await isStoreSupport("delivery_support");
    if (!isSupported) {
      setRecipetSupportText({
        text: "shipping-not-supported",
        icon: "shipping_icon",
      });
      setIOpenRecipetNotSupportedDialog(true);
      setShippingMethod(SHIPPING_METHODS.takAway);
      return;
    }
    setShippingMethod(SHIPPING_METHODS.shipping);
  };
  const handleTableSelect = async () => {
    setIsBarcodeOpen(false);
    setShippingMethod(SHIPPING_METHODS.table);
    const isSupported = await isStoreSupport("table_support");
    if (!isSupported) {
      stIsOpenBarcodeSacnnerDialog(true);
    }
  };
  const handleCreditCardSelected = async () => {
    const isSupported = await isStoreSupport("creditcard_support");
    if (!isSupported) {
      setRecipetSupportText({
        text: "creditcard-not-supported",
        icon: "delivery-icon",
      });
      setIOpenRecipetNotSupportedDialog(true);
      setPaymentMthod(PAYMENT_METHODS.cash);
      return;
    }
    setPaymentMthod(PAYMENT_METHODS.creditCard);
  };

  const handleRecipetNotSupportedAnswer = () => {
    setIOpenRecipetNotSupportedDialog(false);
  };
  const handleStoreErrorMsgAnswer = () => {
    setIsOpenStoreErrorMsgDialog(false);
  };

  const removeCreditCard = async () => {
    await AsyncStorage.removeItem("@storage_CCData");
    setCCData(null);
    setPaymentMthod(PAYMENT_METHODS.cash);
  };

  let extrasArray = [];
  const renderFilteredExtras = (filteredExtras, extrasLength, key) => {
    return filteredExtras.map((extra, tagIndex) => {
      extrasArray.push(extra.id);
      return (
        <View>
          {/* <View
              style={{
                borderWidth: 1,
                width: 1,
                height: 20,
                position: "absolute",
                top: 10,
                left: 3,
                borderColor: themeStyle.PRIMARY_COLOR,
              }}
            ></View> */}
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
                backgroundColor: themeStyle.PRIMARY_COLOR,
                borderRadius: 100,
                marginRight: 5,
              }}
            ></View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {extra.value === false && (
                <Text
                  style={{
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 14,
                    color: themeStyle.SUCCESS_COLOR,
                    marginRight: 2,
                  }}
                >
                  {t("without")}
                </Text>
              )}
              <Text
                style={{
                  textAlign: "left",
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  fontSize: 14,
                  color: themeStyle.SUCCESS_COLOR,
                }}
              >
                {menuStore.translate(extra.name)} {extra.value}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const getCardIcon = (type: string) => {
    //mastercard
    // american-express
    // visa
  };

  return (
    <View
      style={{ position: "relative", backgroundColor: "white", height: "100%" }}
    >
      <ScrollView>
        <View style={{ ...styles.container }}>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.backContainer}>
              <View
                style={{
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
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: themeStyle.GRAY_700,
                  }}
                >
                  {t("meals")} {cartStore.getProductsCount()}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: -20 }}>
              {cartStore.cartItems.map(
                (product, index) =>
                  product && (
                    <Animated.View
                      style={
                        getProductIndexId(product, index) === itemToRemove
                          ? animatedStyle
                          : null
                      }
                    >
                      <View
                        ref={itemRefs[getProductIndexId(product, index)]}
                        style={{
                          marginTop: 25,
                          borderColor: "#707070",
                          borderRadius: 20,
                          padding: isBcoinProduct(product) ? 0 : 10,
                          backgroundColor: themeStyle.WHITE_COLOR,
                        }}
                        key={getProductIndexId(product, index)}
                      >
                        {isBcoinProduct(product) && (
                          <ImageBackground
                            source={require("../../assets/bcoin/bcoin-bg.png")}
                            resizeMode="stretch"
                            style={styles.image}
                          />
                        )}
                        {isBcoinProduct(product) && (
                          <View style={{ height: 40, alignItems: "flex-end" }}>
                            <View
                              style={{
                                marginRight: 30,
                                marginTop: 7,
                                alignItems: "center",
                                maxWidth: "48%",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: `${getCurrentLang()}-Bold`,
                                  fontWeight: "bold",
                                  color: themeStyle.BROWN_700,
                                }}
                              >
                                {t("you-have-bcoin")} {product.data.price}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: `${getCurrentLang()}-Bold`,
                                  marginTop: getCurrentLang() === "he" ? -5 : 0,
                                  color: themeStyle.BROWN_700,
                                }}
                              >
                                {t("you-have-discount")}
                              </Text>
                              <View
                                style={{
                                  marginTop: 0,
                                  flexDirection: "row",
                                  alignItems: "flex-end",
                                }}
                              >
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 28,
                                    paddingBottom: 5,
                                    color: themeStyle.BROWN_700,
                                  }}
                                >
                                  ₪
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 47,
                                    fontFamily: "Rubik-Bold",
                                    color: themeStyle.BROWN_700,
                                  }}
                                >
                                  {bcoinUpdatePrice}
                                </Text>
                              </View>
                              <View
                                style={{
                                  paddingTop: 3,
                                  marginTop:
                                    getCurrentLang() === "he" ? -5 : -4,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 13,
                                    fontFamily: `${getCurrentLang()}-SemiBold`,
                                    textAlign: "center",
                                    color: themeStyle.BROWN_700,
                                  }}
                                >
                                  {t("you-get-discount")} ₪{bcoinUpdatePrice}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    fontFamily: `${getCurrentLang()}-SemiBold`,
                                    textAlign: "center",
                                    marginTop:
                                      getCurrentLang() === "he" ? -4 : 0,
                                    color: themeStyle.BROWN_700,
                                  }}
                                >
                                  {t("from-total-price")}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                        {!isBcoinProduct(product) && (
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
                                  fontFamily: `${getCurrentLang()}-Bold`,
                                  fontSize: 20,
                                  marginLeft: isBcoinProduct(product) ? 10 : 0,
                                  color: themeStyle.BROWN_700,
                                }}
                              >
                                {
                                  product.data[
                                    `name_${languageStore.selectedLang}`
                                  ]
                                }
                              </Text>
                            </View>
                          </View>
                        )}
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
                                {!isBcoinProduct(product) && (
                                  <Image
                                    style={{
                                      width: "90%",
                                      height: "100%",
                                      marginLeft: 0,
                                    }}
                                    source={{ uri: product.data.image_url }}
                                    resizeMode="contain"
                                  />
                                )}
                              </View>
                              <View style={{ marginLeft: 0, marginTop: 5 }}>
                                {product.extras &&
                                  Object.keys(product.extras).map(
                                    (key, extraIndex) => {
                                      if (key === "orderList") {
                                        return;
                                      }
                                      const filteredExtras = filterMealExtras(
                                        product.extras[key]
                                      );
                                      return (
                                        filteredExtras.length > 0 &&
                                        renderExtras(
                                          filteredExtras,
                                          Object.keys(product.extras).length,
                                          key
                                        )
                                      );
                                    }
                                  )}
                              </View>
                            </View>
                          </View>
                          {!isBcoinProduct(product) && (
                            <View
                              style={{ alignItems: "center", marginRight: 20 }}
                            >
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
                          )}
                        </View>
                        {!isBcoinProduct(product) && product.others.note && (
                          <View
                            style={{
                              flexDirection: "row",
                              paddingHorizontal: 15,
                              paddingTop: 5,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                paddingRight: 2,
                                fontFamily: `${getCurrentLang()}-SemiBold`,
                                color: themeStyle.SUCCESS_COLOR,
                              }}
                            >
                              {t("note")}:
                            </Text>
                            <Text
                              style={{
                                fontFamily: `${getCurrentLang()}-SemiBold`,
                                color: themeStyle.BROWN_700,
                              }}
                            >
                              {product.others.note}
                            </Text>
                          </View>
                        )}

                        {!isBcoinProduct(product) && (
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
                                    flexDirection: "row",
                                    marginRight: 15,
                                  }}
                                >
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      padding: 5,
                                    }}
                                    onPress={() => {
                                      onEditProduct(index);
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 20,
                                        fontFamily: `${getCurrentLang()}-SemiBold`,
                                        color: themeStyle.BROWN_700,
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
                                <View style={{ flexDirection: "row" }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 5,
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
                                        color: themeStyle.BROWN_700,
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
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 17,
                                    color: themeStyle.BROWN_700,
                                    fontFamily: "Rubik-Bold",
                                  }}
                                >
                                  {product.data.price * product.others.count}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 17,
                                    color: themeStyle.BROWN_700,
                                  }}
                                >
                                  ₪
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    </Animated.View>
                  )
              )}
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
                height: 125,
              }}
            >
              <View style={{ flexBasis: "32%", flexDirection: "column" }}>
                <Button
                  onClickFn={handleDeliverySelect}
                  text={t("delivery")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.shipping
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="shipping_icon"
                  iconSize={50}
                  isFlexCol
                  borderRadious={15}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
              <View style={{ flexBasis: "32%" }}>
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
                  icon="takeaway-icon"
                  iconSize={50}
                  isFlexCol
                  borderRadious={15}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
              <View style={{ flexBasis: "32%" }}>
                <Button
                  onClickFn={handleTableSelect}
                  text={t("table")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.table
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="table"
                  iconSize={50}
                  isFlexCol
                  borderRadious={15}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
            </View>
            {shippingMethod === SHIPPING_METHODS.shipping && (
              <View
                pointerEvents="none"
                style={{
                  alignItems: "center",
                  marginTop: 5,
                  paddingHorizontal: 1,
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
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <View>
                      <Text style={{ color: themeStyle.BROWN_700 }}>
                        {t("loading-location")}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 5 }}>
                      <ActivityIndicator
                        animating={true}
                        color={theme.GRAY_700}
                        size={12}
                      />
                    </View>
                  </View>
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
                  iconSize={20}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
              <View style={{ flexBasis: "49%" }}>
                <Button
                  onClickFn={handleCreditCardSelected}
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
                  textColor={themeStyle.GRAY_700}
                />
              </View>
            </View>

            {paymentMthod === PAYMENT_METHODS.creditCard &&
              ccData?.last4Digits && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginHorizontal: 25,
                    alignItems: "center",
                    justifyContent: "space-between",

                    backgroundColor: "#F5F5F5",
                    borderRadius: 15,
                    paddingHorizontal: 10,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity onPress={replaceCreditCard}>
                      <Icon icon="edit" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={removeCreditCard}
                      style={{ marginLeft: 20 }}
                    >
                      <Icon icon="delete" size={20} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: themeStyle.BROWN_700,
                        fontFamily: "Rubik-Light",
                      }}
                    >{`****_****_****_${ccData?.last4Digits}`}</Text>
                    <Icon
                      icon={ccData?.ccType}
                      size={50}
                      style={{ color: theme.GRAY_700, marginLeft: 5 }}
                    />
                  </View>
                </View>
              )}
          </View>
          <View style={styles.totalPrictContainer}>
            {(shippingMethod === SHIPPING_METHODS.shipping ||
              isBcoinInCart()) && (
              <View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: themeStyle.GRAY_700,
                      fontSize: 20,
                    }}
                  >
                    {t("total")}
                  </Text>
                </View>
                <View style={{ marginTop: 30 }}>
                  <View style={styles.priceRowContainer}>
                    <View>
                      <Text
                        style={{
                          fontFamily: `${getCurrentLang()}-Light`,
                          fontSize: 20,
                          color: themeStyle.GRAY_700,
                        }}
                      >
                        {t("order-price")}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "Rubik-Light",
                          fontSize: 17,
                          color: themeStyle.GRAY_700,
                        }}
                      >
                        ₪{itemsPrice}
                      </Text>
                    </View>
                  </View>

                  {shippingMethod === SHIPPING_METHODS.shipping && (
                    <View style={styles.priceRowContainer}>
                      <View>
                        <Text
                          style={{
                            fontFamily: `${getCurrentLang()}-Light`,
                            fontSize: 20,
                            color: themeStyle.GRAY_700,
                          }}
                        >
                          {t("delivery")}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontFamily: "Rubik-Light",
                            fontSize: 17,
                            color: themeStyle.GRAY_700,
                          }}
                        >
                          ₪15
                        </Text>
                      </View>
                    </View>
                  )}
                  {isBcoinInCart() && (
                    <View style={styles.priceRowContainer}>
                      <View>
                        <Text
                          style={{
                            fontFamily: `${getCurrentLang()}-Light`,
                            fontSize: 20,
                            color: themeStyle.GRAY_700,
                          }}
                        >
                          {t("bcoin-discount-price")}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 17,
                            color: themeStyle.GRAY_700,
                            fontFamily: "Rubik-Light",
                          }}
                        >
                          ₪{bcoinUpdatePrice * -1}
                        </Text>
                      </View>
                    </View>
                  )}
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
                    color: themeStyle.BROWN_700,
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
                    color: themeStyle.BROWN_700,
                  }}
                >
                  {totalPrice}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: themeStyle.BROWN_700,
                  }}
                >
                  ₪
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 30, marginHorizontal: -10 }}>
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
                borderRadious={19}
                textPadding={5}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {isBarcodeOpen && (
        <BarcodeScannerCMP
          onChange={handleBarcodeAnswer}
          isOpen={isBarcodeOpen}
        />
      )}

      <StoreErrorMsgDialog
        handleAnswer={handleStoreErrorMsgAnswer}
        isOpen={isOpenStoreErrorMsgDialog}
        text={storeErrorText}
      />

      <RecipetNotSupportedDialog
        handleAnswer={handleRecipetNotSupportedAnswer}
        isOpen={isOpenRecipetNotSupportedDialog}
        text={recipetSupportText.text}
        icon={recipetSupportText.icon}
      />
      <OpenBarcodeScannerdDialog
        handleAnswer={handleOpenBarcodeScannerAnswer}
        isOpen={isOpenBarcodeSacnnerDialog}
      />
      <BarcodeScannedDialog
        handleAnswer={handleOpenBarcodeScannedAnswer}
        isOpen={isOpenBarcodeSacnnedDialog}
        text={barcodeSacnnedDialogText}
      />
      <NewPaymentMethodDialog
        handleAnswer={handleNewPMAnswer}
        isOpen={isOpenNewCreditCardDialog}
      />
      <DeliveryMethodDialog
        handleAnswer={handleShippingMethoAnswer}
        isOpen={isOpenShippingMethodDialog}
        type={shippingMethod}
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
      <PaymentFailedDialog
        handleAnswer={handlePaymentFailedAnswer}
        isOpen={showPaymentFailedDialog}
        errorMessage={paymentErrorMessage}
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
    borderRadius: 10,
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
  image: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
});
