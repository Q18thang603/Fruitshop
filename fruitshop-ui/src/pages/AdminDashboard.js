import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import adminService from "../api/adminService";
import { toast } from "react-toastify";
import {
    Layout,
    Menu,
    Button,
    Card,
    Row,
    Col,
    Table,
    Tag,
    Badge,
    Avatar,
    Dropdown,
    Space,
    Typography,
    ConfigProvider,
    Spin,
    Select,
    Drawer,
    Divider,
    Tooltip,
    Input
} from 'antd';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu as MenuIcon,
    Bell,
    User as UserIcon,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Search,
    ShieldCheck,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    Eye,
    Filter,
    DollarSign,
    Activity,
    ShoppingBag,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductImage } from "../utils/imageUtils";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Scroll ref for Revenue Analytics
    const revenueRef = useRef(null);

    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        lowStockCount: 0,
        monthlyRevenue: {},
        totalSoldProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [users, setUsers] = useState([]);

    // Order search, filter, and detail states
    const [orderSearch, setOrderSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLowStockDrawerOpen, setIsLowStockDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const path = location.pathname;

                if (path === '/admin/dashboard' || path === '/admin/reports' || path === '/admin/orders') {
                    const [statsRes, ordersRes, stockRes, allOrdersRes] = await Promise.all([
                        adminService.getDashboardStats(),
                        adminService.getRecentOrders(),
                        adminService.getLowStockProducts(),
                        adminService.getOrders()
                    ]);
                    if (statsRes.data.success) setStats(statsRes.data.data);
                    if (ordersRes.data.success) setRecentOrders(ordersRes.data.data);
                    if (stockRes.data.success) setLowStockProducts(stockRes.data.data);
                    if (allOrdersRes.data.success) setAllOrders(allOrdersRes.data.data);
                }

                if (path === '/admin/users') {
                    const usersRes = await adminService.getUsers();
                    if (usersRes.data.success) setUsers(usersRes.data.data);
                }

            } catch (error) {
                console.error("Admin data error:", error);
                toast.error("Không thể tải dữ liệu admin");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.pathname]);

    // Handle scroll to Revenue Analytics on Reports page
    useEffect(() => {
        if (location.pathname === '/admin/reports' && location.state?.scrollToRevenue) {
            setTimeout(() => {
                if (revenueRef.current) {
                    revenueRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 150);
            // Clear history state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.pathname, location.state, navigate]);

    if (!user || user.role !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { key: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: <Link to="/admin/dashboard">Dashboard</Link> },
        { key: '/admin/products', icon: <Package size={18} />, label: <Link to="/admin/products">Sản phẩm</Link> },
        { key: '/admin/orders', icon: <ShoppingCart size={18} />, label: <Link to="/admin/orders">Đơn hàng</Link> },
        { key: '/admin/users', icon: <Users size={18} />, label: <Link to="/admin/users">Người dùng</Link> },
        { key: '/admin/reports', icon: <BarChart3 size={18} />, label: <Link to="/admin/reports">Báo cáo</Link> },
        { type: 'divider' },
        { key: '/admin/settings', icon: <Settings size={18} />, label: <Link to="/admin/settings">Cài đặt</Link> },
    ];

    const userDropdownItems = [
        { key: 'profile', label: <Link to="/profile">Hồ sơ cá nhân</Link>, icon: <UserIcon size={14} /> },
        { key: 'logout', label: <span onClick={logout}>Đăng xuất</span>, icon: <LogOut size={14} />, danger: true },
    ];

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await adminService.updateOrderStatus(id, status);
            if (res.data.success) {
                toast.success("Cập nhật trạng thái thành công");
                
                // Update in allOrders list
                setAllOrders(prevOrders => prevOrders.map(o => o.id === id ? { ...o, status: status } : o));
                
                // Update in recentOrders list
                setRecentOrders(prevOrders => prevOrders.map(o => o.id === id ? { ...o, status: status } : o));

                // If currently open in drawer, update selectedOrder
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(prev => ({ ...prev, status: status }));
                }
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    // Calculate Best Selling Products dynamically
    const getBestSellingProducts = () => {
        const productMap = {};
        allOrders.forEach(order => {
            if (order.status === 'COMPLETED' && order.items) {
                order.items.forEach(item => {
                    if (item.product) {
                        const prodId = item.product.id;
                        if (!productMap[prodId]) {
                            productMap[prodId] = {
                                id: prodId,
                                name: item.product.name,
                                image: item.product.image,
                                quantitySold: 0,
                                revenue: 0
                            };
                        }
                        productMap[prodId].quantitySold += item.quantity;
                        productMap[prodId].revenue += item.price * item.quantity;
                    }
                });
            }
        });
        return Object.values(productMap).sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5);
    };

    const getStatusDetails = (status) => {
        const statuses = {
            PENDING: { color: '#F59E0B', bg: '#FEF3C7', label: 'Chờ xử lý', icon: Clock },
            PROCESSING: { color: '#3B82F6', bg: '#DBEAFE', label: 'Đang xử lý', icon: Activity },
            SHIPPING: { color: '#8B5CF6', bg: '#EDE9FE', label: 'Đang giao', icon: Truck },
            COMPLETED: { color: '#10B981', bg: '#D1FAE5', label: 'Hoàn thành', icon: CheckCircle2 },
            CANCELLED: { color: '#EF4444', bg: '#FEE2E2', label: 'Đã hủy', icon: XCircle }
        };
        return statuses[status] || { color: '#6B7280', bg: '#F3F4F6', label: status, icon: Clock };
    };

    const userColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', render: (id) => <Text className="font-bold">#USR-{id}</Text> },
        { title: 'Username', dataIndex: 'username', key: 'username', render: (text) => <Text className="font-extrabold text-slate-800">{text}</Text> },
        { title: 'Email', dataIndex: 'email', key: 'email', render: (email) => <Text className="text-slate-600">{email || '—'}</Text> },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', render: (phone) => <Text className="text-slate-600">{phone || '—'}</Text> },
        { title: 'Vai trò', dataIndex: 'role', key: 'role', render: (role) => <Tag color="green" className="rounded-full px-3 py-0.5 font-bold uppercase text-[10px] border-none bg-green-50 text-green-600">{role?.name || "USER"}</Tag> },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date) => <Text className="text-slate-400">{new Date(date).toLocaleDateString("vi-VN")}</Text> },
    ];

    const orderColumns = [
        {
            title: 'Mã ĐH',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <Text className="font-black text-slate-800">#ORD-{id}</Text>
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (name, record) => (
                <div className="flex flex-col">
                    <Text className="font-extrabold text-slate-800">{name}</Text>
                    <Text className="text-[10px] font-bold text-slate-400">{record.customerPhone}</Text>
                </div>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <Text className="font-extrabold text-green-600">{amount?.toLocaleString()} đ</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const details = getStatusDetails(status);
                const IconComponent = details.icon;
                return (
                    <Tag 
                        style={{ color: details.color, backgroundColor: details.bg }}
                        className="rounded-full px-3 py-1 font-extrabold uppercase text-[10px] border-none inline-flex items-center gap-1"
                    >
                        <IconComponent size={10} />
                        {details.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => <Text className="text-slate-400 font-medium">{new Date(date).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</Text>
        }
    ];

    const fullOrderColumns = [
        ...orderColumns,
        {
            title: 'Cập nhật trạng thái',
            key: 'updateStatus',
            render: (_, record) => (
                <Select
                    defaultValue={record.status}
                    onChange={(val) => handleStatusUpdate(record.id, val)}
                    className="w-36 rounded-xl font-bold"
                    style={{ height: '36px' }}
                    onClick={(e) => e.stopPropagation()} // Prevent row click event
                >
                    <Select.Option value="PENDING">Chờ xử lý</Select.Option>
                    <Select.Option value="PROCESSING">Đang xử lý</Select.Option>
                    <Select.Option value="SHIPPING">Đang giao</Select.Option>
                    <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
                    <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                </Select>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="primary"
                        ghost
                        icon={<Eye size={16} />}
                        className="rounded-xl border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 flex items-center justify-center h-9 w-9"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(record);
                            setIsDrawerOpen(true);
                        }}
                    />
                </Tooltip>
            )
        }
    ];

    const handleRowClick = (record) => {
        setSelectedOrder(record);
        setIsDrawerOpen(true);
    };

    // Helper to safely navigate to existing User Management route
    const navigateToUserManagement = () => {
        // We know /admin/users is configured in App.js.
        // If it wasn't, we could fallback to another route.
        navigate('/admin/users');
    };

    const renderContent = () => {
        const path = location.pathname;

        if (path === '/admin/orders') {
            // Calculate dynamic stats for order page
            const totalOrdersCount = allOrders.length;
            const pendingOrdersCount = allOrders.filter(o => o.status === 'PENDING').length;
            const shippingOrdersCount = allOrders.filter(o => o.status === 'SHIPPING' || o.status === 'PROCESSING').length;
            const completedOrdersCount = allOrders.filter(o => o.status === 'COMPLETED').length;
            const cancelledOrdersCount = allOrders.filter(o => o.status === 'CANCELLED').length;

            const filteredOrders = allOrders.filter(order => {
                const matchesSearch = 
                    order.id.toString().includes(orderSearch) ||
                    (order.customerName && order.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
                    (order.customerPhone && order.customerPhone.includes(orderSearch));
                
                const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            });

            return (
                <div className="space-y-8">
                    {/* Dynamic Stats Cards */}
                    <Row gutter={[20, 20]}>
                        {[
                            { label: "Tổng Đơn hàng", value: totalOrdersCount, icon: ShoppingBag, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100" },
                            { label: "Đang chờ duyệt", value: pendingOrdersCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50/70", border: "border-amber-100/80" },
                            { label: "Đang xử lý / giao", value: shippingOrdersCount, icon: Truck, color: "text-blue-600", bg: "bg-blue-50/70", border: "border-blue-100/80" },
                            { label: "Đã hoàn thành", value: completedOrdersCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50/70", border: "border-emerald-100/80" },
                            { label: "Đã hủy bỏ", value: cancelledOrdersCount, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50/70", border: "border-rose-100/80" }
                        ].map((stat, i) => (
                            <Col xs={24} sm={12} lg={4.8} style={{ width: '20%' }} className="responsive-col" key={i}>
                                <motion.div 
                                    whileHover={{ y: -4 }}
                                    className={`bg-white p-6 rounded-3xl border ${stat.border} shadow-sm flex items-center gap-4 transition-all`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                                        <stat.icon size={22} />
                                    </div>
                                    <div>
                                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">{stat.label}</Text>
                                        <Title level={3} className="m-0 font-black tracking-tight text-slate-800">{stat.value}</Title>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>

                    {/* Filter & Toolbar */}
                    <Card className="rounded-3xl border-none shadow-md shadow-slate-100/80 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Filter size={18} className="text-slate-400" />
                                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-xs">Bộ lọc & Tìm kiếm</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Input
                                    prefix={<Search size={16} className="text-slate-400 mr-2" />}
                                    placeholder="Tìm theo Mã ĐH, tên khách hàng..."
                                    className="w-72 h-11 rounded-xl bg-slate-50 border-none hover:bg-slate-100/80 focus:bg-white"
                                    value={orderSearch}
                                    onChange={e => setOrderSearch(e.target.value)}
                                />
                                <Select
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    className="w-48 h-11 custom-select font-bold"
                                >
                                    <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                                    <Select.Option value="PENDING">Chờ xử lý</Select.Option>
                                    <Select.Option value="PROCESSING">Đang xử lý</Select.Option>
                                    <Select.Option value="SHIPPING">Đang giao hàng</Select.Option>
                                    <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
                                    <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                                </Select>
                            </div>
                        </div>

                        {/* Order Table */}
                        <Table 
                            columns={fullOrderColumns} 
                            dataSource={filteredOrders} 
                            rowKey="id" 
                            className="admin-table-custom"
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                                className: 'cursor-pointer hover:bg-slate-50/50'
                            })}
                            pagination={{
                                pageSize: 10,
                                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} đơn hàng`,
                                className: "px-6 pt-4"
                            }}
                        />
                    </Card>
                </div>
            );
        }

        if (path === '/admin/users') {
            return (
                <Card className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Quản lý Người dùng</span>}>
                    <Table columns={userColumns} dataSource={users} rowKey="id" className="admin-table-custom" />
                </Card>
            );
        }

        if (path === '/admin/reports') {
            // Dynamic KPIs for reports
            const totalRevenue = stats.totalRevenue;
            const totalOrders = allOrders.length;
            const completedOrders = allOrders.filter(o => o.status === 'COMPLETED');
            const totalSold = completedOrders.reduce((sum, order) => {
                return sum + (order.items ? order.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) : 0);
            }, 0);
            const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

            const bestSellers = getBestSellingProducts();

            // Order status statistics calculation
            const pendingCount = allOrders.filter(o => o.status === 'PENDING').length;
            const processingCount = allOrders.filter(o => o.status === 'PROCESSING').length;
            const shippingCount = allOrders.filter(o => o.status === 'SHIPPING').length;
            const completedCount = allOrders.filter(o => o.status === 'COMPLETED').length;
            const cancelledCount = allOrders.filter(o => o.status === 'CANCELLED').length;
            const totalCount = allOrders.length || 1;

            const getPercentage = (count) => Math.round((count / totalCount) * 100);

            return (
                <div className="space-y-8">
                    {/* Top KPI Section */}
                    <Row gutter={[24, 24]}>
                        {[
                            { label: "Tổng doanh thu", value: `${totalRevenue?.toLocaleString()} đ`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Tổng đơn hàng", value: totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Sản phẩm đã bán", value: totalSold > 0 ? totalSold : stats.totalSoldProducts, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { label: "Giá trị đơn trung bình", value: `${Math.round(averageOrderValue)?.toLocaleString()} đ`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" }
                        ].map((stat, i) => (
                            <Col xs={24} sm={12} lg={6} key={i}>
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                                        <stat.icon size={26} />
                                    </div>
                                    <div>
                                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{stat.label}</Text>
                                        <Title level={3} className="m-0 font-black tracking-tight text-slate-800">{stat.value}</Title>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <Row gutter={[24, 24]}>
                        {/* Monthly Breakdown list */}
                        <Col xs={24} lg={12}>
                            <div ref={revenueRef}>
                                <Card className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Doanh thu theo tháng</span>}>
                                    <div className="space-y-5 py-2 px-1">
                                        {Object.entries(stats.monthlyRevenue).map(([month, amount], i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                                    <span className="text-slate-500 font-extrabold">{month}</span>
                                                    <span className="text-slate-800 font-black">{amount.toLocaleString()} đ</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (amount / (stats.totalRevenue || 1)) * 100)}%` }}
                                                        className="bg-green-500 h-full rounded-full"
                                                        transition={{ duration: 0.8 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {Object.keys(stats.monthlyRevenue).length === 0 && <Text className="italic text-slate-400">Chưa có dữ liệu doanh thu</Text>}
                                    </div>
                                </Card>
                            </div>
                        </Col>

                        {/* Order Status Distribution */}
                        <Col xs={24} lg={12}>
                            <Card className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Trạng thái đơn hàng</span>}>
                                <div className="space-y-5 py-2 px-1">
                                    {[
                                        { label: "Hoàn thành", count: completedCount, color: "bg-emerald-500", text: "text-emerald-500" },
                                        { label: "Đang xử lý", count: processingCount, color: "bg-blue-500", text: "text-blue-500" },
                                        { label: "Đang giao", count: shippingCount, color: "bg-purple-500", text: "text-purple-500" },
                                        { label: "Chờ xử lý", count: pendingCount, color: "bg-amber-500", text: "text-amber-500" },
                                        { label: "Đã hủy", count: cancelledCount, color: "bg-red-500", text: "text-red-500" }
                                    ].map((statusItem, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                                <span className="text-slate-500 font-extrabold">{statusItem.label} ({statusItem.count})</span>
                                                <span className={`${statusItem.text} font-black`}>{getPercentage(statusItem.count)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${getPercentage(statusItem.count)}%` }}
                                                    className={`${statusItem.color} h-full rounded-full`}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[24, 24]}>
                        {/* Best Selling Products */}
                        <Col xs={24} lg={12}>
                            <Card className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Sản phẩm bán chạy nhất</span>}>
                                <div className="space-y-4">
                                    {bestSellers.length > 0 ? (
                                        bestSellers.map((item, index) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                                        {index + 1}
                                                    </div>
                                                    <Avatar
                                                        src={getProductImage(item.image)}
                                                        shape="square"
                                                        size={48}
                                                        className="rounded-xl border border-slate-200 shadow-sm shrink-0"
                                                    />
                                                    <div>
                                                        <Text className="font-extrabold text-slate-800 block">{item.name}</Text>
                                                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã bán: {item.quantitySold} sản phẩm</Text>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Text className="font-black text-green-600 block">{item.revenue.toLocaleString()} đ</Text>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Package size={40} className="mx-auto mb-3 opacity-40" />
                                            <Text className="font-bold block uppercase tracking-widest text-xs">Chưa có sản phẩm nào hoàn thành đơn hàng</Text>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>

                        {/* Low Stock Warning Section */}
                        <Col xs={24} lg={12}>
                            <Card className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Danh sách cảnh báo tồn kho</span>}>
                                <div className="space-y-4">
                                    {lowStockProducts.length > 0 ? (
                                        [...lowStockProducts]
                                            .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
                                            .map((p) => {
                                                const isCritical = p.quantity <= 5;
                                                return (
                                                    <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${isCritical ? 'bg-red-50/40 border-red-100 hover:border-red-200' : 'bg-amber-50/40 border-amber-100 hover:border-amber-200'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                src={getProductImage(p.image)}
                                                                shape="square"
                                                                size={42}
                                                                className="rounded-lg border border-slate-100"
                                                            />
                                                            <div>
                                                                <Text className="font-extrabold text-slate-800 block leading-tight">{p.name}</Text>
                                                                <Tag className="rounded-full px-2 py-0.5 font-bold uppercase text-[9px] border-none bg-slate-200 text-slate-600 mt-1">
                                                                    {p.category}
                                                                </Tag>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                                                            <Text className={`font-black text-xs uppercase tracking-widest ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
                                                                {isCritical ? `Nguy cấp: ${p.quantity}` : `Cảnh báo: ${p.quantity}`}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <ShieldCheck size={40} className="mx-auto mb-3 text-green-500" />
                                            <Text className="font-bold block uppercase tracking-widest text-xs">Tất cả sản phẩm đều đủ hàng</Text>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Transactions */}
                    <Card className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Giao dịch gần đây</span>}>
                        <Table
                            columns={orderColumns}
                            dataSource={recentOrders}
                            pagination={false}
                            rowKey="id"
                            className="admin-table-custom"
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                                className: 'cursor-pointer hover:bg-slate-50/50'
                            })}
                        />
                    </Card>
                </div>
            );
        }

        // Default Dashboard View
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Stat Cards */}
                <Row gutter={[24, 24]}>
                    {[
                        { 
                            label: "Tổng đơn hàng", 
                            value: stats.totalOrders, 
                            icon: ShoppingCart, 
                            color: "text-green-600", 
                            bg: "bg-green-50", 
                            suffix: "",
                            onClick: () => navigate('/admin/orders')
                        },
                        { 
                            label: "Doanh thu", 
                            value: stats.totalRevenue, 
                            icon: TrendingUp, 
                            color: "text-blue-600", 
                            bg: "bg-blue-50", 
                            suffix: " đ",
                            onClick: () => navigate('/admin/reports', { state: { scrollToRevenue: true } })
                        },
                        { 
                            label: "Người dùng", 
                            value: stats.totalUsers, 
                            icon: Users, 
                            color: "text-orange-600", 
                            bg: "bg-orange-50", 
                            suffix: "",
                            onClick: navigateToUserManagement
                        },
                        { 
                            label: "Sắp hết hàng", 
                            value: stats.lowStockCount, 
                            icon: Package, 
                            color: "text-red-600", 
                            bg: "bg-red-50", 
                            suffix: "",
                            onClick: () => setIsLowStockDrawerOpen(true)
                        }
                    ].map((stat, i) => (
                        <Col xs={24} sm={12} lg={6} key={i}>
                            <motion.div
                                whileHover={{ y: -6, scale: 1.01 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                onClick={stat.onClick}
                                className="cursor-pointer bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-green-100 transition-all overflow-hidden"
                            >
                                <div className="flex items-center gap-6 p-6">
                                    <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                                        <stat.icon size={30} />
                                    </div>
                                    <div className="flex-1">
                                        <Text className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-1">{stat.label}</Text>
                                        <div className="flex items-end gap-1">
                                            <Title level={3} className="m-0 font-black tracking-tight">{stat.value.toLocaleString()}</Title>
                                            {stat.suffix && <Text className="text-xs font-black text-slate-400 mb-1">{stat.suffix}</Text>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[24, 24]}>
                    {/* Recent Orders Table */}
                    <Col xs={24} lg={16}>
                        <Card
                            className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden"
                            title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Đơn hàng gần đây</span>}
                            extra={<Link to="/admin/orders"><Button type="link" className="font-bold flex items-center gap-2 text-green-600 hover:text-green-700">Xem tất cả <ChevronRight size={16} /></Button></Link>}
                        >
                            <Table
                                columns={orderColumns}
                                dataSource={recentOrders}
                                pagination={false}
                                rowKey="id"
                                className="admin-table-custom"
                                onRow={(record) => ({
                                    onClick: () => handleRowClick(record),
                                    className: 'cursor-pointer hover:bg-slate-50/50'
                                })}
                            />
                        </Card>
                    </Col>

                    {/* Stock Alert Section */}
                    <Col xs={24} lg={8}>
                        <Card
                            className="rounded-3xl border-none shadow-md shadow-slate-100 overflow-hidden h-full"
                            title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Cảnh báo tồn kho</span>}
                            extra={<Link to="/admin/products"><Button type="link" danger className="font-bold flex items-center gap-2">Quản lý <AlertCircle size={16} /></Button></Link>}
                        >
                            <div className="space-y-4">
                                {lowStockProducts.length > 0 ? lowStockProducts.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-colors group">
                                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 flex items-center justify-center p-1">
                                            <img src={getProductImage(p.image)} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black text-slate-800 truncate uppercase">{p.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`w-2 h-2 rounded-full ${p.quantity === 0 ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {p.quantity === 0 ? "Hết hàng" : `Còn ${p.quantity} ${p.unit || "cái"}`}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                                    </div>
                                )) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <ShieldCheck size={40} />
                                        </div>
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Mọi thứ đều ổn!</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Tất cả sản phẩm đều đủ hàng</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </motion.div>
        );
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#22C55E',
                    borderRadius: 16,
                    colorSuccess: '#16A34A',
                    colorWarning: '#F59E0B',
                    colorError: '#EF4444',
                    colorBgLayout: '#F8FAFC'
                },
            }}
        >
            <Layout className="min-h-screen bg-slate-50">
                {/* Sidebar */}
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={280}
                    className="bg-white border-r border-slate-200 sticky top-0 h-screen overflow-hidden"
                    theme="light"
                >
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 shrink-0">
                            <LayoutDashboard size={24} />
                        </div>
                        {!collapsed && <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">ADMIN PANEL</span>}
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        className="border-none px-4 space-y-2"
                    />
                    <div className="absolute bottom-8 left-0 right-0 px-4">
                        <Button
                            type="text"
                            danger
                            icon={<LogOut size={18} />}
                            className="w-full h-12 rounded-xl flex items-center justify-start gap-3 px-4 font-bold"
                            onClick={logout}
                        >
                            {!collapsed && "Đăng xuất"}
                        </Button>
                    </div>
                </Sider>

                <Layout>
                    {/* Header */}
                    <Header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40 h-[100px]">
                        <div className="flex items-center gap-6">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuIcon size={20} /> : <MenuIcon size={20} className="rotate-180" />}
                                onClick={() => setCollapsed(!collapsed)}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50"
                            />
                            <div>
                                <Title level={4} className="mb-0 font-black tracking-tight uppercase">Dashboard Overview</Title>
                                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Chào mừng quay trở lại, {user.username}</Text>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <Space size={24}>
                                <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                    <Search size={16} className="text-slate-400 mr-2" />
                                    <input className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-300" placeholder="Tìm nhanh..." />
                                </div>
                                <Badge count={3} dot color="#22C55E">
                                    <Button shape="circle" icon={<Bell size={20} />} className="border-none bg-slate-50 flex items-center justify-center" />
                                </Badge>
                                <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
                                    <div className="flex items-center gap-3 cursor-pointer group">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1 group-hover:text-green-600 transition-colors">{user.username}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
                                        </div>
                                        <Avatar size={48} className="bg-green-500 text-white font-black shadow-lg shadow-green-100 border-2 border-white ring-1 ring-green-50">
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </div>
                                </Dropdown>
                            </Space>
                        </div>
                    </Header>

                    {/* Content */}
                    <Content className="p-8 bg-slate-50">
                        {loading ? (
                            <div className="h-[60vh] flex items-center justify-center"><Spin size="large" /></div>
                        ) : renderContent()}
                    </Content>
                </Layout>
            </Layout>

            {/* Right Side Order Details Drawer */}
            <Drawer
                title={
                    selectedOrder ? (
                        <div className="flex items-center justify-between w-full pr-6">
                            <div>
                                <span className="text-xl font-black text-slate-800 uppercase tracking-tighter">Chi tiết Đơn hàng #ORD-{selectedOrder.id}</span>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                                    Đặt ngày {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                                </div>
                            </div>
                        </div>
                    ) : null
                }
                placement="right"
                width={650}
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                className="order-drawer"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Order status dropdown */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <span className="font-extrabold text-slate-700 text-sm uppercase tracking-wider">Trạng thái hiện tại:</span>
                            <Select
                                value={selectedOrder.status}
                                onChange={(val) => handleStatusUpdate(selectedOrder.id, val)}
                                className="w-48 font-black"
                                style={{ height: '40px' }}
                            >
                                <Select.Option value="PENDING">Chờ xử lý</Select.Option>
                                <Select.Option value="PROCESSING">Đang xử lý</Select.Option>
                                <Select.Option value="SHIPPING">Đang giao</Select.Option>
                                <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
                                <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                            </Select>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-green-500" />
                                <span className="font-black text-slate-800 text-sm uppercase tracking-wider">Thông tin khách hàng</span>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 shadow-sm text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-400 font-bold uppercase text-xs">Họ và tên:</span>
                                    <span className="col-span-2 font-black text-slate-800">{selectedOrder.customerName}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-400 font-bold uppercase text-xs font-bold">Email tài khoản:</span>
                                    <span className="col-span-2 font-bold text-slate-600">{selectedOrder.user?.email || "Chưa cung cấp"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-400 font-bold uppercase text-xs">Số điện thoại:</span>
                                    <span className="col-span-2 font-bold text-slate-600">{selectedOrder.customerPhone}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-400 font-bold uppercase text-xs">Địa chỉ giao:</span>
                                    <span className="col-span-2 font-semibold text-slate-700 leading-relaxed">{selectedOrder.customerAddress}</span>
                                </div>
                            </div>
                        </div>

                        <Divider className="my-2" />

                        {/* Order Metadata */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-green-500" />
                                <span className="font-black text-slate-800 text-sm uppercase tracking-wider">Thông tin Đơn hàng</span>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 shadow-sm text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-400 font-bold uppercase text-xs">Thanh toán:</span>
                                    <span className="col-span-2 font-extrabold text-slate-800">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-slate-400 font-bold uppercase text-xs">Ghi chú:</span>
                                    <span className="col-span-2 text-slate-600 italic">"{selectedOrder.note || 'Không có ghi chú'}"</span>
                                </div>
                            </div>
                        </div>

                        <Divider className="my-2" />

                        {/* Purchased Products */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Package size={16} className="text-green-500" />
                                <span className="font-black text-slate-800 text-sm uppercase tracking-wider">Sản phẩm đã mua</span>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                <Table
                                    columns={[
                                        {
                                            title: 'Sản phẩm',
                                            key: 'product',
                                            render: (_, item) => (
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={getProductImage(item.product?.image)}
                                                        shape="square"
                                                        size={42}
                                                        className="rounded-lg border border-slate-100"
                                                    />
                                                    <div>
                                                        <Text className="font-extrabold text-slate-800 text-xs block leading-tight">{item.product?.name || "Sản phẩm không tồn tại"}</Text>
                                                        <Text className="text-[10px] text-slate-400 font-bold">x{item.quantity}</Text>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            title: 'Đơn giá',
                                            dataIndex: 'price',
                                            key: 'price',
                                            render: (price) => <Text className="text-xs font-bold text-slate-600">{price?.toLocaleString()} đ</Text>
                                        },
                                        {
                                            title: 'Thành tiền',
                                            key: 'total',
                                            render: (_, item) => <Text className="text-xs font-black text-green-600">{(item.price * item.quantity)?.toLocaleString()} đ</Text>
                                        }
                                    ]}
                                    dataSource={selectedOrder.items || []}
                                    rowKey="id"
                                    pagination={false}
                                    className="admin-table-compact"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-bold uppercase text-xs">Tổng tiền hàng:</span>
                                <span className="font-bold text-slate-700">{selectedOrder.totalAmount?.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-bold uppercase text-xs">Phí vận chuyển:</span>
                                <span className="font-bold text-green-600">Miễn phí</span>
                            </div>
                            <Divider className="my-2 border-slate-200" />
                            <div className="flex justify-between items-center">
                                <span className="text-slate-800 font-black uppercase text-xs">Tổng thanh toán:</span>
                                <span className="text-xl font-black text-green-600">{selectedOrder.totalAmount?.toLocaleString()} đ</span>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Right Side Low Stock Products Drawer */}
            <Drawer
                title={<span className="text-xl font-black text-slate-800 uppercase tracking-tighter">Sản phẩm sắp hết hàng</span>}
                placement="right"
                width={500}
                onClose={() => setIsLowStockDrawerOpen(false)}
                open={isLowStockDrawerOpen}
            >
                <div className="space-y-4">
                    {lowStockProducts.length > 0 ? (
                        [...lowStockProducts]
                            .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
                            .map((p) => {
                                const isCritical = p.quantity <= 5;
                                return (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={getProductImage(p.image)}
                                                shape="square"
                                                size={48}
                                                className="rounded-lg border border-slate-200"
                                            />
                                            <div>
                                                <Text className="font-extrabold text-slate-800 block leading-tight">{p.name}</Text>
                                                <Tag className="rounded-full px-2 py-0.5 font-bold uppercase text-[9px] border-none bg-slate-200 text-slate-600 mt-1">
                                                    {p.category}
                                                </Tag>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <Text className={`font-black text-sm block ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
                                                Tồn kho: {p.quantity}
                                            </Text>
                                            <Tag color={isCritical ? 'red' : 'warning'} className="m-0 text-[9px] font-bold uppercase rounded-full border-none">
                                                {isCritical ? 'Nguy cấp' : 'Cảnh báo'}
                                            </Tag>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <ShieldCheck size={40} className="mx-auto mb-3 text-green-500" />
                            <Text className="font-bold block uppercase tracking-widest text-xs">Tất cả sản phẩm đều đủ hàng</Text>
                        </div>
                    )}
                </div>
            </Drawer>
        </ConfigProvider>
    );
}
