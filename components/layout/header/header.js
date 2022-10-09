import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import themeStyle from "../../../styles/theme.style";
import { CONSTS_ICONS } from "../../../consts/consts-icons";
import { SvgXml } from "react-native-svg";
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();

  const handleCartClick = ()=>{

    navigation.navigate('cart')
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerItem}>
        <SvgXml xml={CONSTS_ICONS.profileIcon} />
      </View>
      <View style={styles.headerItem}>
        <Image source={require("../../../assets/buffalo_logo.png")} />
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
    paddingLeft: 25
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});
