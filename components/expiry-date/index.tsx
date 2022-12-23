import { StyleSheet, DeviceEventEmitter } from "react-native";
import { useState, useCallback, useEffect } from "react";
import theme from "../../styles/theme.style";
import MonthPicker from "react-native-month-year-picker";
import moment from "moment";

const ExpiryDate = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener(
        `SHOW_EXP_DATE_PICKER`,
        showPicker
      );
  }, []);


  const showPicker = useCallback((value) => {
    console.log('yyy')  
    setShow(value)}, []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
      DeviceEventEmitter.emit(`EXP_DATE_PICKER_CHANGE`, {expDate: moment(selectedDate).format("MM/YY")});

      //   setCreditCardExpDate(moment(selectedDate).format("MM/YY"));
    },
    [date, showPicker]
  );

  if (show) {
    return (
      <MonthPicker
        onChange={onValueChange}
        value={date}
        mode="number"
        minimumDate={new Date()}
        maximumDate={new Date(2030, 11)}
        okButton="אוקיי"
        autoTheme
      />
    );
  }
};

export default ExpiryDate;

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
