import { StyleSheet, Text, View, Image } from "react-native";
import Counter from "../controls/counter";
import { gradiantVariants } from "./consts.js";
import CheckBox from "../controls/checkbox";

type TProps = {
  onChangeFn: any;
  icon?: any;
  type: any;
  title: any;
  value: any;
  stepValue?: number;
  minValue?: number;
  price?: number;
  hideIcon?: boolean;
};

export default function GradiantRow({ onChangeFn, icon, type, price, title, value, stepValue, minValue,hideIcon }: TProps) {
  const onChange = (value) => {
    onChangeFn(value);
  };


  const getInputByType = (type, valuex, minValue) => {
    switch (type) {
      case "COUNTER":
        return <Counter onCounterChange={onChange} value={valuex} stepValue={stepValue} minValue={minValue} />;
      case "CHOICE":
        return <CheckBox onChange={onChange} value={valuex} />;
    }
  };

  return (
    <View style={styles.gradiantRow}>
      {!hideIcon && <View style={{ width: "10%" }}>
        <Image style={{ width: 60, height: 40 }} source={icon} />
      </View>}
      <View style={[styles.textAndPriceContainer,{marginLeft: hideIcon ? 40 : 0, width: hideIcon ? "50%" : "40%"}]}>
        <View>
          <Text style={{fontSize: 17}}>{title}</Text>
        </View>
        <View style={{ marginHorizontal: -10, }}>
          {price ? <Text style={{fontSize: 16}}>₪{price}</Text> : null}
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
  },
});
