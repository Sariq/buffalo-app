import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useContext } from "react";
import { observer } from "mobx-react";

import themeStyle from "../../../styles/theme.style";
import { CONSTS_ICONS } from "../../../consts/consts-icons";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import theme from "../../../styles/theme.style";
import Icon from "../../../components/icon";
import { StoreContext } from "../../../stores";

const Header = ({ store }) => {
  const navigation = useNavigation();
  let cartStore = useContext(StoreContext);
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
          <TouchableOpacity>
            <Icon
              icon="language_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <Icon
              icon="profile_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ ...styles.headerItem, left: -25 }}>
        <TouchableOpacity>
          <Icon
            icon="buffalo_icon"
            size={120}
            style={{ color: theme.GRAY_700 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerItem}>
        <TouchableOpacity onPress={handleCartClick}>
        <Icon
            icon="cart_icon"
            size={30}
            style={{ color: theme.GRAY_700 }}
          />
          <Text style={styles.cartCount}>{cartStore.cartItems.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default observer(Header);

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
    widh: "100%"
  },
  cartCount:{
    position: "absolute",
    top: 10,
    left: "37%",
    right: "37%"
  }
});
