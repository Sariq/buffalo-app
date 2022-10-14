import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import themeStyle from "../../../styles/theme.style";

export default function Counter({ onCounterChange, value }) {
  const [couter, setCounter] = useState(value);
  const onBtnClick = (value) => {
    if (couter === 0 && value === -1) {
      return;
    }
    const updatedValue = couter + value;
    setCounter(updatedValue);
    onCounterChange(updatedValue);
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            onBtnClick(1);
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
            onBtnClick(-1);
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
  },
});
