import { StyleSheet, View, TouchableOpacity } from "react-native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import themeStyle from "../../../styles/theme.style";
import { ActivityIndicator } from "react-native-paper";
import * as Haptics from "expo-haptics";
import Text from "../Text"

type TProps = {
  onClickFn: any;
  text: any;
  icon?: any;
  iconSize?: any;
  iconPosition?: "right" | "left";
  fontSize?: any;
  bgColor?: any;
  textColor?: any;
  fontFamily?: any;
  disabled?: boolean;
  isLoading?: boolean;
  borderRadious?: number;
  textPadding?: number;
  isFlexCol?: boolean;
  marginH?: number;
};
export default function Button({
  onClickFn,
  text,
  icon,
  iconSize,
  fontSize,
  iconPosition = "right",
  bgColor,
  textColor,
  fontFamily,
  disabled,
  isLoading,
  borderRadious,
  textPadding,
  isFlexCol,
  marginH,
}: TProps) {
  const onBtnClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClickFn();
  };

  const getBorderColor = () => {
    if (disabled) {
      return themeStyle.GRAY_600;
    }

    if (bgColor == "white" || bgColor == themeStyle.PRIMARY_COLOR) {
      return themeStyle.PRIMARY_COLOR;
    }

    if (bgColor) {
      return "transparent";
    }
  };
  const renderIcon = () => (
    <Icon
      icon={icon}
      size={iconSize ? iconSize : 20}
      style={{
        color: textColor || theme.GRAY_700,
        marginBottom: isFlexCol ? 10 : 0,
      }}
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
          flexDirection: isFlexCol ? "column" : "row",
          padding: isFlexCol ? 0 : 10,
          height: isFlexCol ? "100%" : "auto",
        }}
        disabled={disabled}
        onPress={() => {
          onBtnClick();
        }}
      >
        {icon && iconPosition && iconPosition === "right" && renderIcon()}
        <Text
          style={{
            marginHorizontal: marginH ? marginH : 15,
            fontSize: fontSize,
            color: textColor,
            fontFamily: fontFamily,
            padding: textPadding,
            textAlign: "center",
          }}
        >
          {text}
        </Text>

        {icon && iconPosition && iconPosition === "left" && renderIcon()}
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
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginHorizontal: 15,
  },
});
