import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { useState } from "react";
import themeStyle from "../../../styles/theme.style";
import Icon from "../../icon";

type TProps = {
  onChange: any;
  label: string;
  value?: string;
}
export default function InputText({ onChange, value, label }: TProps) {
  const handleOnChange = (e) => {

    onChange && onChange(e.nativeEvent.text)
  };

  return (
    <View style={styles.container}>
      <TextInput onChange={handleOnChange} mode="outlined" label={label} outlineColor={themeStyle.PRIMARY_COLOR} activeOutlineColor={themeStyle.PRIMARY_COLOR} style={{fontSize: 20, backgroundColor:"white", borderRadius:50}} />
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
