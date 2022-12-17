import { StyleSheet, Text, View, Image } from "react-native";
import { useContext } from "react";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../../../stores";
import i18n from "../../../translations";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";

const OrderSubmittedScreen = () => {
  const { languageStore, globalStyles } = useContext(StoreContext);
  const navigation = useNavigation();

  const onChangeLanguage = (lng) => {
    languageStore.changeLang(lng);
    navigation.goBack();
  };

  return (
    <View style={styles(globalStyles).container}>
      <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", paddingHorizontal: 40 }}>
          <Text
            style={{
              ...styles(globalStyles).textLang,
              fontFamily: "ar-SemiBold",
            }}
          >
            تم ارسال الطلبية بنجاح
          </Text>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../../assets/order/order-delivery.png")}
            />
          </View>
          <View>
            <Text
              style={{
                ...styles(globalStyles).textLang,
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

const styles = (props) =>
  StyleSheet.create({
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
