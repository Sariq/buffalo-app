import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputText from "../controls/input";
import { useState } from "react";
import theme from "../../styles/theme.style";
import { Button } from "react-native-paper";

const CreditCard = () => {
  const [creditCardNumber, setCreditCardNumber] = useState();
  const [creditCardExpDateMonth, setCreditCardExpDateMonth] = useState('java');
  const [creditCardExpDateYear, setCreditCardExpDateYear] = useState('java');
  const [creditCardCVV, setCreditCardCVV] = useState();

  const onNumberChange = (value) => {
    setCreditCardNumber(value);
  };
  const onMonthChange = (value) => {
    setCreditCardExpDateMonth(value);
  };
  const onYearChange = (value) => {
    setCreditCardExpDateYear(value);
  };
  const onCVVChange = (value) => {
    setCreditCardCVV(value);
  };
  

  const onSaveCreditCard = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <InputText
          label="insert"
          onChange={onNumberChange}
          value={creditCardNumber}
        />
      </View>
      <View style={styles.monthExpContainer}>
        <View style={styles.monthExpContainerChild}>
          <InputText
            label="month"
            onChange={onNumberChange}
            value={creditCardNumber}
          />
        </View>
        <View style={styles.monthExpContainerChild}>
          <InputText
            label="year"
            onChange={onNumberChange}
            value={creditCardNumber}
          />
        </View>
      </View>
      <View>
        <InputText
          label="cvv"
          onChange={onNumberChange}
          value={creditCardNumber}
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
          save card
        </Button>
      </View>
      <View>

      </View>
    </SafeAreaView>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  monthExpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthExpContainerChild: {
    flexBasis: "47%",
  },
  submitButton: {
    backgroundColor: theme.SUCCESS_COLOR,
    borderRadius: 15,
    marginTop: 30,
  },
  submitContentButton: {
    height: 50,
  },
});
