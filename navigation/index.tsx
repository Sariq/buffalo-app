import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { MainStackNavigator } from "./MainStackNavigator";
import Header from "../components/layout/header/header";

const MyTheme = {
  ...DefaultTheme,
  fontSize: 40,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(255, 45, 85)",
  },
};

const RootNavigator = ({}) => {
  return (
    <NavigationContainer>
      <Header />
      <MainStackNavigator />
    </NavigationContainer>
  );
};

export default RootNavigator;
