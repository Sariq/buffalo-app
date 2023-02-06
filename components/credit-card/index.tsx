import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputText from "../controls/input";
import { useState, useEffect } from "react";
import theme from "../../styles/theme.style";
import validateCard, {
  TValidateCardProps,
  TCCDetails,
} from "./api/validate-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cardValidator from "card-validator";
import isValidID from "../../helpers/validate-id-number";
import Button from "../controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useTranslation } from "react-i18next";
import isValidEmail from "../../helpers/validate-email";

export type TProps = {
  onSaveCard: () => void;
};
const CreditCard = ({ onSaveCard }) => {
  const { t } = useTranslation();

  const [creditCardNumber, setCreditCardNumber] = useState();
  const [creditCardExpDate, setCreditCardExpDate] = useState();
  const [creditCardCVV, setCreditCardCVV] = useState();
  const [cardHolderID, setCardHolderID] = useState();
  const [ccType, setCCType] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [formStatus, setFormStatus] = useState({
    isNumberValid: undefined,
    isCVVValid: undefined,
    idIDValid: undefined,
    isEmailValid: undefined,
  });
  const [isExpDateValid, setIsExpDateValid] = useState(undefined);

  useEffect(() => {
    const ExpDatePicjkerChange = DeviceEventEmitter.addListener(
      `EXP_DATE_PICKER_CHANGE`,
      setExpData.bind(this)
    );
    return () => {
      ExpDatePicjkerChange.remove();
    };
  }, []);

  const setExpData = (data) => {
    const validation: any = cardValidator.expirationDate(data.expDate);
    setCreditCardExpDate(data.expDate);
    setIsExpDateValid(validation?.isValid);
  };

  const showPicker = () => {
    DeviceEventEmitter.emit(`SHOW_EXP_DATE_PICKER`, { show: true });
  };

  const onNumberChange = (value) => {
    const { isValid, card }: any = cardValidator.number(value);
    if(isValid){
      Keyboard.dismiss();
      setCCType(card?.type)
    }
    setCreditCardNumber(value);
    setFormStatus({ ...formStatus, isNumberValid: isValid });
  };
  const onCVVChange = (value) => {
    const { isValid } = cardValidator.cvv(value);
    if(isValid){
      Keyboard.dismiss();
    }
    setCreditCardCVV(value);
    setFormStatus({ ...formStatus, isCVVValid: isValid });
  };
  const onCardHolderNameChange = (value) => {
    const isValid: any = isValidID(value);
    if(isValid){
      Keyboard.dismiss();
    }
    setCardHolderID(value);
    setFormStatus({ ...formStatus, idIDValid: isValid });
  };
  const onEmailChange = (value) => {
    if(value){
      const isValid: any = isValidEmail(value);
      setFormStatus({ ...formStatus, isEmailValid: isValid });
    }else{
      setFormStatus({ ...formStatus, isEmailValid: true });
    }
    setEmail(value);
  };

  const isFormValid = () => {
    return !(
      formStatus.idIDValid &&
      formStatus.isCVVValid &&
      isExpDateValid &&
      formStatus.isNumberValid &&
      formStatus.isEmailValid
    );
  };

  const onSaveCreditCard = () => {
    setIsLoading(true);
    const validateCardData: TValidateCardProps = {
      cardNumber: creditCardNumber,
      expDate: creditCardExpDate.replace("/", ""),
    };

    validateCard(validateCardData).then(async (res) => {
      if (res.isValid) {
        const ccData: TCCDetails = {
          ccToken: res.ccDetails.ccToken,
          last4Digits: res.ccDetails.last4Digits,
          id: cardHolderID,
          ccType: ccType,
          email: email,
          cvv: creditCardCVV?.toString(),
        };
        const ccDetailsString = JSON.stringify(ccData);
        await AsyncStorage.setItem("@storage_CCData", ccDetailsString);
        setIsLoading(false);
        onSaveCard();
      } else {
        // TODO: show try another card modal
      }
    });
  };
  const [keyboardVerticalOffset, setkeyboardVerticalOffset] = useState(0);
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior="position"
    >
      <View style={styles.container}>
        <View style={{ marginTop: 25, alignItems: "flex-start" }}>
          <InputText
            label={t("credit-card-number")}
            onChange={onNumberChange}
            value={creditCardNumber}
            keyboardType="numeric"
            isError={formStatus.isNumberValid === false}
            variant="default"
            placeHolder="xxxx-xxxx-xxxx-xxxx"
          />
          {formStatus.isNumberValid === false && (
            <Text style={{ color: themeStyle.ERROR_COLOR,paddingLeft: 20 }}>{t('invalid-cc-number')}</Text>
          )}
        </View>
        <View style={styles.monthExpContainer}>
          <InputText
            label={t("expiry-date")}
            onChange={() => {}}
            value={creditCardExpDate}
            isEditable={Platform.OS === "android"
            ? true
            : false}
            onClick={() => {
              Keyboard.dismiss();
              showPicker();
            }}
            variant="default"
          />
          {isExpDateValid === false && (
            <Text style={{ color: themeStyle.ERROR_COLOR,paddingLeft: 20 }}>{t('invalid-expiry-date')}</Text>
          )}
        </View>
        <View style={{ marginTop: 10, alignItems: "flex-start" }}>
          <InputText
            keyboardType="numeric"
            label="CVV"
            onChange={onCVVChange}
            value={creditCardCVV}
            isError={formStatus.isCVVValid === false}
            variant="default"
          />
          {formStatus.isCVVValid === false && (
            <Text style={{ color: themeStyle.ERROR_COLOR,paddingLeft: 20 }}>{t('invalid-cvv')}</Text>
          )}
        </View>
        <View style={{ marginTop: 10, alignItems: "flex-start" }}>
          <InputText
            keyboardType="numeric"
            label={t("id-number")}
            onChange={onCardHolderNameChange}
            value={cardHolderID}
            isError={formStatus.idIDValid === false}
            variant="default"
            onFocus={() => setkeyboardVerticalOffset(150)}
            onBlur={() => setkeyboardVerticalOffset(0)}
          />
          {formStatus.idIDValid === false && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>{t('invalid-id-number')}</Text>
          )}
        </View>
        <View style={{ marginTop: 10, alignItems: "flex-start" }}>
          <InputText
            label={`${t("email")} - ${t("not-required")}`}
            onChange={onEmailChange}
            value={email}
            variant="default"
            onFocus={() => setkeyboardVerticalOffset(250)}
            onBlur={() => setkeyboardVerticalOffset(0)}
          />
          {formStatus.isEmailValid === false && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>{t('invalid-email')}</Text>
          )}
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            bgColor={theme.SUCCESS_COLOR}
            onClickFn={onSaveCreditCard}
            disabled={isFormValid() || isLoading}
            text={t("save-credit-card")}
            fontSize={22}
            textColor={theme.WHITE_COLOR}
            isLoading={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  container: {},
  monthExpContainer: { marginTop: 10, alignItems: "flex-start" },
  monthExpContainerChild: {},
  submitButton: {
    backgroundColor: theme.SUCCESS_COLOR,
    borderRadius: 15,
    marginTop: 30,
  },
  submitContentButton: {
    height: 50,
  },
});
