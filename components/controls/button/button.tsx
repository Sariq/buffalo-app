import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import themeStyle from "../../../styles/theme.style";

type TProps = {
  onClickFn: any;
  text: any;
  icon: any;
  fontSize: any;
  bgColor: any;
  textColor: any;
  fontFamily?:any;
}
export default function Button({ onClickFn, text, icon, fontSize, bgColor, textColor, fontFamily }: TProps) {
  const onBtnClick = () => {
    onClickFn();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{...styles.button, backgroundColor: bgColor, borderColor: bgColor == "white" && themeStyle.PRIMARY_COLOR, borderWidth: bgColor == "white" ? 1 : 0}}
        onPress={() => {
          onBtnClick();
        }}
      >
        <Icon
          icon={icon}
          size={20}
          style={{ color: textColor || theme.GRAY_700 }}
        />
        <Text style={{...styles.buttonText, fontSize: fontSize, color:textColor, fontFamily:fontFamily}}>{text}</Text>
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
