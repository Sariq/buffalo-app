import { StyleSheet, Text, View, Image } from "react-native";
import Counter from "../controls/counter";
import CheckBox from "../controls/checkbox";
import i18n from "../../translations/index-x";
import { getCurrentLang } from "../../translations/i18n";

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
  fontSize?: number;
  isMultipleChoice?: boolean;
};

export default function GradiantRow({
  onChangeFn,
  icon,
  type,
  price,
  title,
  value,
  stepValue,
  minValue,
  hideIcon,
  fontSize,
  isMultipleChoice,
}: TProps) {
  const onChange = (value) => {
    onChangeFn(value);
  };

  const getInputByType = (type, valuex, minValue) => {
    switch (type) {
      case "COUNTER":
        return (
          <Counter
            onCounterChange={onChange}
            value={valuex}
            stepValue={stepValue}
            minValue={minValue}
          />
        );
      case "CHOICE":
        return (
          <View style={{ paddingLeft: 8 }}>
            <CheckBox onChange={onChange} value={valuex} />
          </View>
        );
    }
  };

  if (type === "CHOICE" && !isMultipleChoice) {
    return (
      <View style={{ paddingLeft: 8 }}>
        <CheckBox
          onChange={onChange}
          value={value}
          title={title}
          variant={"button"}
        />
      </View>
    );
  }
  return (
    <View style={styles.gradiantRow}>
      {!hideIcon && (
        <View style={{ width: "10%"}}>
          <Image style={{ width: 60, height: 50}} source={icon} />
        </View>
      )}
      <View
        style={[
          styles.textAndPriceContainer,
          { marginLeft: hideIcon ? 20 : 0, width: hideIcon ? "60%" : "40%" },
        ]}
      >
        <View>
          <Text
            style={{
              fontSize: fontSize || 15,
              fontFamily: `${getCurrentLang()}-SemiBold`,
            }}
          >
            {title}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: -10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {price ? (
            <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular" }}>
              {price}+
            </Text>
          ) : null}
          {price ? <Text>₪</Text> : null}
        </View>
      </View>
      <View style={styles.inputConatainer}>
        {getInputByType(type, value, minValue)}
      </View>
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
