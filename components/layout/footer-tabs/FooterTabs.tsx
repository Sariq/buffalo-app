import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";

import Icon from "../../icon";

/* styles */
import theme from "../../../styles/theme.style";

/* screens */
import HomeScreen from "../../../screens/home/home";
import ContactUs from "../../../screens/contact-us/contactUs";
import MenuScreen from "../../../screens/menu/menu";

import { useState } from "react";
import TermsAndConditionsScreen from "../../../screens/terms-and-conditions";
import i18n from "../../../translations";

const routes = [
  {
    id: 1,
    name: "homeScreen",
    title: "الرئيسية",
    icon: "home_icon",
    component: HomeScreen,
  },
  {
    id: 2,
    name: "menuScreen",
    title: "قائمة الطعام",
    icon: "burger_icon",
    component: MenuScreen,
  },
  {
    id: 3,
    name: "BCOINSScreen",
    title: "B COINS",
    icon: "bcoin_icon",
    component: HomeScreen,
  },
  {
    id: 4,
    name: "termsAndConditions",
    title: "العروض",
    icon: "deals_icon",
    component: TermsAndConditionsScreen,
  },
  {
    id: 5,
    name: "contactUsScreen",
    title: "اتصل بنا",
    icon: "phone_icon",
    component: ContactUs,
  },
];

function MyTabBar({ state, descriptors, navigation }) {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);

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

        const onPress = () => {
          if (route.name === "contactUsScreen") {
            Linking.openURL("tel:0509333657");
            return;
          }
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
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.container,
              { flex: 1, alignItems: "center", marginTop: isBcoin ? -40 : 0 },
            ]}
          >
            <View style={styles.container}>
              <Icon
                icon={currentRout.icon}
                size={isBcoin ? 75 : 30}
                style={{ color: theme.GRAY_700 }}
              />
              <Text
                style={{
                  marginTop: isBcoin ? 0 : 5,
                  fontFamily: `${i18n.locale}-SemiBold`,
                  fontSize: 12
                }}
              >
                {route.params.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function FooterTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      {routes.map((route) => (
        <Tab.Screen
          name={route.name}
          component={route.component}
          initialParams={{ title: route.title }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
