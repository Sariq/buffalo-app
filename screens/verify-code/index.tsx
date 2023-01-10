import {
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  
} from "react-native-confirmation-code-field";
const CELL_COUNT = 4;

const VerifyCodeScreen = ({ route }) => {
  const { t } = useTranslation();
  const { authStore, cartStore, userDetailsStore } = useContext(StoreContext);
  const { phoneNumber } = route.params;

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isInvalidCodeRes, setIsInvalidCodeRes] = useState(false);
  const [timer, setTimer] = useState(0);


  const [verifyCode, setVerifyCode] = useState("");
  const ref = useBlurOnFulfill({ value: verifyCode, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verifyCode,
    setValue: setVerifyCode,
  });


  useEffect(() => {
    console.log(verifyCode);
  }, [verifyCode]);

  const onChange = (value) => {
    setIsValid(true);
    setVerifyCode(value);
  };

  const setTimertInterVal = async () => {
    let timerIntreval;
    clearInterval(timerIntreval);

    const verifyDataFinal = await AsyncStorage.getItem("@storage_verifyCode");
    const verifyDataValueFinal = JSON.parse(verifyDataFinal);

    let interval = 1000;
    let seconds = 30 * verifyDataValueFinal?.count;
    timerIntreval = setInterval(function () {
      seconds = seconds - 1;
      if (seconds === 0) {
        clearInterval(timerIntreval);
      }
      setTimer(seconds);
    }, interval);
  };
  useEffect(() => {
    //setTimertInterVal();
  }, []);

  const resendMeTheCode = async () => {
    setIsInvalidCodeRes(false);
    let timerIntreval;
    const verifyData = await AsyncStorage.getItem("@storage_verifyCode");
    const verifyDataValue = JSON.parse(verifyData);
    if (!verifyDataValue) {
      const data = {
        date: new Date(),
        count: 1,
      };
      await AsyncStorage.setItem("@storage_verifyCode", JSON.stringify(data));
    } else {
      var end = moment(new Date());
      var now = moment(verifyDataValue.date);
      var duration = moment.duration(end.diff(now));
      let newCount = verifyDataValue.count * 2;

      if (duration.asMinutes() > 10) {
        newCount = 1;
      }
      const data = {
        date: new Date(),
        count: newCount,
      };
      await AsyncStorage.setItem("@storage_verifyCode", JSON.stringify(data));
    }

    setTimertInterVal();
    navigation.navigate("login");
  };

  const isValidNunber = () => {
    if (verifyCode === "****") {
      return false;
    }
    return verifyCode?.match(/\d/g).length === 4;
  };

  const onVerifyCode = () => {
    setIsInvalidCodeRes(false);
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
        .then(async function (response) {
          await AsyncStorage.removeItem("@storage_verifyCode");
          const res = JSON.parse(base64.decode(response.data));
          if (res.has_err && res.code == -3) {
            setIsLoading(false);
            setIsInvalidCodeRes(true);
            return;
          }
          await authStore.updateUserToken(res.token);
          if (res.name) {
            DeviceEventEmitter.emit(`PREPARE_APP`);
            userDetailsStore.getUserDetails().then((res) => {
              setIsLoading(false);
              if (cartStore.getProductsCount() > 0) {
                navigation.navigate("cart");
              } else {
                navigation.navigate("profile");
              }
            });
          } else {
            navigation.navigate("insert-customer-name");
          }
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
      <View style={{ marginTop: 20 }}>
        <Image
          style={{ width: 190, height: 140 }}
          source={require("../../assets/insert_code.png")}
        />
      </View>
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 0, fontSize: 25 }}>{t("inser-code")}</Text>
        <Text
          style={{
            marginTop: 20,
            fontSize: 17,
            paddingHorizontal: 30,
            textAlign: "center",
          }}
        >
          {t("inser-recived-number")} {phoneNumber}
        </Text>

        {isInvalidCodeRes && (
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 20, color:themeStyle.ERROR_COLOR}}>{t("invalid-code-res")}</Text>
          </View>
        )}

        <View
          style={{
            width: "100%",
            paddingHorizontal: 50,
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <View style={{ direction: "ltr" }}>
            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={verifyCode}
              onChangeText={setVerifyCode}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              
              renderCell={({ index, symbol, isFocused }) => {
                console.log(verifyCode)

                return(
                <View
                  style={{
                    borderBottomWidth: 2,
                    marginHorizontal: 10,
                    borderColor: themeStyle.PRIMARY_COLOR,
                  }}
                >
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : (verifyCode[index]!=='')  && '*')}
                  </Text>
                </View>
              )}}
            />
          </View>
          {!isValid && (
            <Text
              style={{
                color: themeStyle.ERROR_COLOR,
                paddingLeft: 15,
                marginTop: 20,
              }}
            >
              {t("invalid-code")}
            </Text>
          )}
        </View>
        <View style={{ marginTop: 20 }}>
          {timer > 0 && (
            <Text>
              {t("can-send-again")} {timer}
            </Text>
          )}
          {timer == 0 && (
            <Text
              style={{
                fontSize: 17,
                fontFamily: `${getCurrentLang()}-SemiBold`,
              }}
            >
              {t("didnt-recive-sms")} ?
            </Text>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity disabled={timer > 0} onPress={resendMeTheCode}>
            <Text
              style={{
                fontSize: 17,
                fontFamily: `${getCurrentLang()}-SemiBold`,
                color:
                  timer > 0 ? themeStyle.GRAY_300 : themeStyle.SUCCESS_COLOR,
                textDecorationLine: "underline",
                padding: 5,
                opacity: 0.5,
              }}
            >
              {t("resend-sms")}
            </Text>
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
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 66,
    height: 66,
    lineHeight: 65,
    fontSize: 30,
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});
