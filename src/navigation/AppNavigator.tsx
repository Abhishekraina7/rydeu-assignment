import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from '../types/AuthStack';
import AppStack from '../types/AppStack';
import { useAppSelector } from '../hooks/reduxHooks';

const AppNavigator = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;
