import { StyleSheet, Text, View, Image } from "react-native";
import { useContext, useEffect } from "react";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../../../stores";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { axiosInstance } from "../../../utils/http-interceptor";
import { UTILITIES_API } from "../../../consts/api";
import { toBase64, fromBase64 } from "../../../helpers/convert-base64";

const OrdersStatusScreen = ({ route }) => {

  const { languageStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const onChangeLanguage = (lng) => {
    languageStore.changeLang(lng);
    navigation.goBack();
  };

  const getOrders = () => {
    const body = {datetime: new Date()};
    return axiosInstance
      .post(
        `${UTILITIES_API.CONTROLLER}/${UTILITIES_API.GET_ORDERS_API}`,
       toBase64(body),
      )
      .then(function (response) {
        const res = JSON.parse(fromBase64(response.data));
        console.log("ORDERS", res)
        return res;
      })
  }

  useEffect(()=>{
    getOrders();
  },[])

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
              <Image
                source={require("../../../assets/order/order-delivery.png")}
              />

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
export default observer(OrdersStatusScreen);

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
