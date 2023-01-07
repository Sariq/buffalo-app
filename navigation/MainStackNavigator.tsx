import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FooterTabs from "../components/layout/footer-tabs/FooterTabs";
import CartScreen from "../screens/cart/cart";
import TermsAndConditionsScreen from "../screens/terms-and-conditions";
import MealScreen from "../screens/meal";
import ProfileScreen from "../screens/profile";
import LoginScreen from "../screens/login";
import VerifyCodeScreen from "../screens/verify-code";
import LanguageScreen from "../screens/language";
import OrderSubmittedScreen from "../screens/order/submitted";
import OrderHistoryScreen from "../screens/order/history";
import insertCustomerName from "../screens/insert-customer-name";

const Stack = createStackNavigator();

export const MainStackNavigator = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName={"Tab"}
      header={null}
      headerMode="none"
      presentation={"presentation"}
    >
      <Stack.Screen name="Tab" component={FooterTabs} />
      <Stack.Screen name="cart" component={CartScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="insert-customer-name" component={insertCustomerName} />
      <Stack.Screen name="verify-code" component={VerifyCodeScreen} initialParams={{ phoneNumber: null }} />
      <Stack.Screen name="language" component={LanguageScreen} />
      <Stack.Screen name="order-history" component={OrderHistoryScreen} />
      <Stack.Screen 
        name="order-submitted"
        component={OrderSubmittedScreen}
        initialParams={{ shippingMethod: null }}
      />
      <Stack.Screen
        name="meal"
        component={MealScreen}
        initialParams={{ product: null }}
      />
      <Stack.Screen
        name="meal/edit"
        component={MealScreen}
        initialParams={{ index: null }}
      />
    </Stack.Navigator>
  );
};
