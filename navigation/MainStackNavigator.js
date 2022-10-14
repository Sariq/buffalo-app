import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FooterTabs from '../components/layout/footer-tabs/FooterTabs';
import CartScreen from '../screens/cart/cart'
import TermsAndConditionsScreen from '../screens/terms-and-conditions';
import MealScreen from '../screens/meal';
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
           <Stack.Screen
                name='meal'
                component={MealScreen}
                initialParams={{ itemId: null, categoryId: null }}

            />
      </Stack.Navigator>
  )}