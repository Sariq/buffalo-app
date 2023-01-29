import { StyleSheet, View, Image } from "react-native";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../../../translations/i18n";
import { useEffect, useContext } from "react";
import { StoreContext } from "../../../stores";
import { SHIPPING_METHODS } from "../../../consts/shared";
import Icon from "../../../components/icon";
import Text from "../../../components/controls/Text";

const OrderSubmittedScreen = ({ route }) => {
  const { t } = useTranslation();
  const { ordersStore } = useContext(StoreContext);
  const { shippingMethod } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    ordersStore.getOrders();
  }, []);

  const goToOrderStatus = () => {
    navigation.navigate("orders-status");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <View
          style={{ alignItems: "center", paddingHorizontal: 0, width: "100%" }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                ...styles.textLang,
                fontFamily: `${getCurrentLang()}-Bold`,
                marginRight: 10,
              }}
            >
              {t("order-succefully-sent")}
            </Text>
            <Icon icon="checked-green" size={40} />
          </View>

          <View
            style={{
              alignItems: "center",
              height: 275,
              width: "100%",
              marginBottom: 20,
            }}
          >
            {shippingMethod === SHIPPING_METHODS.shipping && (
              <Image
                source={require("../../../assets/order/delivery.png")}
                style={{ width: "100%", height: "100%", marginTop: 10 }}
                resizeMode="contain"
              />
            )}
            {shippingMethod === SHIPPING_METHODS.takAway && (
              <Image
                source={require("../../../assets/order/take-away.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  marginTop: 20,
                }}
              />
            )}
            {shippingMethod === SHIPPING_METHODS.table && (
              <Image
                source={require("../../../assets/order/order-table.png")}
                style={{ width: "100%", height: "100%", marginTop: 10 }}
                resizeMode="contain"
              />
            )}
          </View>
          <View>
            <Text
              style={{
                ...styles.textLang,
                fontFamily: "ar-SemiBold",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              {shippingMethod === SHIPPING_METHODS.takAway && (
                <Text>{t("you-choosed-takeaway-text")}</Text>
              )}
              {shippingMethod === SHIPPING_METHODS.shipping && (
                <Text>{t("you-choosed-delivery-text")}</Text>
              )}
              {shippingMethod === SHIPPING_METHODS.table && (
                <Text>{t("you-choosed-table-text")}</Text>
              )}
            </Text>
          </View>
        </View>
        <View style={{ width: "80%", marginTop: 80 }}>
          <View>
            <Button
              onClickFn={() => {
                goToOrderStatus();
              }}
              bgColor={themeStyle.SUCCESS_COLOR}
              textColor={themeStyle.WHITE_COLOR}
              fontSize={20}
              fontFamily={`${getCurrentLang()}-SemiBold`}
              text={t("current-orderds")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default observer(OrderSubmittedScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  textLang: {
    fontSize: 25,
    textAlign: "left",
  },
});
