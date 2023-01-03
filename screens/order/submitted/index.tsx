import { StyleSheet, Text, View, Image } from "react-native";
import { useContext } from "react";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../../../stores";
import i18n from "../../../translations/index-x";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { SHIPPING_METHODS } from "../../cart/cart";

const OrderSubmittedScreen = ({ route }) => {
  const { shippingMethod } = route.params;

  const { languageStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const onChangeLanguage = (lng) => {
    languageStore.changeLang(lng);
    navigation.goBack();
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
            تم ارسال الطلبية بنجاح
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
              لقد اخترت بخدمة ارسالية بعد الانتهاء من التجهيز سيتصل بك مندوب
              خدمة التوصيل لإكمال عمليه التوصيل للموقع الذي اخترته خلال الطلبية
              .
            </Text>
          </View>
        </View>
        <View style={{ width: "80%", marginTop: 80 }}>
          <View>
            <Button
              onClickFn={() => {
                onChangeLanguage("ar");
              }}
              bgColor={themeStyle.SUCCESS_COLOR}
              textColor={themeStyle.WHITE_COLOR}
              fontSize={20}
              fontFamily="ar-SemiBold"
              text="طلبيات حاليه"
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
      //   fontFamily: props.fontFamily + "Bold",
      fontSize: 25,
      textAlign: "left",
    },
  });
