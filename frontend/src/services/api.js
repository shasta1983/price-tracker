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
        const errorData = await res.json().catch(() => ({}));

        // Si la sesión expiró o el token es inválido (401)
        if (res.status === 401) {
            throw new Error('SESSION_EXPIRED');
        }

        // Si es 403, 404, 500 o cualquier otro error de negocio/servidor
        throw new Error(errorData.message || `API_ERROR_${res.status}`);
    }
    return res.json();
};

export const login = async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(res);
};

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, { headers: getHeaders() });
    return handleResponse(res);
};

// <-- AGREGA ESTA FUNCIÓN NUEVA AQUÍ -->
export const createProduct = async (productData) => {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData),
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
};