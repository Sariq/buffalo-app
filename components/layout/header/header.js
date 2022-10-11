import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import themeStyle from "../../../styles/theme.style";
import { CONSTS_ICONS } from "../../../consts/consts-icons";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import theme from "../../../styles/theme.style";
import Icon from "../../../components/icon";

export default function Header() {
  const navigation = useNavigation();

  const handleCartClick = () => {
    navigation.navigate("cart");
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.headerItem,
          flexDirection: "row",
        }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Icon
            icon="language_icon"
            size={30}
            style={{ color: theme.GRAY_700 }}
          />
        </View>
        <View >
          <Icon
            icon="profile_icon"
            size={30}
            style={{ color: theme.GRAY_700 }}
          />
        </View>
      </View>

      <View style={{...styles.headerItem,  left:-25}}>
        <Icon
          icon="buffalo_icon"
          size={120}
          style={{ color: theme.GRAY_700 }}
        />
      </View>
      <View style={styles.headerItem}>
        <TouchableOpacity onPress={handleCartClick}>
          <Image source={require("../../../assets/cart_icon.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row-reverse",
    backgroundColor: themeStyle.PRIMARY_COLOR,
    height: 80,
    paddingTop: 30,
    justifyContent: "space-between",
    paddingRight: 25,
    paddingLeft: 25,
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});
