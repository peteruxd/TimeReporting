// Simple auth service using SHA-256 hashing

export const authService = {
    login: async (username, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username !== 'Time') {
            return false;
        }

        // Hash the password
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Hash of "password"
        const expectedHash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

        return hashHex === expectedHash;
    }
};
