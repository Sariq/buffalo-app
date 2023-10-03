import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import "./translations/i18n";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";

import * as Font from "expo-font";
import Constants from "expo-constants";
import RNRestart from "react-native-restart";
import {
  View,
  I18nManager,
  ImageBackground,
  Image,
  DeviceEventEmitter,
  Text,
  Linking,
  AppState,
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
import UpdateVersion from "./components/dialogs/update-app-version";
import { SITE_URL } from "./consts/api";
import themeStyle from "./styles/theme.style";
import { isLatestGreaterThanCurrent } from "./helpers/check-version";
import moment from "moment";
import axios from "axios";
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();
let customARFonts = {
  "ar-Black": require(`./assets/fonts/ar/Black.ttf`),
  "ar-Bold": require(`./assets/fonts/ar/Bold.ttf`),
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
  const appState = useRef(AppState.currentState);

  const [assetsIsReady, setAssetsIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isExtraLoadFinished, setIsExtraLoadFinished] = useState(false);
  const [isFontReady, setIsFontReady] = useState(false);
  const [
    isOpenInternetConnectionDialog,
    setIsOpenInternetConnectionDialog,
  ] = useState(false);
  const [isOpenUpdateVersionDialog, setIsOpenUpdateVersionDialog] = useState(
    false
  );

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    }
  }, []);

  const cacheImages = (images) => {
    return new Promise((resolve) => {
      const tempImages = images.map(async (image) => {
        if (typeof image === "string") {
          await Image.prefetch(image);
        } else {
          await Asset.fromModule(image).downloadAsync();
        }
      });
      resolve(true);
    });
  };

  const deleteCreditCardData = async (appversion: string) => {
    const data = await AsyncStorage.getItem("@storage_CCData");
    const ccDetails = JSON.parse(data);
    if (ccDetails && !ccDetails?.cvv) {
      await AsyncStorage.removeItem("@storage_CCData");
    }
  };

  const handleV02 = async (appversion: string) => {
    if (
      appversion === "1.0.0" ||
      appversion === "1.0.1" ||
      appversion === "1.0.2"
    ) {
      setIsOpenUpdateVersionDialog(true);
      return true;
    }
    return false;
  };

  const handleVersions = async () => {
    const appVersion = Constants.nativeAppVersion;
    const currentVersion = await AsyncStorage.getItem("@storage_version");
    deleteCreditCardData(appVersion);
    const flag = await handleV02(appVersion);
    if (flag) {
      return;
    }
    if (
      !currentVersion ||
      isLatestGreaterThanCurrent(appVersion, currentVersion)
    ) {
      await AsyncStorage.setItem("@storage_version", appVersion?.toString());
      return;
    }
  };

  const handleUpdateVersionDialogAnswer = () => {
    Linking.openURL("https://onelink.to/zky772");
  };
  const handleCartReset = async () => {
    const cartCreatedDate = await AsyncStorage.getItem(
      "@storage_cartCreatedDate"
    );
    const cartCreatedDateValue = JSON.parse(cartCreatedDate);
    if (cartCreatedDateValue) {
      var end = moment(new Date());
      var now = moment(cartCreatedDateValue.date);
      var duration = moment.duration(end.diff(now));
      if (duration.asMinutes() >= 30) {
        cartStore.resetCart();
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        //console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      if( appState.current === 'active'){
        handleCartReset();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  async function prepare() {
    try {
      handleVersions();
      // Pre-load fonts, make any API calls you need to do here
      await Font.loadAsync(customARFonts);
      setIsFontReady(true);
      const imageAssets2 = cacheImages([
        require("./assets/menu/gradiant/baecon-buffalo.png"),
        require("./assets/menu/gradiant/baecon.png"),
        require("./assets/menu/gradiant/barbicu.png"),
        require("./assets/menu/gradiant/buffalo-souce.png"),
        require("./assets/menu/gradiant/cheese.png"),
        require("./assets/menu/gradiant/crispy-chicken.png"),
        require("./assets/menu/gradiant/egg.png"),
        require("./assets/menu/gradiant/friedOnion.png"),
        require("./assets/menu/gradiant/gaouda.png"),
        require("./assets/menu/gradiant/jalapeno.png"),
        require("./assets/menu/gradiant/ketchup.png"),
        require("./assets/menu/gradiant/khs.png"),
        require("./assets/menu/gradiant/mozerla.png"),
        require("./assets/menu/gradiant/musterd.png"),
        require("./assets/menu/gradiant/onion.png"),
        require("./assets/menu/gradiant/pickels.png"),
        require("./assets/menu/gradiant/sersachi.png"),
        require("./assets/menu/gradiant/sweet-chilli.png"),
        require("./assets/menu/gradiant/tomatto.png"),
        require("./assets/menu/gradiant/truffle.png"),
        require("./assets/menu/gradiant/onion-ring.png"),
      ]);
      // await AsyncStorage.setItem("@storage_selcted_store_v2",'')
      let fetchStoreDataStore = null;
      if(cartStore.getProductsCount() > 0){
        const selectedStore = await AsyncStorage.getItem("@storage_selcted_store_v2");
        fetchStoreDataStore = storeDataStore.getStoreData(selectedStore);
        storeDataStore.setSelectedStore(selectedStore)
      }
      //const selectedStore = await AsyncStorage.getItem("@storage_selcted_store");

      const fetchTranslations = menuStore.getTranslations('1');
      const fetchMenu = menuStore.getMenu('1');
      const fetchHomeSlides = menuStore.getSlides();
      // const fetchStoreDataStore = storeDataStore.getStoreData(selectedStore);
      
      //storeDataStore.setSelectedStore(selectedStore)
      Promise.all([fetchTranslations,fetchMenu, fetchHomeSlides, fetchStoreDataStore]).then(async (responses) => {
        const imageAssets2 = await cacheImages(menuStore.imagesUrl);

        const tempHomeSlides = menuStore.homeSlides.map((slide) => {
          return `${SITE_URL}${slide.file_url}`;
        });
        const imageAssets = await cacheImages(tempHomeSlides);
        if (authStore.isLoggedIn()) {
          // storeDataStore.getPaymentCredentials(selectedStore);

          const fetchUserDetails = userDetailsStore.getUserDetails();
          const fetchOrders = ordersStore.getOrders();
          userDetailsStore.setIsAcceptedTerms(true);
          Promise.all([
            fetchUserDetails,
            fetchOrders,
          ]).then((res) => {
            setAppIsReady(true);
            setTimeout(() => {
              setIsExtraLoadFinished(true);
            }, 400);
          });
        } else {
          const data = await AsyncStorage.getItem("@storage_terms_accepted");
          userDetailsStore.setIsAcceptedTerms(JSON.parse(data));
          setAppIsReady(true);
          setTimeout(() => {
            setIsExtraLoadFinished(true);
          }, 400);
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

const checkInternetConnection = () => {
  axios.get('https://google.com', {
    timeout: 30000, 
    headers: {
      'X-RapidAPI-Key': 'your-rapid-api-key',
      'X-RapidAPI-Host': 'jokes-by-api-ninjas.p.rapidapi.com'
    }
  })
  .then(response => {
  })
  .catch(error => {
    if (error.code === 'ECONNABORTED') {
      setIsOpenInternetConnectionDialog(true);
    }
  });
}


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOpenInternetConnectionDialog(!state.isConnected);
      if (!state.isConnected) {
        prepare();
      }
    });
    checkInternetConnection();
    const interval = setInterval(() => {
      checkInternetConnection();
    }, 15 * 1000);
    prepare();
    return () => {
      unsubscribe();
      clearInterval(interval);
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

  const loadingPage = () => {
    const version = Constants.nativeAppVersion;
    return (
      <ImageBackground
        source={require("./assets/splash-screen-3.png")}
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
              color: themeStyle.BROWN_700,
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
                color: themeStyle.BROWN_700,
              }}
            >
              Sari Qashuw{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: themeStyle.BROWN_700,
              }}
            >
              | Sabri Qashuw
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              marginBottom: 0,
            }}
          >
            <Text style={{ textAlign: "center", color: themeStyle.BROWN_700 }}>
              {version}
            </Text>
          </View>
        </View>
        <GeneralServerErrorDialog />
        <InterntConnectionDialog isOpen={isOpenInternetConnectionDialog} />
      </ImageBackground>
    );
  };

  if (!appIsReady) {
    return loadingPage();
  }

  return (
    <View style={{ flex: 1 }}>
      {!isExtraLoadFinished && loadingPage()}
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
        <UpdateVersion
          isOpen={isOpenUpdateVersionDialog}
          handleAnswer={handleUpdateVersionDialogAnswer}
        />
      </StoreContext.Provider>
    </View>
  );
};
export default observer(App);
