export const loginApi = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Basic validation
    if (email === 'test@rydeu.com' && password === '123456') {
        return {
            token: 'mock-jwt-token-12345',
            user: {
                id: 1,
                name: 'Abhishek Raina',
                email: email,
            },
        };
    }

    throw new Error('Invalid credentials');
};
