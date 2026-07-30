const API_URL = 'http://localhost:8080/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, { headers: getHeaders() });
    return res.json();
};

export const createProduct = async (data) => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const fetchPriceHistory = async (productId) => {
    const res = await fetch(`${API_URL}/products/${productId}/history`, { headers: getHeaders() });
    return res.json();
};