import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

/* stores*/
import CartStore from "./stores/cart";
import * as SplashScreen from "expo-splash-screen";
import { StoreContext } from "./stores";
// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);

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
    <StoreContext.Provider value={new CartStore()}>
      <View style={{ height: "100%" }} onLayout={onLayoutRootView}>
        <RootNavigator style={{ flexDirection: "row-reverse" }} />
      </View>
    </StoreContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});
