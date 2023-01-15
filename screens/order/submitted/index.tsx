import { StyleSheet, Text, View, Image } from "react-native";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { SHIPPING_METHODS } from "../../cart/cart";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../../../translations/i18n";

const OrderSubmittedScreen = ({ route }) => {
  const { t } = useTranslation();
  const { shippingMethod } = route.params;
  const navigation = useNavigation();

  const goToOrderStatus = () => {
    navigation.navigate("orders-status");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", paddingHorizontal: 40 }}>
          <Text
            style={{
              ...styles.textLang,
              fontFamily: "ar-SemiBold",
            }}
          >
            {t("order-succefully-sent")}
          </Text>
          <View style={{ alignItems: "center", height: 300 }}>
            {shippingMethod === SHIPPING_METHODS.shipping && (
              <Image
                source={require("../../../assets/order/order-delivery.png")}
              />
            )}
            {shippingMethod === SHIPPING_METHODS.takAway && (
              <Image
                source={require("../../../assets/order/order-take-away.png")}
              />
            )}
            {shippingMethod === SHIPPING_METHODS.table && (
              <Image
                source={require("../../../assets/order/order-take-away.png")}
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
