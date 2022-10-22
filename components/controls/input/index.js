import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { useState } from "react";
import themeStyle from "../../../styles/theme.style";
import Icon from "../../icon";

export default function InputText({ onChange, value }) {
  const [isSelected, setIsSelected] = useState(value || false);
  const onBtnClick = () => {
    setIsSelected(!isSelected);
    onChange && onChange(!isSelected);
  };

  return (
    <View style={styles.container}>
      <TextInput mode="outlined" label="هاتف" outlineColor={themeStyle.PRIMARY_COLOR} activeOutlineColor={themeStyle.PRIMARY_COLOR} style={{fontSize: 20, backgroundColor:"white", borderRadius:50}} />
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
