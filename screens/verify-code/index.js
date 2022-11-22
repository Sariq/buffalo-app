import { StyleSheet, Text, View } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { BASE_URL, AUTH_API } from "../../consts/api";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import axios from "axios";
import base64 from "react-native-base64";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";

const VerifyCodeScreen = () => {
  const { authStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const [verifyCode, setVerifyCode] = useState();
  const onChange = (value) => {
    setVerifyCode(value);
  };

  useEffect(()=>{
    console.log("userToken", authStore.userToken);

  },[authStore.userToken])

  const onVerifyCode = () => {
    const body = {
      token: authStore.verifyCodeToken,
      secret_code: verifyCode,
    };
    axios
      .post(
        `${BASE_URL}/${AUTH_API.CONTROLLER}/${AUTH_API.VERIFY_API}`,
        base64.encode(JSON.stringify(body)),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(function (response) {
        const res = JSON.parse(base64.decode(response.data));
        console.log("tokennnn", res.token);
        authStore.updateUserToken(res.token);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>ادخل الكود</Text>
        <Text style={{ marginTop: 20, fontSize: 17 }}>
          سوف تصلك رسالة SMS تتضمن الكود
        </Text>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 15 }}>
          <InputText onChange={onChange} label="الكود" />
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text="تم"
            fontSize={20}
            onClickFn={onVerifyCode}
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
    borderWidth: 1,
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});
