const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Server error occurred');
  }
  return data;
}

export const authApi = {
  register: (email, password, fullName) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName })
    }),
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  sendOtp: (email, fullName) =>
    apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, fullName })
    }),
  verifyOtp: (email, otp, fullName) =>
    apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, fullName })
    })
};

export const financeApi = {
  getFinances: (userId) => apiRequest(`/finances/${userId}`),
  addTransaction: (txData) =>
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData)
    }),
  deleteTransaction: (id) =>
    apiRequest(`/transactions/${id}`, {
      method: 'DELETE'
    }),
  updateTransaction: (id, data) =>
    apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  updateIntent: (id, intentData) =>
    apiRequest(`/transactions/${id}/intent`, {
      method: 'PATCH',
      body: JSON.stringify(intentData)
    }),
  saveBudget: (budgetData) =>
    apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData)
    }),
  saveGoal: (goalData) =>
    apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData)
    }),
  contributeGoal: (id, amount) =>
    apiRequest(`/goals/${id}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
};
