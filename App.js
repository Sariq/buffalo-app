import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation"
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
/*components*/
import FooterTabs from "./components/layout/footer-tabs/FooterTabs";
import Header from "./components/layout/header/header";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  fontSize:30,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default function App() {
  return (
    // <PaperProvider theme={theme}>

    <>
      {/* <View> */}
       {/* <Header/> */}
      {/* </View> */}
      {/* <NavigationContainer>
        <FooterTabs />
      </NavigationContainer> */}
            <RootNavigator style={{flexDirection: 'row-reverse'}}/>

    </>
    // </PaperProvider>

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
