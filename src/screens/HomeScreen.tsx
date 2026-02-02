import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setAuthenticated } from '../features/auth/authSlice';

const HomeScreen = () => {
    const dispatch = useAppDispatch();

    return (
        <View>
            <Text>Home Screen</Text>
            <Button
                title="Logout"
                onPress={() => dispatch(setAuthenticated(false))}
            />
        </View>
    );
};

export default HomeScreen;
