import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import themeStyle from "../../../styles/theme.style";
import Icon from "../../icon";
import Button from "../button/button";
import * as Haptics from "expo-haptics";

export default function CheckBox({ onChange, value, title = undefined, variant = 'default', isOneChoice=false }) {
  const [isSelected, setIsSelected] = useState(value);
  const onBtnClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if(isOneChoice && value){
      return;
    }
    setIsSelected(!isSelected);
    onChange && onChange(!isSelected);
  };
  useEffect(() => {
    setIsSelected(value);
  }, [value]);

  if(variant === 'button'){
    return (
      <View style={styles.container}>
        <View
          onTouchEnd={() => {
            onBtnClick();
          }}
        >
          {isSelected ? (
            <Button fontSize={15} onClickFn={()=> onChange(value)}  text={title} textColor={themeStyle.BROWN_700} bgColor={themeStyle.PRIMARY_COLOR}/>
          ) : (
            <Button fontSize={15} onClickFn={()=> onChange(value)}  text={title} textColor={themeStyle.BROWN_700} bgColor={themeStyle.WHITE_COLOR}/>
          )}
        </View>
      </View>
    );
  }

  return (
    
      <TouchableOpacity
      style={{ padding:5}}
        onPress={() => {
          onBtnClick();
        }}
      >
        {isSelected ? (
          <Icon icon="checked_icon" size={30} />
        ) : (
          <View style={styles.unchecked}></View>
        )}
      </TouchableOpacity>
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
