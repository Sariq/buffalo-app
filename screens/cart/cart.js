import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { useContext } from "react";
import { observer } from "mobx-react";
import { Image, Text, View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";
import { ToggleButton, Divider, Button } from "react-native-paper";
/* styles */
import theme from "../../styles/theme.style";
import sharedStyles from "../../styles/shared-styles";
import * as Location from "expo-location";
import { CONSTS_ICONS } from "../../consts/consts-icons";
import { SvgXml } from "react-native-svg";
import CheckBox from "../../components/controls/checkbox";
import { StoreContext } from "../../stores";
import Counter from "../../components/controls/counter";
import Icon from "../../components/icon";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CartStore from "../../stores/cart";

const CartScreen = () => {
  let cartStore = useContext(StoreContext);
  const navigation = useNavigation();

  const [isShipping, setIsShipping] = React.useState(true);
  const [isCreditCard, setIsCreditCard] = React.useState(true);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isShipping) {
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
  }, [isShipping]);

  useEffect(() => {
    if (cartStore.cartItems.length === 0) {
      navigation.navigate("homeScreen");
    }
  }, [cartStore.cartItems]);

  const onCheckBoxChange = (isSelected) => {
    console.log(isSelected);
  };
  const onCounterChange = (value) => {
    console.log(value);
  };

  const onRemoveProduct = (product, index) => {
    cartStore.removeProduct(product.id + index);
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
          {cartStore.cartItems.map((product, index) => (
            <View
              style={{
                marginTop: 20,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <View style={{ marginRight: 20 }}>
                  <Text>{product.name}</Text>
                </View>
                <View style={{ width: "35%" }}>
                  <Counter
                    value={product.others.count}
                    onCounterChange={onCounterChange}
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
                    {Object.keys(product.extras).map(
                      (key) =>
                        product.extras[key] > 0 && (
                          <View>
                            <Text>+ {key}</Text>
                          </View>
                        )
                    )}
                  </View>
                </View>

                <View style={{ alignItems: "center"}}>
                  <TouchableOpacity
                  style={{padding: 5}}
                    onPress={() => {
                      onRemoveProduct(product, index);
                    }}
                  >
                    <View>
                      <Icon
                        icon="trash_icon"
                        size={25}
                        style={{ color: "black" }}
                      />
                    </View>
                  </TouchableOpacity>

                  <View style={{ marginTop: 0 }}>
                    <Text>₪{product.price}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <ToggleButton.Row
            onValueChange={(value) => value != null && setIsShipping(value)}
            value={isShipping}
            style={styles.togglleContainer}
          >
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor: isShipping ? theme.PRIMARY_COLOR : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <SvgXml
                    color={theme.GRAY_700}
                    xml={CONSTS_ICONS.shippingIcon}
                  />
                  <Text> משלוח</Text>
                </View>
              )}
              value={true}
            />
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor: !isShipping ? theme.PRIMARY_COLOR : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <Text>איסוף עצמי</Text>
                  <SvgXml
                    color={theme.GRAY_700}
                    xml={CONSTS_ICONS.shippingIcon}
                  />
                </View>
              )}
              value={false}
            />
          </ToggleButton.Row>
        </View>

        <View style={{ alignItems: "center" }}>
          {isShipping && location && (
            <MapView
              style={styles.mapContainer}
              initialRegion={{
                latitude: location.coords.latitude,
                latitudeDelta: 0.01,
                longitude: location.coords.longitude,
                longitudeDelta: 0.01,
              }}
            >
              <MapView.Marker
                title="YIKES, Inc."
                description="Web Design and Development"
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
            onValueChange={(value) => value != null && setIsCreditCard(value)}
            value={isCreditCard}
            style={styles.togglleContainer}
          >
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor: !isCreditCard ? theme.PRIMARY_COLOR : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <SvgXml
                    color={theme.GRAY_700}
                    xml={CONSTS_ICONS.shippingIcon}
                  />
                  <Text>מזומן</Text>
                </View>
              )}
              value={false}
            />
            <ToggleButton
              style={{
                ...styles.togglleCItem,
                backgroundColor: isCreditCard ? theme.PRIMARY_COLOR : "white",
              }}
              icon={() => (
                <View style={styles.togglleItemContentContainer}>
                  <Text>אשראי</Text>
                  <SvgXml
                    color={theme.GRAY_700}
                    xml={CONSTS_ICONS.shippingIcon}
                  />
                </View>
              )}
              value={true}
            />
          </ToggleButton.Row>
        </View>

        <View style={styles.totalPrictContainer}>
          <View style={{ alignItems: "center", fontWeight: "bold" }}>
            <Text style={{ fontWeight: "bold" }}>מחיר לתשלום</Text>
          </View>
          <View style={{ marginTop: 30 }}>
            <View style={styles.priceRowContainer}>
              <View>
                <Text>מחיר לתשלום</Text>
              </View>
              <View>
                <Text>מחיר לתשלום</Text>
              </View>
            </View>

            <View style={styles.priceRowContainer}>
              <View>
                <Text>מחיר לתשלום</Text>
              </View>
              <View>
                <Text>מחיר לתשלום</Text>
              </View>
            </View>

            <Divider style={styles.priceRowContainer} />

            <View style={styles.priceRowContainer}>
              <View>
                <Text>מחיר לתשלום</Text>
              </View>
              <View>
                <Text>מחיר לתשלום</Text>
              </View>
            </View>
          </View>
          <View>
            <Button
              labelStyle={{ fontSize: 22 }}
              style={styles.submitButton}
              contentStyle={styles.submitContentButton}
              mode="contained"
              onPress={() => console.log("Pressed")}
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
// import { StyleSheet, Text, View } from "react-native";

// export default function CartScreen() {
//   return (
//     <View >
//       <Text>CartScreen</Text>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footerTabs: {
//     backgroundColor: "blue",
//     width: "100%",
//     position: "absolute",
//     bottom: 0,
//   },
// });
