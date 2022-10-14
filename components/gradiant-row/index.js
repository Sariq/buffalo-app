import { StyleSheet, Text, View, Image } from "react-native";
import Counter from "../controls/counter";
import { gradiantVariants } from "./consts.js";
import CheckBox from "../controls/checkbox";

export default function GradiantRow({ onChangeFn, icon, type, price, title, value }) {
  const onChange = (value) => {
    onChangeFn(value);
  };


  const getInputByType = (type) => {
    switch (type) {
      case "counter":
        return <Counter onCounterChange={onChange} value={value}/>;
      case "checkbox":
        return <CheckBox onChange={onChange} />;
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
          {price && <Text>₪13</Text>}
        </View>
      </View>
      <View style={styles.inputConatainer}>{getInputByType(type)}</View>
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
