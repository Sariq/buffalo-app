import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DeviceEventEmitter, StyleSheet } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";

import Icon from "../../icon";

/* styles */
import theme from "../../../styles/theme.style";

/* screens */
import HomeScreen from "../../../screens/home/home";
import ContactUs from "../../../screens/contact-us/contactUs";
import MenuScreen from "../../../screens/menu/menu";
import BcoinScreen from "../../../screens/b-coin";

import { useState, useContext, useEffect } from "react";
import TermsAndConditionsScreen from "../../../screens/terms-and-conditions";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../../../translations/i18n";
import themeStyle from "../../../styles/theme.style";
import { StoreContext } from "../../../stores";
import { observer } from "mobx-react";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const routes = [
  {
    id: 1,
    name: "homeScreen",
    title: "footer_home",
    icon: "home_icon",
    component: HomeScreen,
  },
  {
    id: 2,
    name: "menuScreen",
    title: "footer_menu",
    icon: "burger_icon",
    component: MenuScreen,
  },
  {
    id: 3,
    name: "BCOINSScreen",
    title: "B COINS",
    icon: "bcoin_icon",
    component: BcoinScreen,
  },
  {
    id: 4,
    name: "instagram",
    title: "followus",
    icon: "instagram",
    component: TermsAndConditionsScreen,
  },
  {
    id: 5,
    name: "contactUsScreen",
    title: "footer_contactus",
    icon: "phone_icon",
    component: ContactUs,
  },
];
const MyTabBar = ({ state, descriptors, navigation, bcoin, disabledAreas }) => {
// function MyTabBar({ state, descriptors, navigation, bcoin }) {
  const { t } = useTranslation();
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const { authStore,storeDataStore, cartStore } = useContext(StoreContext);

  const onTabSelect = (name) => {
    const currentRout = routes.find((route) => route.name === name);
    setSelectedRoute(currentRout);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.PRIMARY_COLOR,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const currentRout = routes.find((route) => route.name === label);
        const isBcoin = currentRout.name === "BCOINSScreen";

        const onPress = async () => {
          if (route.name === "contactUsScreen") {
            Linking.openURL("tel:0509333657");
            return;
          }
          if (route.name === "instagram") {
            Linking.openURL("instagram://user?username=buffalo_burger_house");
            return;
          }
          if (route.name === "BCOINSScreen") {
            if(!authStore.isLoggedIn()){
              navigation.navigate("login");
              return;
            }
          }
          if (route.name === "menuScreen") {
            if(!storeDataStore.selectedStore){
              storeDataStore.onDisableAreas({header: true, footer: true})
              DeviceEventEmitter.emit(`GO_TO_NEW_ORDER`, {
              });
              return;
            }
          }
          // if (route.name === "homeScreen") {
          //   if(cartStore.getProductsCount() == 0){
          //     storeDataStore.setSelectedStore(null);
          //     await AsyncStorage.setItem("@storage_selcted_store_v2", '');
          //   }
          // }
          onTabSelect(route.name);
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };


        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={disabledAreas?.footer ? null :onPress}
            disabled={disabledAreas?.footer}
            style={[
              styles.container,
              { flex: 1, alignItems: "center", marginTop: isBcoin ? -40 : 0 },
            ]}
          >
            <View style={styles.container} pointerEvents={disabledAreas?.footer ? "none" : "auto"}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Icon
                  icon={currentRout.icon}
                  size={isBcoin ? 80 : 30}
                  style={{ color: theme.GRAY_700 }}
                />
                {isBcoin && authStore.isLoggedIn() &&(
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: -12,
                      backgroundColor: themeStyle.SUCCESS_LIGHT_COLOR,
                      borderRadius: 50,
                      padding: 0,
                      borderWidth: 2,
                      borderColor: themeStyle.WHITE_COLOR,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: themeStyle.GRAY_700,
                        width:30,
                        height:30,
                        textAlign:"center", top:5
                      }}
                    >
                      {bcoin}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ marginTop: isBcoin ? 12 : 0 }}>
                <Text
                  style={{
                    marginTop: isBcoin ? 0 : 5,
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 12,
                    color: themeStyle.BROWN_700
                  }}
                >
                  {t(route.params.title)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
observer(MyTabBar);

const Tab = createBottomTabNavigator();

const FooterTabs = () => {
  const { userDetailsStore, authStore,storeDataStore } = useContext(StoreContext);
  const [bcoin, setBcoin] = useState();
  const [disabledAreas, setDisabledAreas] = useState();
  const getUserDetails = () => {
    if(authStore.isLoggedIn()){
      userDetailsStore.getUserDetails();
    }
  };

  useEffect(() => {
    if(authStore.isLoggedIn()){
      getUserDetails();
    }
  }, [authStore.userToken]);

 
  useEffect(()=>{
    setBcoin(userDetailsStore.userDetails?.credit)
  },[userDetailsStore.userDetails])

  useEffect(()=>{
    setDisabledAreas(storeDataStore.disabledAreas)
  },[storeDataStore.disabledAreas])

  return (
    
 <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <MyTabBar {...props} bcoin={bcoin} disabledAreas={disabledAreas}/>}
    >
      {routes.map((route, index) => (
        <Tab.Screen
          name={route.name}
          component={route.component}
          initialParams={{ title: route.title }}
          key={index}
          
        />
      ))}
    </Tab.Navigator>
   
   
  );
}

export default observer(FooterTabs)

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
