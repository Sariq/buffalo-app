import Header from "../header/header";
import { MainStackNavigator } from "../../../navigation/MainStackNavigator";
import { View } from "react-native";
import ExpiryDate from "../../expiry-date";
import themeStyle from "../../../styles/theme.style";
import {
    SafeAreaView,
    SafeAreaProvider,
  } from "react-native-safe-area-context";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useState, useEffect } from "react";


const yellowBgScreens = ["homeScreen","menuScreen", "meal"];

const AppContainer = () => {
    const navigation = useNavigation();
    const routeState = useNavigationState((state) => state);
    const [bgColor, setBgColor] = useState(themeStyle.PRIMARY_COLOR);

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
  return (
    <SafeAreaProvider>

    <SafeAreaView
    edges={["top"]}
    style={{
      flex: 0,
      backgroundColor: bgColor,
      marginBottom: 0,
      height: 0,
    }}
  />

  <SafeAreaView
    edges={["left", "right", "bottom"]}
    style={{
      flex: 1,
      backgroundColor: bgColor,
      position: "relative",
    }}
  >
    <View style={{ flex: 1 }}>
    <Header />
      <MainStackNavigator />
          </View>
    <ExpiryDate/>
  </SafeAreaView>
  </SafeAreaProvider>

  );
};

export default AppContainer;
