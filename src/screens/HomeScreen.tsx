import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { logout } from '../features/auth/authSlice';

const HomeScreen = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.placeholder}>
                    Calendar will be implemented here.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => dispatch(logout())}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    welcome: {
        fontSize: 20,
        fontWeight: '700',
    },
    userEmail: {
        color: '#555',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        color: '#999',
    },
    logoutButton: {
        backgroundColor: '#E74C3C',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
    },
});
