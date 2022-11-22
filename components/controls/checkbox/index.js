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
  useEffect(()=>{
    setIsSelected(value)
  },[value]);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onBtnClick();
        }}
      >
        {isSelected ? (
          <Icon icon="checked_icon" size={30} />
        ) : (
          <Icon icon="unchecked_icon" size={30} style={{ color: "black" }} />
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
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
