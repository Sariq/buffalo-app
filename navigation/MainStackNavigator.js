import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FooterTabs from '../components/layout/footer-tabs/FooterTabs';
import CartScreen from '../screens/cart/cart'
const Stack = createStackNavigator();

export const MainStackNavigator = ({}) => {
  return (
      <Stack.Navigator
          initialRouteName={'Tab'}
          header={null}
          headerMode='none'
          mode={'card'}
      >
          <Stack.Screen
              name='Tab'
              component={FooterTabs}
          />
           <Stack.Screen
                name='cart'
                component={CartScreen}
            />
      </Stack.Navigator>
  )}