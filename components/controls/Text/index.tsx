import { Text as ReactText } from "react-native";
import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";

export type TProps = {
  children: any;
  style?: any;
};

const Text = ({ children, style }: TProps) => {
  if (!style?.color) {
    style = { ...style, color: themeStyle.BROWN_700 };
  }
  if (!style?.fontFamily) {
    style = { ...style, fontFamily: `${getCurrentLang()}-SemiBold` };
  }
  const customStyles = { ...style };
  return <ReactText style={customStyles}>{children}</ReactText>;
};

export default Text;
