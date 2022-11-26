import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

import { useContext } from "react";
import { observer } from "mobx-react";
import { Image, Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import { ToggleButton, Divider, Button } from "react-native-paper";
/* styles */
import theme from "../../styles/theme.style";
import * as Location from "expo-location";
import { CONSTS_ICONS } from "../../consts/consts-icons";
import { SvgXml } from "react-native-svg";
import CheckBox from "../../components/controls/checkbox";
import { StoreContext } from "../../stores";
import Counter from "../../components/controls/counter";
import Icon from "../../components/icon";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CartStore from "../../stores/cart";
import BackButton from "../../components/back-button";

const SHIPPING_METHODS = {
  shipping: "shipping",
  takAway: "take away",
};
const PAYMENT_METHODS = {
  creditCard: "credit card",
  cash: "cash",
};
type TShippingMethod = {
  shipping: string;
  takAway: string;
};
const CartScreen = () => {
  let cartStore = useContext(StoreContext).cartStore;
  const navigation = useNavigation();

  const [shippingMethod, setShippingMethod] = React.useState(
    SHIPPING_METHODS.shipping
  );
  const [paymentMthod, setPaymentMthod] = React.useState(
    PAYMENT_METHODS.creditCard
  );
  const [itemsPrice, setItemsPrice] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (shippingMethod === SHIPPING_METHODS.shipping) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }
  }, [shippingMethod === SHIPPING_METHODS.shipping]);

  useEffect(() => {
    const shippingPrice = shippingMethod === SHIPPING_METHODS.shipping ? 15 : 0;
    setTotalPrice(shippingPrice + itemsPrice);
  }, [shippingMethod === SHIPPING_METHODS.shipping, itemsPrice]);

  useEffect(() => {
    if (cartStore.cartItems.length === 0) {
      navigation.navigate("homeScreen");
      return;
    }
    let tmpOrderPrice = 0;
    cartStore.cartItems.forEach((item) => {
      tmpOrderPrice += item.data.price;
    });
    // console.log(cartStore.cartItems[0].extras["מידת עשיה"])
    setItemsPrice(tmpOrderPrice);
  }, [cartStore.cartItems]);

  const onCheckBoxChange = (isSelected) => {
    console.log(isSelected);
  };
  const onCounterChange = (product, index, value) => {
    cartStore.updateProductCount(product.data.id + index, value);
  };

  const onRemoveProduct = (product, index) => {
    cartStore.removeProduct(product.data.id + index);
  };

  const onSendCart = () => {
    console.log(cartStore.cartItems[0].extra);
  };

  const onEditProduct = (index) => {
    navigation.navigate("meal", { index });
  };

  //   let text = "Waiting..";
  //   if (errorMsg) {
  //     text = errorMsg;
  //   } else if (location) {
  //     text = JSON.stringify(location);
  //   }
  return (
    <ScrollView>
      <View style={{ ...styles.container }}>
        <View>
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
                  borderBottomWidth: 0.5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  <View style={{ marginRight: 50 }}>
                    <Text>{product.data.name}</Text>
                  </View>
                  <View style={{ width: "35%" }}>
                    <Counter
                      value={product.others.count}
                      minValue={1}
                      onCounterChange={(value) => {
                        onCounterChange(product, index, value);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Image
                        style={{ width: 140, height: 140 }}
                        source={product.icon}
                      />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      {product.extras && Object.keys(product.extras).map((key) => (
                        <View>
                          <Text>+ {key}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={{ alignItems: "center", marginRight: 20 }}>
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => {
                        onRemoveProduct(product, index);
                      }}
                    >
                      <View>
                        <Icon
                          icon="trash_icon"
                          size={25}
                          style={{ color: theme.GRAY_700 }}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => {
                        onEditProduct(index);
                      }}
                    >
                      <View>
                        <Text>edit</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 0 }}>
                      <Text>₪{product.data.price}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <ToggleButton.Row
            onValueChange={(value) => setShippingMethod(value)}
            value={shippingMethod}
            style={styles.togglleContainer}
          >
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor:
                  shippingMethod === SHIPPING_METHODS.shipping
                    ? theme.PRIMARY_COLOR
                    : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <Icon
                    icon="shipping_icon"
                    size={25}
                    style={{ color: theme.GRAY_700 }}
                  />
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {" "}
                    משלוח
                  </Text>
                </View>
              )}
              value={SHIPPING_METHODS.shipping}
            />
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor:
                  shippingMethod === SHIPPING_METHODS.takAway
                    ? theme.PRIMARY_COLOR
                    : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    איסוף עצמי
                  </Text>

                  <Icon
                    icon="cart_burger_icon"
                    size={25}
                    style={{ color: theme.GRAY_700 }}
                  />
                </View>
              )}
              value={SHIPPING_METHODS.takAway}
            />
          </ToggleButton.Row>
        </View>

        <View style={{ alignItems: "center" }}>
          {shippingMethod === SHIPPING_METHODS.shipping && location && (
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
          )}
        </View>
        <View>
          <ToggleButton.Row
            onValueChange={(value) => setPaymentMthod(value)}
            value={paymentMthod}
            style={styles.togglleContainer}
          >
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor:
                  paymentMthod === PAYMENT_METHODS.cash
                    ? theme.PRIMARY_COLOR
                    : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>₪</Text>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    מזומן
                  </Text>
                </View>
              )}
              value={PAYMENT_METHODS.cash}
            />
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor:
                  paymentMthod === PAYMENT_METHODS.creditCard
                    ? theme.PRIMARY_COLOR
                    : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    אשראי
                  </Text>
                  <Icon
                    icon="credit_card_icom"
                    size={25}
                    style={{ color: theme.GRAY_700 }}
                  />
                </View>
              )}
              value={PAYMENT_METHODS.creditCard}
            />
          </ToggleButton.Row>
        </View>

        <View style={styles.totalPrictContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>المجموع</Text>
          </View>
          <View style={{ marginTop: 30 }}>
            {shippingMethod === SHIPPING_METHODS.shipping && (
              <View style={styles.priceRowContainer}>
                <View>
                  <Text>مبلغ الطلبية</Text>
                </View>
                <View>
                  <Text>₪{itemsPrice}</Text>
                </View>
              </View>
            )}

            {shippingMethod === SHIPPING_METHODS.shipping && (
              <View style={styles.priceRowContainer}>
                <View>
                  <Text>التوصيل</Text>
                </View>
                <View>
                  <Text>₪15</Text>
                </View>
              </View>
            )}

            <View style={styles.priceRowContainer}>
              <View>
                <Text>المبلغ النهائي</Text>
              </View>
              <View>
                <Text>₪{totalPrice}</Text>
              </View>
            </View>
          </View>
          <View>
            <Button
              labelStyle={{ fontSize: 22 }}
              style={styles.submitButton}
              contentStyle={styles.submitContentButton}
              mode="contained"
              onPress={onSendCart}
            >
              ارسل الظلبية
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(CartScreen);
// MapScreen.navigationOptions = {
//     header: null
// }

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    marginBottom: 40,
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
    marginTop: 40,
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
});
