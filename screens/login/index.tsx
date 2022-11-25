import { StyleSheet, Text, View } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { BASE_URL, AUTH_API } from "../../consts/api";
import { useState } from "react";
import * as Device from "expo-device";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import axios from "axios";
import base64 from 'react-native-base64'
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { languageStore, authStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState();
  const onChange = (value) => {
    setPhoneNumber(value);
  };

  const authinticate = () => {
    navigation.navigate("verify-code");

    // const body = {
    //   phone: phoneNumber,
    //   device_type: Device.deviceName || "IOS",
    //   language: languageStore.selectedLang === "ar" ? 0 : 1,
    //   datetime: new Date(),
    // };
    // axios
    //   .post(
    //     `${BASE_URL}/${AUTH_API.CONTROLLER}/${AUTH_API.AUTHINTICATE_API}`,
    //     base64.encode(JSON.stringify(body)),{ headers: { "Content-Type": "application/json" } }
    //   )
    //   .then(function (response) {
    //     const res = JSON.parse(base64.decode(response.data));
    //     authStore.setVerifyCodeToken(res.token);
    //     navigation.navigate("verify-code");
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>ادخل رقم هاتفك</Text>
        <Text style={{ marginTop: 20, fontSize: 17 }}>
          سوف نبعث لك رسالة مع رقم سري
        </Text>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 15 }}>
          <InputText onChange={onChange} label="هاتف" />
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text={"تحقق من رقم الهاتف"}
            fontSize={20}
            onClickFn={authinticate}
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
    borderWidth: 1,
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});
