const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api');

let authToken = localStorage.getItem('buildwise_token') || null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('buildwise_token', token);
  } else {
    localStorage.removeItem('buildwise_token');
  }
}

export function getAuthToken() {
  return authToken || localStorage.getItem('buildwise_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.error || data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.details = data;
      throw error;
    }
    return data;
  } catch (err) {
    console.warn(`[Buildwise API] Error fetching ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth & RBAC
  login: (email, password, role, extraPayload = {}) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role, ...extraPayload }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  inviteUser: (inviteData) => request('/auth/invite', { method: 'POST', body: JSON.stringify(inviteData) }),
  getUsers: () => request('/auth/users'),
  getAuditLogs: (params = '') => request(`/auth/audit-logs${params ? `?${params}` : ''}`),

  // Health
  checkHealth: () => request('/health'),

  // Sites
  getSites: () => request('/sites'),
  createSite: (siteData) => request('/sites', { method: 'POST', body: JSON.stringify(siteData) }),
  updateSite: (id, siteData) => request(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(siteData) }),
  deleteSite: (id) => request(`/sites/${id}`, { method: 'DELETE' }),

  // Materials
  getMaterials: () => request('/materials'),
  createMaterial: (matData) => request('/materials', { method: 'POST', body: JSON.stringify(matData) }),
  recordMaterialUsage: (id, usedQty) => request(`/materials/${id}/usage`, { method: 'POST', body: JSON.stringify({ usedQty }) }),
  updateMaterial: (id, matData) => request(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(matData) }),
  deleteMaterial: (id) => request(`/materials/${id}`, { method: 'DELETE' }),

  // Leftovers
  getLeftovers: () => request('/leftovers'),
  createLeftover: (leftoverData) => request('/leftovers', { method: 'POST', body: JSON.stringify(leftoverData) }),
  listLeftoverOnMarketplace: (id) => request(`/leftovers/${id}/list-to-marketplace`, { method: 'POST' }),
  deleteLeftover: (id) => request(`/leftovers/${id}`, { method: 'DELETE' }),

  // Marketplace Listings
  getMarketplace: (params = '') => request(`/marketplace/listings${params ? `?${params}` : ''}`),
  getMarketplaceListing: (id) => request(`/marketplace/listings/${id}`),
  createMarketplaceListing: (listingData) => request('/marketplace/listings', { method: 'POST', body: JSON.stringify(listingData) }),
  requestMarketplaceItem: (id, buyerName) => request(`/marketplace/${id}/request`, { method: 'POST', body: JSON.stringify({ buyerName }) }),
  deleteMarketplaceListing: (id) => request(`/marketplace/listings/${id}`, { method: 'DELETE' }),

  // Marketplace Profiles
  getMarketplaceProfiles: () => request('/marketplace/profiles'),
  getMarketplaceProfile: (id) => request(`/marketplace/profiles/${id}`),

  // Marketplace Inquiries & Negotiations
  getMarketplaceInquiries: (params = '') => request(`/marketplace/inquiries${params ? `?${params}` : ''}`),
  createMarketplaceInquiry: (inquiryData) => request('/marketplace/inquiries', { method: 'POST', body: JSON.stringify(inquiryData) }),
  respondToMarketplaceInquiry: (id, responseData) => request(`/marketplace/inquiries/${id}/respond`, { method: 'POST', body: JSON.stringify(responseData) }),
  getInquiryMessages: (inquiryId) => request(`/marketplace/inquiries/${inquiryId}/messages`),
  sendInquiryMessage: (inquiryId, messageData) => request(`/marketplace/inquiries/${inquiryId}/messages`, { method: 'POST', body: JSON.stringify(messageData) }),

  // Marketplace Orders & Tracking
  getMarketplaceOrders: (params = '') => request(`/marketplace/orders${params ? `?${params}` : ''}`),
  getMarketplaceOrder: (id) => request(`/marketplace/orders/${id}`),
  updateMarketplaceOrderStatus: (id, statusData) => request(`/marketplace/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),

  // Marketplace Dashboard
  getMarketplaceDashboardSummary: () => request('/marketplace/dashboard-summary'),

  // Workers
  getWorkers: () => request('/workers'),
  createWorker: (workerData) => request('/workers', { method: 'POST', body: JSON.stringify(workerData) }),
  toggleWorkerAttendance: (id, method) => request(`/workers/${id}/toggle-attendance`, { method: 'POST', body: JSON.stringify({ method }) }),
  updateWorker: (id, workerData) => request(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(workerData) }),
  deleteWorker: (id) => request(`/workers/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => request('/tasks'),
  createTask: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  updateTaskStatus: (id, status, progress) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, progress }) }),
  updateTask: (id, taskData) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendanceLogs: () => request('/attendance'),
  scanQRAttendance: (siteName, workerId) => request('/attendance/scan-qr', { method: 'POST', body: JSON.stringify({ siteName, workerId }) }),
  recordPunch: (punchData) => request('/attendance/punch', { method: 'POST', body: JSON.stringify(punchData) }),

  // Activities / Notifications
  getActivities: (limit = 30) => request(`/activities?limit=${limit}`),
  createActivity: (actData) => request('/activities', { method: 'POST', body: JSON.stringify(actData) }),

  // Database Seed
  seedDatabase: (options = {}) => request('/seed', { method: 'POST', body: JSON.stringify(options) })
};
