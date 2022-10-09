import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation"
/*components*/
import FooterTabs from "./components/layout/footer-tabs/FooterTabs";
import Header from "./components/layout/header/header"
export default function App() {
  return (
    <>
      <View>
       {/* <Header/> */}
      </View>
      {/* <NavigationContainer>
        <FooterTabs />
      </NavigationContainer> */}
            <RootNavigator />

    </>
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
