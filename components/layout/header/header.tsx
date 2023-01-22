import { StyleSheet, TouchableOpacity, View, Text, Image, Animated } from "react-native";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import themeStyle from "../../../styles/theme.style";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import { StoreContext } from "../../../stores";
import { SHIPPING_METHODS } from "../../../screens/cart/cart";
import * as Haptics from 'expo-haptics';

const yellowBgScreens = ["homeScreen", "terms-and-conditions"];
const hideProfile = ["terms-and-conditions"]
const hideProfileScreens = ["terms-and-conditions"];
const hideLanguageScreens = ["terms-and-conditions"];
const hideCartScreens = ["terms-and-conditions"];
const Header = () => {
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);
  const { cartStore, authStore } = useContext(StoreContext);
  const [cartItemsLenght, setCartItemsLength] = useState();
  const [bgColor, setBgColor] = useState(themeStyle.PRIMARY_COLOR);



  useEffect(()=>{
    if(cartItemsLenght === undefined || cartItemsLenght === cartStore.cartItems.length){
      setCartItemsLength(cartStore.cartItems.length)
      return;
    }
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    handleAnimation()
    setTimeout(()=>{
      handleAnimation()
    },700)
    setCartItemsLength(cartStore.cartItems.length)
  },[cartStore.cartItems.length])


  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    // @ts-ignore
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false
    }).start(() => {
      rotateAnimation.setValue(0);
    });
  };
  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const interpolateRotating2 = rotateAnimation.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0],
  });

  const animatedStyle = {
        opacity: interpolateRotating,
        color: themeStyle.PRIMARY_COLOR,
        transform: [{ scale: interpolateRotating2 }]
  };

  useEffect(() => {
    if (
      navigation?.getCurrentRoute()?.name === undefined ||
      yellowBgScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1
    ) {
      setBgColor(themeStyle.PRIMARY_COLOR);
    } else {
      setBgColor("white");
    }
  }, [routeState]);

  const handleCartClick = () => {
    if(authStore.isLoggedIn()){
      if(cartStore.getProductsCount() > 0){
        navigation.navigate("cart");
      }
    }else{
     navigation.navigate("login");
    }
   
  };

  const handleProfileClick = () => {
    if(authStore.isLoggedIn()){
      navigation.navigate("profile");
    }else{
     navigation.navigate("login");
    }
  };

  const onLogoClick = () => {
    navigation.navigate("homeScreen");
  };

  const handleLanguageClick = () => {
    navigation.navigate("language");
  };

  const isHideProfile = () =>{
    return hideProfileScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1;
  }
  const isHideLanguage = () =>{
    return hideLanguageScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1;
  }
  const isHideCart = () =>{
    return hideCartScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1;
  }

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <View
        style={{
          ...styles.headerItem,
          flexDirection: "row",
        }}
      >
        <View style={{ paddingHorizontal: 0 }}>
          <TouchableOpacity
            onPress={handleLanguageClick}
            style={[styles.buttonContainer, {opacity: isHideLanguage() ? 0 : 1}]}
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
            style={[styles.buttonContainer, {opacity: isHideProfile() ? 0 : 1}]}
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
            style={{ width: 140, height: "100%" }}
            source={require("../../../assets/buffalo-logo-2x.png")}
          />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.headerItem, animatedStyle]}>
        <TouchableOpacity
            style={[styles.buttonContainer, {opacity: isHideCart() ? 0 : 1}]}
            onPress={handleCartClick}
        >
          <Icon icon="cart_icon" size={30} style={{ color: theme.GRAY_700 }} />
          <Text style={styles.cartCount}>{cartStore.getProductsCount()}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default observer(Header);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row-reverse",
    height: 60,
    paddingTop: 0,
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
  },
  buttonContainer: {
    padding: 9,
    justifyContent: "center",
    alignItems: "center",
  },
});
