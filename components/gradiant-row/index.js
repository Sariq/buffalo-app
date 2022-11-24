import { StyleSheet, Text, View, Image } from "react-native";
import Counter from "../controls/counter";
import { gradiantVariants } from "./consts.js";
import CheckBox from "../controls/checkbox";

export default function GradiantRow({ onChangeFn, icon, type, price, title, value, stepValue, minValue }) {
  const onChange = (value) => {
    onChangeFn(value);
  };


  const getInputByType = (type, valuex, minValue) => {
    switch (type) {
      case "counter":
        return <Counter onCounterChange={onChange} value={valuex}/>;
      case "COUNTER":
        return <Counter onCounterChange={onChange} value={valuex} stepValue={stepValue} minValue={minValue} />;
      case "checkbox":
        return <CheckBox onChange={onChange} value={valuex}/>;
      case "CHOICE":
        return <CheckBox onChange={onChange} value={valuex} />;
    }
  };

  return (
    <View style={styles.gradiantRow}>
      <View style={{ width: "10%" }}>
        <Image style={{ width: 60, height: 40 }} source={icon} />
      </View>
      <View style={styles.textAndPriceContainer}>
        <View>
          <Text>{title}</Text>
        </View>
        <View style={{ paddingHorizontal: 5 }}>
          {price ? <Text>₪{price}</Text> : null}
        </View>
      </View>
      <View style={styles.inputConatainer}>{getInputByType(type, value, minValue)}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  inputConatainer: {
    width: "30%",
    alignItems: "center",
  },
  gradiantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textAndPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%",
  },
});
