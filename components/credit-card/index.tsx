import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputText from "../controls/input";
import { useState, useCallback } from "react";
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

  const onNumberChange = (value) => {
    setCreditCardNumber(value);
  };

  const onCVVChange = (value) => {
    setCreditCardCVV(value);
  };
  const onCardHolderNameChange = (value) => {
    setCardHolderID(value);
  };

  const onSaveCreditCard = () => {
    const validateCardData: TValidateCardProps = {
      cardNumber: creditCardNumber,
      expDate: creditCardExpDate,
    };
    validateCard(validateCardData).then(async (res) => {
      if (res.isValid) {
        await AsyncStorage.setItem("@storage_CCData", {
          cardNumber: creditCardNumber,
          expDate: creditCardExpDate,
          cvv: creditCardCVV,
        });
      } else {
        // TODO: show try another card modal
      }
    });
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
      setCreditCardExpDate(moment(selectedDate).format("MM/YY"));
    },
    [date, showPicker]
  );

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <View>
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
            onClick={() => showPicker(true)}
          />
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText label="CVV" onChange={onCVVChange} value={creditCardCVV} />
      </View>
      <View style={{ marginTop: 10 }}>
        <InputText label="תעודת זהות" onChange={onCardHolderNameChange} value={cardHolderID} />
      </View>
      <View>
        <Button
          labelStyle={{ fontSize: 22 }}
          style={styles.submitButton}
          contentStyle={styles.submitContentButton}
          mode="contained"
          onPress={onSaveCreditCard}
        >
          save card
        </Button>
      </View>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          mode="number"
          minimumDate={new Date()}
          maximumDate={new Date(2030, 11)}
          okButton="אוקיי"
          autoTheme
        />
      )}
    </SafeAreaView>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
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
