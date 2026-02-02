import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from '../types/AuthStack';
import AppStack from '../types/AppStack';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthenticated } from '../features/auth/authSlice';
import { ActivityIndicator, View } from 'react-native';


const AppNavigator = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                dispatch(setAuthenticated(true));
            }
            setCheckingAuth(false);
        };

        checkToken();
    }, []);

    if (checkingAuth) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
export default AppNavigator;
