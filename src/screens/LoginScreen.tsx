import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setAuthenticated } from '../features/auth/authSlice';

const LoginScreen = () => {
    const dispatch = useAppDispatch();

    return (
        <View>
            <Text>Login Screen</Text>
            <Button
                title="Mock Login"
                onPress={() => dispatch(setAuthenticated(true))}
            />
        </View>
    );
};

export default LoginScreen;
