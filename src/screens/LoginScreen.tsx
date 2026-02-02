import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import AppInput from '../components/AppInput';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { loginUser } from '../features/auth/authSlice';

const LoginScreen = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('test@rydeu.com');
    const [password, setPassword] = useState('123456');

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Rydeu</Text>

            <AppInput label="Email" value={email} onChangeText={setEmail} />
            <AppInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FF6B35',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});
