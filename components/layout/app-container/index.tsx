import Header from "../header/header";
import { MainStackNavigator } from "../../../navigation/MainStackNavigator";
import { View, Animated, DeviceEventEmitter, Image, Dimensions } from "react-native";
import ExpiryDate from "../../expiry-date";
import themeStyle from "../../../styles/theme.style";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useState, useEffect } from "react";
import TermsAndConditionsScreen from "../../../screens/terms-and-conditions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "expo-modules-core";

const yellowBgTopScreens = ["homeScreen", "terms-and-conditions"];
const yellowBgBottomScreens = ["homeScreen", "menuScreen", "BCOINSScreen"];

const AppContainer = () => {
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);
  const [topBgColor, setTopBgColor] = useState(themeStyle.PRIMARY_COLOR);
  const [bottomBgColor, setBottomBgColor] = useState(themeStyle.PRIMARY_COLOR);
  const [isSendToCart, setIsSendToCart] = useState(false);
  const [productImgUrl, setProductMealUrl] = useState("");

  useEffect(() => {
    const animateAddToCart = DeviceEventEmitter.addListener(
      `add-to-cart-animate`,
      addToCartAnimate
    );
    return () => {
      animateAddToCart.remove();
    };
  }, []);

  const addToCartAnimate = (data) => {
    setProductMealUrl(data.imgUrl);
    setIsSendToCart(false);
    handleAnimation();
  };

  const setTopColor = () => {
    if (
      navigation?.getCurrentRoute()?.name === undefined ||
      yellowBgTopScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1
    ) {
      setTopBgColor(themeStyle.PRIMARY_COLOR);
    } else {
      setTopBgColor("white");
    }
  };
  const setBottomColor = () => {
    if (
      navigation?.getCurrentRoute()?.name === undefined ||
      yellowBgBottomScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1
    ) {
      setBottomBgColor(themeStyle.PRIMARY_COLOR);
    } else {
      setBottomBgColor("white");
    }
  };

  useEffect(() => {
    setTopColor();
    setBottomColor();
  }, [routeState]);

  const getScreenOrWindow = () => {
    return Platform.OS === 'ios' ? 'window' : 'screen';
  }
  
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const handleAnimation = () => {
    // @ts-ignore
    setIsSendToCart(true);

    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      rotateAnimation.setValue(0);
      setIsSendToCart(false);
    });
  };
  const interpolateRotatingY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Dimensions.get(getScreenOrWindow()).height + 140],
  });
  const interpolateRotatingX = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, -10],
  });

  const animatedStyle = {
    transform: [
      { translateX: interpolateRotatingX },
      { translateY: interpolateRotatingY },
    ],
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={["top"]}
        style={{
          flex: 0,
          backgroundColor: topBgColor,
          marginBottom: 0,
          height: 0,
        }}
      />

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          backgroundColor: bottomBgColor,
          position: "relative",
        }}
      >
        <View style={{ flex: 1 }}>
          <Header />
          <MainStackNavigator />
          {isSendToCart && (
            <Animated.View style={[isSendToCart && animatedStyle]}>
              <View
                style={{
                  zIndex: 999,
                  position: 'absolute',
                  bottom: 0,
                  width: 50, height: 50,
                  // borderWidth:5,
                  // borderRadius: 50,
                  // borderColor: themeStyle.PRIMARY_COLOR
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%", }}
                  resizeMode="contain"
                  source={{ uri: productImgUrl }}
                />
              </View>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppContainer;
