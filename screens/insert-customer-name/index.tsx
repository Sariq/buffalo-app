import { StyleSheet, Text, View, DeviceEventEmitter } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { BASE_URL, AUTH_API } from "../../consts/api";
import { useState } from "react";
import * as Device from "expo-device";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import base64 from 'react-native-base64'
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import CreditCard from "../../components/credit-card";
import { axiosInstance } from "../../utils/http-interceptor";
import { useTranslation } from "react-i18next";

const InsertCustomerNameScreen = () => {
  const { t } = useTranslation();
  const { cartStore, userDetailsStore } = useContext(StoreContext);

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState();
  const [isValid, setIsValid] = useState(true);
  const onChange = (value) => {
    setIsValid(true);
    setCustomerName(value);
  };

  const isValidName = () =>{
    return customerName?.length>=2
  }

  const updateCutsomerName = () => {
    if(isValidName()){
      setIsLoading(true);
      const body = {
        name: customerName,
        datetime: new Date(),
      };
      axiosInstance
        .post(
          `${AUTH_API.CONTROLLER}/${AUTH_API.UPDATE_CUSTOMER_NAME_API}`,
          base64.encode(JSON.stringify(body))
        )
        .then(function (response) {
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
        });
    }else{
      setIsValid(false);
    }
  };

  return (

    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>{t('insert-customer-name')}</Text>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 15, alignItems: "flex-start" }}>
          <InputText  onChange={onChange} label={t('name')} />
          {!isValid && <Text style={{color: themeStyle.ERROR_COLOR, paddingLeft:15 }}>{t('invalid-name')}</Text>}
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text={t('approve')}
            fontSize={20}
            onClickFn={updateCutsomerName}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
}
export default observer(InsertCustomerNameScreen);

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
