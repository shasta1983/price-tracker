const API_URL = 'http://localhost:8080/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

const handleResponse = async (res) => {
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            console.error('Sesión expirada o no autorizada');
            // Si el token expira o falla, limpiamos y recargamos automáticamente
            localStorage.removeItem('token');
            window.location.reload();
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, { headers: getHeaders() });
    return handleResponse(res);
};

export const createProduct = async (data) => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

export const fetchPriceHistory = async (productId) => {
    const res = await fetch(`${API_URL}/products/${productId}/history`, { headers: getHeaders() });
    return handleResponse(res);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.reload();
};