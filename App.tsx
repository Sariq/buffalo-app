import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback, useContext } from "react";
import "./translations/i18n";
import * as SplashScreen from 'expo-splash-screen';

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
import NetInfo from "@react-native-community/netinfo";

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
/* stores*/

import ExpiryDate from "./components/expiry-date";
import Icon from "./components/icon";
import GeneralServerErrorDialog from "./components/dialogs/general-server-error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { observer } from "mobx-react";
import { StoreContext } from "./stores";
import { ordersStore } from "./stores/orders";
import InterntConnectionDialog from "./components/dialogs/internet-connection";
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();
let customARFonts = {
  "ar-Black": require(`./assets/fonts/ar/Black.ttf`),
  "ar-Bold": require(`./assets/fonts/ar/Bold.otf`),
  "ar-ExtraBold": require(`./assets/fonts/ar/ExtraBold.ttf`),
  "ar-Light": require(`./assets/fonts/ar/Light.ttf`),
  "ar-Medium": require(`./assets/fonts/ar/Medium.ttf`),
  "ar-Regular": require(`./assets/fonts/ar/Regular.ttf`),
  "ar-SemiBold": require(`./assets/fonts/ar/Medium.ttf`),

  "he-Black": require(`./assets/fonts/he/Black.ttf`),
  "he-Bold": require(`./assets/fonts/he/Bold.ttf`),
  "he-ExtraBold": require(`./assets/fonts/he/ExtraBold.ttf`),
  "he-Light": require(`./assets/fonts/he/Light.ttf`),
  "he-Medium": require(`./assets/fonts/he/Medium.ttf`),
  "he-Regular": require(`./assets/fonts/he/Regular.ttf`),
  "he-SemiBold": require(`./assets/fonts/he/SemiBold.ttf`),

  "Poppins-Regular": require(`./assets/fonts/shared/Poppins-Regular.ttf`),
  "Rubik-Regular": require(`./assets/fonts/shared/Rubik-Regular.ttf`),
  "Rubik-Medium": require(`./assets/fonts/shared/Rubik-Medium.ttf`),
  "Rubik-Bold": require(`./assets/fonts/shared/Rubik-Bold.ttf`),
  "Rubik-Light": require(`./assets/fonts/shared/Rubik-Light.ttf`),
};

const App = () => {
  const {
    authStore,
    cartStore,
    userDetailsStore,
    menuStore,
    storeDataStore,
    languageStore,
  } = useContext(StoreContext);

  const [assetsIsReady, setAssetsIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFontReady, setIsFontReady] = useState(false);
  const [
    isOpenInternetConnectionDialog,
    setIsOpenInternetConnectionDialog,
  ] = useState(false);

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
      const fetchMenu = menuStore.getMenu();
      const fetchHomeSlides = menuStore.getSlides();
      Promise.all([fetchMenu, fetchHomeSlides]).then(async (responses) => {
        if (authStore.isLoggedIn()) {
          const fetchUserDetails = userDetailsStore.getUserDetails();
          const fetchStoreDataStore = storeDataStore.getStoreData();
          const fetchOrders = ordersStore.getOrders();
          userDetailsStore.setIsAcceptedTerms(true);
          Promise.all([
            fetchStoreDataStore,
            fetchUserDetails,
            fetchOrders,
          ]).then((res) => {
            setAppIsReady(true);
          });
        } else {
          const data = await AsyncStorage.getItem("@storage_terms_accepted");
          userDetailsStore.setIsAcceptedTerms(JSON.parse(data));
          setAppIsReady(true);
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
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOpenInternetConnectionDialog(!state.isConnected);
      if (!state.isConnected) {
        prepare();
      }
    });
    prepare();
    return () => {
      unsubscribe();
    };
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
        source={require("./assets/splash-screen-2.png")}
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
          ></View>

          <Text
            style={{
              position: "absolute",
              bottom: 10,
              marginBottom: 42,
              fontSize: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                paddingLeft: 5,
                paddingRight: 5,
              }}
            >
              <Icon style={{ width: 80, height: 21 }} icon="moveit" />
            </View>
          </Text>

          <View
            style={{
              position: "absolute",
              bottom: 10,
              marginBottom: 15,
              flexDirection: "row-reverse",
              paddingLeft: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Sari Qashuw{' '}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
            |{' '}Sabri Qashuw
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              marginBottom: 0,
            }}
          >
            <Text style={{ textAlign: "center" }}>{version}</Text>
          </View>
        </View>
        <GeneralServerErrorDialog />
        <InterntConnectionDialog isOpen={isOpenInternetConnectionDialog} />
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
        ordersStore: ordersStore,
      }}
    >
      <View style={{ height: "100%" }}>
        <RootNavigator />
      </View>
      <ExpiryDate />
      <GeneralServerErrorDialog />
      <InterntConnectionDialog isOpen={isOpenInternetConnectionDialog} />
    </StoreContext.Provider>
  );
};
export default observer(App);
