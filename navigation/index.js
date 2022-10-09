import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { MainStackNavigator } from './MainStackNavigator';
import Header from "../components/layout/header/header"
const RootNavigator = ({}) =>{

    return (
        <NavigationContainer >
            <Header/>
            <MainStackNavigator />
        </NavigationContainer>
    )
}

export default RootNavigator;