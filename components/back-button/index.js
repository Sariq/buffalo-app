import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useState } from "react";
import theme from "../../styles/theme.style";
import Icon from "../icon";
import themeStyle from "../../styles/theme.style";

export default function BackButton() {
  const navigation = useNavigation();

  const onBtnClick = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onBtnClick();
        }}
      >
      <View
        style={{
          borderWidth: 1,
          borderColor: "rgba(112,112,112,0.1)",
          borderRadius: 30,
          width: 35,
          height: 35,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 10,
          transform: [{ rotate: '180deg' }]
        }}
      >
        <Icon icon="arrow-right" size={15} style={{ color: "#292d32" }} />
      </View>
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
    borderRadius: 30,
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
