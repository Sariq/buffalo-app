import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import * as Font from "expo-font";

import { View, I18nManager } from "react-native";
import RootNavigator from "./navigation";
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
import i18n from "./translations";
/* stores*/
import CartStore from "./stores/cart";
import MenuStore from "./stores/menu";
import * as SplashScreen from "expo-splash-screen";
import { StoreContext } from "./stores";
import LanguageStore from "./stores/language";
import AuthStore from "./stores/auth";
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
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFontReady, setIsFontReady] = useState(false);
  const [globalStyles, setGlobalStyles] = useState({fontFamily: `${i18n.locale}-`});
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(customARFonts);
        setIsFontReady(true);

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 0));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
    i18n.onChange(() => {
      setGlobalStyles({ fontFamily: `${i18n.locale}-` });
    });
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
    return null;
  }

  return (
    <StoreContext.Provider
      value={{
        cartStore: new CartStore(),
        authStore: new AuthStore(),
        menuStore: new MenuStore(),
        languageStore: new LanguageStore(),
        globalStyles: globalStyles,
      }}
    >
      <View style={{ height: "100%" }} onLayout={onLayoutRootView}>
        <StatusBar />
        <RootNavigator />
      </View>
    </StoreContext.Provider>
  );
};

