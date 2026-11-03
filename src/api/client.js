import API_URL from './config';

const getToken = () => localStorage.getItem('token');

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const authAPI = {
  register: (body) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiRequest('/auth/me'),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

export const productsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/products${q ? `?${q}` : ''}`);
  },
  getOne: (id) => apiRequest(`/products/${id}`),
};

export const cartAPI = {
  get: () => apiRequest('/cart'),
  add: (body) => apiRequest('/cart/add', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) => apiRequest('/cart/update', { method: 'PUT', body: JSON.stringify(body) }),
  remove: (body) => apiRequest('/cart/remove', { method: 'DELETE', body: JSON.stringify(body) }),
  clear: () => apiRequest('/cart/clear', { method: 'DELETE' }),
};

export const ordersAPI = {
  create: (body) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(body) }),
  myOrders: () => apiRequest('/orders/my-orders'),
  getOne: (id) => apiRequest(`/orders/${id}`),
};
