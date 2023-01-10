import { StyleSheet, Text, View } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { AUTH_API } from "../../consts/api";
import { useState } from "react";
import * as Device from "expo-device";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import base64 from 'react-native-base64'
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { axiosInstance } from "../../utils/http-interceptor";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = () => {
  const { t } = useTranslation();
  const { languageStore, authStore } = useContext(StoreContext);

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isValid, setIsValid] = useState(true);
  const onChange = (value) => {
    setIsValid(true);
    setPhoneNumber(value);
  };

  const isValidNunber = () =>{
    return phoneNumber?.match(/\d/g).length===10
  }
  const ifUserBlocked = async () => {
    const userB = await AsyncStorage.getItem("@storage_user_b");
    const userBJson = JSON.parse(userB);
    console.log("userBJson",userBJson)
    if(userBJson){
      return true;
    }
    console.log("ifUserBlocked-false")

    return false;
  }
  const authinticate = async () => {
    if(isValidNunber()){
      setIsLoading(true);

      if(await ifUserBlocked()){
        console.log("ifUserBlocked")

        return;
      }

      const body = {
        phone: phoneNumber,
        device_type: Device.osName || "IOS",
        language: languageStore.selectedLang === "ar" ? 0 : 1,
        datetime: new Date(),
      };
      axiosInstance
        .post(
          `${AUTH_API.CONTROLLER}/${AUTH_API.AUTHINTICATE_API}`,
          base64.encode(JSON.stringify(body)),{ headers: { "Content-Type": "application/json" } }
        )
        .then(async function (response) {
          setIsLoading(false);
          const res = JSON.parse(base64.decode(response.data));
          if (res.has_err ) {
            if(res.code == PHONE_NUMBER_BLOCKED){
              setIsLoading(false);
              await AsyncStorage.setItem("@storage_user_b", JSON.stringify(true));
              return;
            }
          }
          authStore.setVerifyCodeToken(res.token);
          navigation.navigate("verify-code", {phoneNumber});
        })
        .catch(function (error) {
          console.log(error);
        });
    }else{
      setIsValid(false);
    }
  };

  return (

    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>{t('insert-phone-number')}</Text>
        <Text style={{ marginTop: 20, fontSize: 17 }}>
        {t('will-send-sms-with-code')}
        </Text>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 15, alignItems: "flex-start" }}>
          <InputText keyboardType="numeric" onChange={onChange} label={t('phone')} />
          {!isValid && <Text style={{color: themeStyle.ERROR_COLOR, paddingLeft:15 }}>{t('invalid-phone')}</Text>}
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text={t('verify-phone-number')}
            fontSize={20}
            onClickFn={authinticate}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
}
export default observer(LoginScreen);

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
