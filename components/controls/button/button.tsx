import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import themeStyle from "../../../styles/theme.style";
import { ActivityIndicator } from "react-native-paper";

type TProps = {
  onClickFn: any;
  text: any;
  icon?: any;
  iconSize?: any;
  iconPosition?: 'right' | 'left';
  fontSize?: any;
  bgColor?: any;
  textColor?: any;
  fontFamily?: any;
  disabled?: boolean;
  isLoading?: boolean;
  borderRadious?: number;
  textPadding?: number;
};
export default function Button({
  onClickFn,
  text,
  icon,
  iconSize,
  fontSize,
  iconPosition = 'right',
  bgColor,
  textColor,
  fontFamily,
  disabled,
  isLoading,
  borderRadious,
  textPadding
}: TProps) {
  const onBtnClick = () => {
    onClickFn();
  };


  const getBorderColor = () => {
    
    if(disabled){
      return themeStyle.GRAY_600;
    }
   
    if(bgColor == "white" || bgColor == themeStyle.PRIMARY_COLOR){
      return themeStyle.PRIMARY_COLOR
    }

    if(bgColor){
      return "transparent";
    }
  }
  const renderIcon = () => (
    <Icon
      icon={icon}
      size={iconSize ? iconSize : 20}
      style={{ color: textColor || theme.GRAY_700, top: -1 }}
    />
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.button,
          borderRadius: borderRadious !== undefined ? borderRadious : 30,
          backgroundColor: disabled ? themeStyle.GRAY_600 : bgColor,
          borderColor: getBorderColor(),
          borderWidth: 1,
          opacity: disabled && 0.3,
          alignItems: "center",
        }}
        onPress={() => {
          onBtnClick();
        }}
      >
                {icon && iconPosition && iconPosition === 'right' && renderIcon()}

        <Text
          style={{
            ...styles.buttonText,
            fontSize: fontSize,
            color: textColor,
            fontFamily: fontFamily,
            padding: textPadding
          }}
        >
          {text}
        </Text>
        {icon && iconPosition && iconPosition === 'left' && renderIcon()}
        {isLoading && (
          <ActivityIndicator animating={true} color={theme.WHITE_COLOR} />
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    
  },
  buttonText: {
    marginHorizontal: 20,
    height: "100%"

  },
});
