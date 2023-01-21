import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import themeStyle from "../../../styles/theme.style";
import * as Haptics from "expo-haptics";

export default function Counter({ onCounterChange, value, stepValue = 1, minValue = 0, isVertical = false }) {
  const [couter, setCounter] = useState(value || 0);
  const onBtnClick = (value) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if ((couter === 0 && value === -1) || (couter + value < minValue )) {
      return;
    }
    const updatedValue = couter + value;
    setCounter(updatedValue);
    onCounterChange(updatedValue);
  };
  useEffect(()=>{
    setCounter(value || 0)
  },[value]);

  return (
    <View style={{...styles.container, flexDirection: isVertical? "column" : "row"}}>
      <View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            onBtnClick(stepValue);
          }}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.counterValue}>
        <Text style={{fontFamily: "Poppins-Regular", fontSize:16}}>{couter}</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            onBtnClick(-stepValue);
          }}
        >
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  counterValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width:40
  },
  btn: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    width: 35,
    height: 35,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 20,
    color: "white",
  },
});
