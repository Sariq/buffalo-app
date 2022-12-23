import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  DeviceEventEmitter,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputText from "../controls/input";
import { useState, useCallback, useEffect } from "react";
import theme from "../../styles/theme.style";
import { Button } from "react-native-paper";
import validateCard, { TValidateCardProps } from "./api/validate-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MonthPicker from "react-native-month-year-picker";
import moment from "moment";

const CreditCard = () => {
  const [creditCardNumber, setCreditCardNumber] = useState();
  const [creditCardExpDate, setCreditCardExpDate] = useState();
  const [creditCardCVV, setCreditCardCVV] = useState();
  const [cardHolderID, setCardHolderID] = useState();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener(`EXP_DATE_PICKER_CHANGE`, setExpData);
  }, []);

  const setExpData = (data) => {
    console.log(data);
    setCreditCardExpDate(data.expDate);
  };

  const showPicker = () => {
    console.log("xxx");
    DeviceEventEmitter.emit(`SHOW_EXP_DATE_PICKER`, { show: true });
  };
  const onNumberChange = (value) => {
    setCreditCardNumber(value);
  };

  const onCVVChange = (value) => {
    setCreditCardCVV(value);
  };
  const onCardHolderNameChange = (value) => {
    setCardHolderID(value);
  };

  const getCCData = async () => {
    const data = await AsyncStorage.getItem("@storage_CCData");
    console.log(data);
  };

  const onSaveCreditCard = () => {
    const validateCardData: TValidateCardProps = {
      cardNumber: creditCardNumber,
      expDate: moment(date).format("MMYY"),
    };
    console.log(validateCardData);
    validateCard(validateCardData).then(async (res) => {
      if (res.isValid) {
        const ccDetailsString = JSON.stringify(res.ccDetails);
        await AsyncStorage.setItem("@storage_CCData", ccDetailsString);
      } else {
        console.log("error", res);
        // TODO: show try another card modal
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-start" }}>
        <Text style={{ fontSize: 18 }}>הזן פרטי כרטיס אשראי</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText
          label="מספר כרטיס אשראי"
          onChange={onNumberChange}
          value={creditCardNumber}
        />
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
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText label="CVV" onChange={onCVVChange} value={creditCardCVV} />
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText
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
