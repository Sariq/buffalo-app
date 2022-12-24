import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  DeviceEventEmitter,
} from "react-native";
import InputText from "../controls/input";
import { useState, useEffect } from "react";
import theme from "../../styles/theme.style";
import validateCard, {
  TValidateCardProps,
  TCCDetails,
} from "./api/validate-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import cardValidator from "card-validator";
import isValidID from "../../helpers/validate-id-number";
import Button from "../controls/button/button";
import themeStyle from "../../styles/theme.style";

export type TProps = {
  onSaveCard: () => void;
};
const CreditCard = ({ onSaveCard }) => {
  const [creditCardNumber, setCreditCardNumber] = useState();
  const [creditCardExpDate, setCreditCardExpDate] = useState();
  const [creditCardCVV, setCreditCardCVV] = useState();
  const [cardHolderID, setCardHolderID] = useState();
  const [date, setDate] = useState(new Date());

  const [formStatus, setFormStatus] = useState({
    isNumberValid: undefined,
    isCVVValid: undefined,
    idIDValid: undefined,
  });
  const [isExpDateValid, setIsExpDateValid] = useState(undefined)

  useEffect(() => {
    const ExpDatePicjkerChange = DeviceEventEmitter.addListener(`EXP_DATE_PICKER_CHANGE`, setExpData.bind(this));
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
    const { isValid } :any = cardValidator.number(value);
    console.log(isValid)
    setCreditCardNumber(value);
    setFormStatus({ ...formStatus, isNumberValid: isValid });
  };
  const onCVVChange = (value) => {
    const { isValid } = cardValidator.cvv(value);
    setCreditCardCVV(value);
    setFormStatus({ ...formStatus, isCVVValid: isValid });
  };
  const onCardHolderNameChange = (value) => {
    const isValid: any = isValidID(value);
    setCardHolderID(value);
    setFormStatus({ ...formStatus, idIDValid: isValid });
  };

  const isFormValid = () => {
    console.log(formStatus)
    return !(formStatus.idIDValid && formStatus.isCVVValid && isExpDateValid && formStatus.isNumberValid);
  }

  const onSaveCreditCard = () => {
    const validateCardData: TValidateCardProps = {
      cardNumber: creditCardNumber,
      expDate: moment(date).format("MMYY"),
    };
    validateCard(validateCardData).then(async (res) => {
      if (res.isValid) {
        const ccData: TCCDetails = {
          ccToken: res.ccDetails.ccToken,
          last4Digits: res.ccDetails.last4Digits,
          cvv: creditCardCVV,
          expDate: moment(date).format("MMYY"),
          id: cardHolderID,
        };
        const ccDetailsString = JSON.stringify(ccData);
        await AsyncStorage.setItem("@storage_CCData", ccDetailsString);
        onSaveCard();
      } else {
        // TODO: show try another card modal
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-start" }}>
        <Text style={{ fontSize: 18 }}>הזן פרטי כרטיס אשראי</Text>
      </View>
      <View style={{ marginTop: 25, alignItems: "flex-start" }}>
        <InputText
          label="מספר כרטיס אשראי"
          onChange={onNumberChange}
          value={creditCardNumber}
          keyboardType="numeric"
          isError={formStatus.isNumberValid === false}
        />
        {formStatus.isNumberValid === false && <Text style={{color: themeStyle.ERROR_COLOR }}>מספר לא תקין</Text>}
      </View>
      <View style={styles.monthExpContainer}>
        <InputText
          label="תוקף הכרטיס"
          onChange={() => {}}
          value={creditCardExpDate}
          isEditable={false}
          onClick={() => {
            Keyboard.dismiss();
            showPicker();
          }}
        />
        {isExpDateValid === false && <Text style={{color: themeStyle.ERROR_COLOR }}>מספר לא תקין</Text>}
      </View>
      <View style={{ marginTop: 10, alignItems: "flex-start" }}>
        <InputText
          keyboardType="numeric"
          label="CVV"
          onChange={onCVVChange}
          value={creditCardCVV}
          isError={formStatus.isCVVValid === false}
        />
        {formStatus.isCVVValid === false && <Text style={{color: themeStyle.ERROR_COLOR }}>מספר לא תקין</Text>}
      </View>
      <View style={{ marginTop: 10, alignItems: "flex-start" }}>
        <InputText
          keyboardType="numeric"
          label="תעודת זהות"
          onChange={onCardHolderNameChange}
          value={cardHolderID}
          isError={formStatus.idIDValid === false}
        />
        {formStatus.idIDValid === false && <Text style={{color: themeStyle.ERROR_COLOR }}>מספר לא תקין</Text>}
      </View>
      <View style={{marginTop:20}}>
        <Button
          bgColor={theme.SUCCESS_COLOR}
          onClickFn={onSaveCreditCard}
          disabled={isFormValid()}
          text="שמור כרטיס אשראי"
          fontSize={22}
          textColor={theme.WHITE_COLOR}
        />
          
      </View>
    </View>
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
