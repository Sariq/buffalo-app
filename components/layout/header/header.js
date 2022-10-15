import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useContext } from "react";
import { observer } from "mobx-react";

import themeStyle from "../../../styles/theme.style";
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
  const onLogoClick = () => {
    navigation.navigate("homeScreen");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.headerItem,
          flexDirection: "row",
        }}
      >
        <View style={{ paddingHorizontal: 0 }}>
          <TouchableOpacity style={styles.buttonContainer}>
            <Icon
              icon="language_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.buttonContainer}>
            <Icon
              icon="profile_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ ...styles.headerItem, left: -25 }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onLogoClick}>
          <Icon
            icon="buffalo_icon"
            size={120}
            style={{ color: theme.GRAY_700 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerItem}>
        {cartStore.cartItems.length > 0 && (
          <TouchableOpacity style={styles.buttonContainer} onPress={handleCartClick}>
            <Icon
              icon="cart_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
            <Text style={styles.cartCount}>{cartStore.cartItems.length}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default observer(Header);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row-reverse",
    backgroundColor: themeStyle.PRIMARY_COLOR,
    height: 80,
    paddingTop: 30,
    justifyContent: "space-between",
    paddingRight: 15,
    paddingLeft: 15,
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",

  },
  cartCount: {
    position: "absolute",
    top:19,
    left: "65%",
    right: "65%",
    zIndex:1
  },
  buttonContainer:{
    padding:9,
  }
});
