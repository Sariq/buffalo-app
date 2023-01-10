import Header from "../header/header";
import { MainStackNavigator } from "../../../navigation/MainStackNavigator";
import { View } from "react-native";
import ExpiryDate from "../../expiry-date";
import themeStyle from "../../../styles/theme.style";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useState, useEffect } from "react";
import TermsAndConditionsScreen from "../../../screens/terms-and-conditions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const yellowBgTopScreens = ["homeScreen", "terms-and-conditions"];
const yellowBgBottomScreens = ["homeScreen", "menuScreen"];

const AppContainer = () => {
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);
  const [topBgColor, setTopBgColor] = useState(themeStyle.PRIMARY_COLOR);
  const [bottomBgColor, setBottomBgColor] = useState(themeStyle.PRIMARY_COLOR);


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
      (navigation?.getCurrentRoute()?.name === undefined ||
        yellowBgBottomScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1)
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
          <MainStackNavigator/>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppContainer;
