import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import themeStyle from "../../../styles/theme.style";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import { StoreContext } from "../../../stores";

const yellowBgScreens = ['homeScreen'];
const Header = () => {
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);
  let cartStore = useContext(StoreContext).cartStore;

  const [bgColor, setBgColor] = useState(themeStyle.PRIMARY_COLOR)

  useEffect(() => {
    if(navigation?.getCurrentRoute()?.name === undefined || yellowBgScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1){
      setBgColor(themeStyle.PRIMARY_COLOR)
    }else{
      setBgColor('white')
    }
  }, [routeState]);

  const handleCartClick = () => {
    navigation.navigate("cart");
  };

  const handleProfileClick = () => {
    //navigation.navigate("profile");
    navigation.navigate("login");
    // navigation.navigate("verify-code");
  };

  const onLogoClick = () => {
    navigation.navigate("homeScreen");
  };

  const handleLanguageClick = () => {
    navigation.navigate("language");
  };

  return (
    <View
      style={{ ...styles.container, backgroundColor: bgColor }}
    >
      <View
        style={{
          ...styles.headerItem,
          flexDirection: "row",
        }}
      >
        <View style={{ paddingHorizontal: 0 }}>
          <TouchableOpacity
            onPress={handleLanguageClick}
            style={styles.buttonContainer}
          >
            <Icon
              icon="language_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={handleProfileClick}
            style={styles.buttonContainer}
          >
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
          {/* <Icon
            icon="buffalo_icon"
            size={30}
            style={{ color: theme.GRAY_700,  width:100 }}
          /> */}
          <Image
            style={{ width: 120, height: "100%" }}
            source={require("../../../assets/buffalo_logo.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerItem}>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleCartClick}
          >
            <Icon
              icon="cart_icon"
              size={30}
              style={{ color: theme.GRAY_700 }}
            />
            <Text  style={styles.cartCount}>{cartStore.getProductsCount()}</Text>
          </TouchableOpacity>

      </View>
    </View>
  );
};

export default observer(Header);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row-reverse",
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
    top: 19,
    left: "65%",
    right: "65%",
    zIndex: 1,
    },
  buttonContainer: {
    padding: 9,
  },
});
