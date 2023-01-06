import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import "./translations/i18n";

import * as Font from "expo-font";
import Constants from "expo-constants";
import RNRestart from "react-native-restart";
import {
  View,
  I18nManager,
  ImageBackground,
  Text,
  DeviceEventEmitter,
} from "react-native";
import RootNavigator from "./navigation";
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
/* stores*/
import { cartStore } from "./stores/cart";
import { menuStore } from "./stores/menu";
import { StoreContext } from "./stores";
import { authStore } from "./stores/auth";
import { languageStore } from "./stores/language";
import { storeDataStore } from "./stores/store";
import { userDetailsStore } from "./stores/user-details";
import ExpiryDate from "./components/expiry-date";
import Icon from "./components/icon";
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();
let customARFonts = {
  "ar-Black": require(`./assets/fonts/ar/Black.ttf`),
  "ar-Bold": require(`./assets/fonts/ar/Bold.ttf`),
  "ar-ExtraBold": require(`./assets/fonts/ar/ExtraBold.ttf`),
  "ar-Light": require(`./assets/fonts/ar/Light.ttf`),
  "ar-Medium": require(`./assets/fonts/ar/Medium.ttf`),
  "ar-Regular": require(`./assets/fonts/ar/Regular.ttf`),
  "ar-SemiBold": require(`./assets/fonts/ar/SemiBold.ttf`),

  "he-Black": require(`./assets/fonts/he/Black.ttf`),
  "he-Bold": require(`./assets/fonts/he/Bold.ttf`),
  "he-ExtraBold": require(`./assets/fonts/he/ExtraBold.ttf`),
  "he-Light": require(`./assets/fonts/he/Light.ttf`),
  "he-Medium": require(`./assets/fonts/he/Medium.ttf`),
  "he-Regular": require(`./assets/fonts/he/Regular.ttf`),
  "he-SemiBold": require(`./assets/fonts/he/SemiBold.ttf`),

  "Poppins-Regular": require(`./assets/fonts/shared/Poppins-Regular.ttf`),
  "Rubik-Regular": require(`./assets/fonts/shared/Rubik-Regular.ttf`),
};

export default function App() {
  const [assetsIsReady, setAssetsIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFontReady, setIsFontReady] = useState(false);
  const [globalStyles, setGlobalStyles] = useState({});

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    }
  }, []);

  async function prepare() {
    try {
      // Pre-load fonts, make any API calls you need to do here
      await Font.loadAsync(customARFonts);
      setIsFontReady(true);
      const fetchStoreDataStore = storeDataStore.getStoreData();
      const fetchUserDetails = userDetailsStore.getUserDetails();
      const fetchMenu = menuStore.getMenu();
      Promise.all([fetchMenu]).then((responses) => {
        console.log("XXXX");

        if (authStore.isLoggedIn()) {
          Promise.all([fetchStoreDataStore, fetchUserDetails]).then((res) => {
            setTimeout(() => {
              setAppIsReady(true);
            }, 1000);
          });
        } else {
          setTimeout(() => {
            setAppIsReady(true);
          }, 1000);
        }
      });
      // Artificially delay for two seconds to simulate a slow loading
      // experience. Please remove this if you copy and paste the code!
    } catch (e) {
      console.warn(e);
    } finally {
      // Tell the application to render
      setAssetsIsReady(true);
    }
  }
  useEffect(() => {
    prepare();
  }, []);
  useEffect(() => {
    const ExpDatePicjkerChange = DeviceEventEmitter.addListener(
      `PREPARE_APP`,
      prepare
    );
    return () => {
      ExpDatePicjkerChange.remove();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      //await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    const version = Constants.nativeAppVersion;

    return (
      <ImageBackground
        source={require("./assets/splash-screen-1.png")}
        resizeMode="stretch"
        style={{ height: "100%", backgroundColor: "#FFCB05" }}
      >
        <View
          style={{
            bottom: 50,
            flexDirection: "row",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 40,
              marginBottom: 20,
              flexDirection: "row",
            }}
          >
            <Icon style={{width: 115,height:20, paddingLeft: 10}} icon="moveit"  />
            <Icon style={{ color: "black", paddingLeft: 10 }} icon="created-by" size={20} />
          </View>

          <Text style={{ position: "absolute", bottom: 10, marginBottom: 20,fontSize: 20 }}>
            {version}
          </Text>
          <Text
            style={{
              position: "absolute",
              bottom: 0,
              marginBottom: 0,
              fontWeight: "bold",
            }}
          >
            Sari Qashuw
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <StoreContext.Provider
      value={{
        cartStore: cartStore,
        authStore: authStore,
        menuStore: menuStore,
        languageStore: languageStore,
        userDetailsStore: userDetailsStore,
        storeDataStore: storeDataStore,
      }}
    >
      <View style={{ flex: 1 }}>
        <RootNavigator />
      </View>
      <ExpiryDate />
    </StoreContext.Provider>
  );
}
