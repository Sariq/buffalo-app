import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { useState } from "react";
import themeStyle from "../../../styles/theme.style";
import Icon from "../../icon";
import { TextInputMask } from 'react-native-masked-text';

type TProps = {
  onChange: any;
  label: string;
  value?: string;
  isEditable?: boolean;
  onClick?: any;
};
export default function InputText({
  onChange,
  value,
  label,
  isEditable = true,
  onClick,
}: TProps) {
  const handleOnChange = (e) => {
    onChange && onChange(e.nativeEvent.text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        onPressIn={onClick}
        value={value}
        editable={isEditable}
        onChange={handleOnChange}
        mode="outlined"
        label={label}
        theme={{ roundness: 30 }} 
        outlineColor={themeStyle.PRIMARY_COLOR}
        activeOutlineColor={themeStyle.PRIMARY_COLOR}
        style={{ fontSize: 20, backgroundColor: "white", borderRadius: 100 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { width: "100%" },
});
