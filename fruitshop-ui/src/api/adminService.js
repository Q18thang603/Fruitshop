import api from "./axios";

const adminService = {
    getDashboardStats: () => api.get("/admin/dashboard/stats"),
    getRecentOrders: () => api.get("/admin/dashboard/recent-orders"),
    getLowStockProducts: () => api.get("/admin/dashboard/low-stock-products"),
    
    // Products
    getProducts: () => api.get("/admin/products"),
    createProduct: (data) => api.post("/admin/products", data),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    uploadImage: (formData) => api.post("/admin/products/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),

    // Orders
    getOrders: () => api.get("/admin/orders"),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),

    // Users
    getUsers: () => api.get("/admin/users")
};

export default adminService;
