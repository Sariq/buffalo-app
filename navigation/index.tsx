import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppContainer from "../components/layout/app-container";

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
      <AppContainer/>
    </NavigationContainer>
  );
};

export default RootNavigator;
