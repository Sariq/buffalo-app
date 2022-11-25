import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import themeStyle from "../../../styles/theme.style";
import Icon from "../../icon";

export default function CheckBox({ onChange, value }) {
  const [isSelected, setIsSelected] = useState(value);
  const onBtnClick = () => {
    setIsSelected(!isSelected);
    onChange && onChange(!isSelected);
  };
  useEffect(() => {
    setIsSelected(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <View
        onTouchEnd={() => {
          onBtnClick();
        }}
      >
        {isSelected ? (
          <Icon icon="checked_icon" size={30} />
        ) : (
          <View style={styles.unchecked}></View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
  counterValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
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
  unchecked: {
    borderWidth: 1,
    borderRadius: 20,
    width: 30,
    height: 30,
  },
});
