export const getUserData = async () => {
    const token = Cookies.get('token');
    console.log('Token from Cookies:', token); // ✅ Debug token retrieval

    if (!token) {
        console.error('No authentication token found');
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // ✅ Ensure token is included
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('User data:', data); // ✅ Log received user data
        return data;
    } catch (error) {
        console.error('User data fetch error:', error.message);
        clearAuthToken();
        throw error;
    }
};
