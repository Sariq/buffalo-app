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
import { Button } from "react-native-paper";
import validateCard, { TValidateCardProps, TCCDetails } from "./api/validate-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import cardValidator from "card-validator";

export type TProps = {
  onSaveCard: ()=> void
}
const CreditCard = ({onSaveCard}) => {
  const [creditCardNumber, setCreditCardNumber] = useState();
  const [creditCardExpDate, setCreditCardExpDate] = useState();
  const [creditCardCVV, setCreditCardCVV] = useState();
  const [cardHolderID, setCardHolderID] = useState();
  const [date, setDate] = useState(new Date());

  const [formStatus, setFormStatus] = useState({
    isNumberValid: false,
    isExpDateValid: false,
    isCVVValid: false,
    idIDValid: false,
  });

  useEffect(() => {
    DeviceEventEmitter.addListener(`EXP_DATE_PICKER_CHANGE`, setExpData);
  }, []);

  const setExpData = (data) => {
    console.log(data);
    const validation:any = cardValidator.expirationDate(data.expDate);
    setFormStatus({...formStatus, isExpDateValid: validation?.isValid })
    setCreditCardExpDate(data.expDate);
  };

  const showPicker = () => {
    console.log("xxx");
    DeviceEventEmitter.emit(`SHOW_EXP_DATE_PICKER`, { show: true });
  };
  const onNumberChange = (value) => {
    const { card } = cardValidator.number(value);
    setCreditCardNumber(value);
    setFormStatus({...formStatus, isNumberValid: !!card })
  };

  const onCVVChange = (value) => {
    const { isValid } = cardValidator.cvv(value);
    setCreditCardCVV(value);
    setFormStatus({...formStatus, isCVVValid: isValid })
  };
  const onCardHolderNameChange = (value) => {
    const validation:any = cardValidator.number(value, {maxLength: 16});
    setCardHolderID(value);
    setFormStatus({...formStatus, idIDValid: validation.isValid })
  };


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
          id: cardHolderID
        }
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
      <View style={{ marginTop: 10, alignItems: "flex-start" }}>
        <InputText
          label="מספר כרטיס אשראי"
          onChange={onNumberChange}
          value={creditCardNumber}
          keyboardType="numeric"
        />
        {!formStatus.isNumberValid && <Text>מספר לא תקין</Text>}
      </View>
      <View style={styles.monthExpContainer}>
        <View style={styles.monthExpContainerChild}>
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
        </View>
        {!formStatus.isExpDateValid && <Text>מספר לא תקין</Text>}
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText
          keyboardType="numeric"
          label="CVV"
          onChange={onCVVChange}
          value={creditCardCVV}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText
          keyboardType="numeric"
          label="תעודת זהות"
          onChange={onCardHolderNameChange}
          value={cardHolderID}
        />
      </View>
      <View>
        <Button
          labelStyle={{ fontSize: 22 }}
          style={styles.submitButton}
          contentStyle={styles.submitContentButton}
          mode="contained"
          onPress={onSaveCreditCard}
        >
          שמור כרטיס אשראי
        </Button>
      </View>
    </View>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  container: {},
  monthExpContainer: { marginTop: 10 },
  monthExpContainerChild: {alignItems: "flex-start"},
  submitButton: {
    backgroundColor: theme.SUCCESS_COLOR,
    borderRadius: 15,
    marginTop: 30,
  },
  submitContentButton: {
    height: 50,
  },
});
