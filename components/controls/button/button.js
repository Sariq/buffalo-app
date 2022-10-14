import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";

export default function Button({ onClickFn, text, icon, fontSize }) {
  const onBtnClick = () => {
    onClickFn();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onBtnClick();
        }}
      >
        <Icon
          icon={icon}
          size={20}
          style={{ color: theme.GRAY_700 }}
        />
        <Text style={{...styles.buttonText, fontSize: fontSize}}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container:{
        width: "100%",
    },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding:10,

  },
  buttonText: {
    marginHorizontal: 20
  },
});
