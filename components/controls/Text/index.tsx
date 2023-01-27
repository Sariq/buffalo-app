import { Text as ReactText } from "react-native";
import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";

export type TProps = {
  children: any;
  style?: any;
  fontFamily?: any;
  fontSize?: number;
  fontWeight?: number;
  color?: any;
};

const Text = ({
  children,
  style,
  fontFamily,
  fontSize,
  fontWeight,
  color,
}: TProps) => {
  if (!color) {
    color = themeStyle.BROWN_700;
  }
  if (!style?.fontFamily && !fontFamily) {
    fontFamily = `${getCurrentLang()}-SemiBold`;
  }
  const customStyles = { ...style, fontFamily, fontSize, fontWeight, color };
  return <ReactText style={customStyles}>{children}</ReactText>;
};

export default Text;
