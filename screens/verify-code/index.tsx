import { StyleSheet, Text, View, DeviceEventEmitter, TouchableOpacity } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { BASE_URL, AUTH_API } from "../../consts/api";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import base64 from "react-native-base64";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { axiosInstance } from "../../utils/http-interceptor";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../../translations/i18n";

const VerifyCodeScreen = ({ route }) => {
  const { authStore, cartStore, userDetailsStore } = useContext(StoreContext);
  const [t, i18n] = useTranslation();
  const { phoneNumber } = route.params;

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const [verifyCode, setVerifyCode] = useState();
  const onChange = (value) => {
    setIsValid(true);
    setVerifyCode(value);
  };

  const resendMeTheCode = () =>{
    
  }

  const isValidNunber = () => {
    return verifyCode?.match(/\d/g).length === 4;
  };

  const onVerifyCode = () => {
    if (isValidNunber()) {
      setIsLoading(true);
      const body = {
        token: authStore.verifyCodeToken,
        secret_code: verifyCode,
      };
      axiosInstance
        .post(
          `${AUTH_API.CONTROLLER}/${AUTH_API.VERIFY_API}`,
          base64.encode(JSON.stringify(body)),
          { headers: { "Content-Type": "application/json" } }
        )
        .then(function (response) {
          const res = JSON.parse(base64.decode(response.data));
          console.log("tokennnn", res.token);
          authStore.updateUserToken(res.token);
          DeviceEventEmitter.emit(`PREPARE_APP`);

          userDetailsStore.getUserDetails().then((res) => {
            setIsLoading(false);
            if (cartStore.getProductsCount() > 0) {
              navigation.navigate("cart");
            } else {
              navigation.navigate("profile");
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setIsValid(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>{t("inser-code")}</Text>
        <Text
          style={{
            marginTop: 20,
            fontSize: 17,
            paddingHorizontal: 15,
            textAlign: "center",
          }}
        >
          {t("inser-recived-number")} {phoneNumber}
        </Text>

        <View
          style={{
            width: "100%",
            paddingHorizontal: 50,
            marginTop: 15,
            alignItems: "flex-start",
          }}
        >
          <InputText keyboardType="numeric" onChange={onChange} label="الكود" />
          {!isValid && (
            <Text style={{ color: themeStyle.ERROR_COLOR, paddingLeft: 15 }}>
              {t("invalid-code")}
            </Text>
          )}
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{fontSize:17, fontFamily: `${getCurrentLang()}-SemiBold`}}>{t("didnt-recive-sms")} ?</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity>
            <Text style={{fontSize:17, fontFamily: `${getCurrentLang()}-SemiBold`,color: themeStyle.SUCCESS_COLOR, textDecorationLine: 'underline', padding:5}}>{t("resend-sms")}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text={t("approve")}
            fontSize={20}
            onClickFn={onVerifyCode}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
};
export default observer(VerifyCodeScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inputsContainer: {
    marginTop: 30,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});
