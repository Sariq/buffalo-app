import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import themeStyle from "../../../styles/theme.style";

export default function Counter({ onCounterChange, value, stepValue = 1, minValue = 0 }) {
  const [couter, setCounter] = useState(value || 0);
  const onBtnClick = (value) => {
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
    <View style={styles.container}>
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
        <Text>{couter}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  counterValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    width: 30,
    height: 30,
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
