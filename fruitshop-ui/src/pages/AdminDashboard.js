import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link, useLocation } from "react-router-dom";
import adminService from "../api/adminService";
import { toast } from "react-toastify";
import {
    Layout,
    Menu,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Badge,
    Avatar,
    Dropdown,
    Space,
    Typography,
    ConfigProvider,
    Spin,
    Select
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
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const path = location.pathname;

                if (path === '/admin/dashboard' || path === '/admin/reports') {
                    const [statsRes, ordersRes, stockRes] = await Promise.all([
                        adminService.getDashboardStats(),
                        adminService.getRecentOrders(),
                        adminService.getLowStockProducts()
                    ]);
                    if (statsRes.data.success) setStats(statsRes.data.data);
                    if (ordersRes.data.success) setRecentOrders(ordersRes.data.data);
                    if (stockRes.data.success) setLowStockProducts(stockRes.data.data);
                }

                if (path === '/admin/orders') {
                    const ordersRes = await adminService.getOrders();
                    if (ordersRes.data.success) setAllOrders(ordersRes.data.data);
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
            render: (name) => <Text className="font-bold text-slate-600">{name}</Text>
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <Text className="font-black text-primary-600">{amount.toLocaleString()} đ</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = { PENDING: 'orange', COMPLETED: 'green', CANCELLED: 'red', PROCESSING: 'blue' };
                const labels = { PENDING: 'Chờ xử lý', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy', PROCESSING: 'Đang xử lý' };
                return <Tag color={colors[status]} className="rounded-full px-3 py-0.5 font-bold uppercase text-[10px]">{labels[status] || status}</Tag>;
            }
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => <Text className="text-slate-400">{new Date(date).toLocaleDateString("vi-VN")}</Text>
        }
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
                setAllOrders(allOrders.map(o => o.id === id ? res.data.data : o));
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const userColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Username', dataIndex: 'username', key: 'username', render: (text) => <Text className="font-bold">{text}</Text> },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role', render: (role) => <Tag color="blue">{role?.name || "USER"}</Tag> },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
    ];

    const fullOrderColumns = [
        ...orderColumns,
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Select
                    defaultValue={record.status}
                    onChange={(val) => handleStatusUpdate(record.id, val)}
                    className="w-32"
                >
                    <Select.Option value="PENDING">Chờ xử lý</Select.Option>
                    <Select.Option value="PROCESSING">Đang xử lý</Select.Option>
                    <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
                    <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                </Select>
            )
        }
    ];

    const renderContent = () => {
        const path = location.pathname;

        if (path === '/admin/orders') {
            return (
                <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Quản lý Đơn hàng</span>}>
                    <Table columns={fullOrderColumns} dataSource={allOrders} rowKey="id" className="admin-table-custom" />
                </Card>
            );
        }

        if (path === '/admin/users') {
            return (
                <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Quản lý Người dùng</span>}>
                    <Table columns={userColumns} dataSource={users} rowKey="id" className="admin-table-custom" />
                </Card>
            );
        }

        if (path === '/admin/reports') {
            return (
                <div className="space-y-8">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={12}>
                            <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Doanh thu theo tháng</span>}>
                                <div className="space-y-4 py-4">
                                    {Object.entries(stats.monthlyRevenue).map(([month, amount], i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                                <span>{month}</span>
                                                <span className="text-slate-800">{amount.toLocaleString()} đ</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (amount / (stats.totalRevenue || 1)) * 100)}%` }}
                                                    className="bg-primary-500 h-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(stats.monthlyRevenue).length === 0 && <Text className="italic text-slate-400">Chưa có dữ liệu doanh thu</Text>}
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Thống kê bổ sung</span>}>
                                <div className="grid grid-cols-1 gap-6 p-4">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <Text className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-1">Tổng sản phẩm đã bán</Text>
                                        <Title level={2} className="m-0 font-black tracking-tight text-primary-600">{stats.totalSoldProducts.toLocaleString()}</Title>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <Text className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-1">Đơn hàng mới trong tháng</Text>
                                        <Title level={2} className="m-0 font-black tracking-tight text-blue-600">{recentOrders.length}</Title>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden" title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Giao dịch gần đây</span>}>
                        <Table
                            columns={orderColumns}
                            dataSource={recentOrders}
                            pagination={false}
                            rowKey="id"
                            className="admin-table-custom"
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
                        { label: "Tổng đơn hàng", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50", suffix: "" },
                        { label: "Doanh thu", value: stats.totalRevenue, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", suffix: " đ" },
                        { label: "Người dùng", value: stats.totalUsers, icon: Users, color: "text-orange-600", bg: "bg-orange-50", suffix: "" },
                        { label: "Sắp hết hàng", value: stats.lowStockCount, icon: Package, color: "text-red-600", bg: "bg-red-50", suffix: "" }
                    ].map((stat, i) => (
                        <Col xs={24} sm={12} lg={6} key={i}>
                            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
                                <div className="flex items-center gap-6 p-2">
                                    <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <Text className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-1">{stat.label}</Text>
                                        <div className="flex items-end gap-1">
                                            <Title level={3} className="m-0 font-black tracking-tight">{stat.value.toLocaleString()}</Title>
                                            {stat.suffix && <Text className="text-xs font-black text-slate-400 mb-1">{stat.suffix}</Text>}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[24, 24]}>
                    {/* Recent Orders Table */}
                    <Col xs={24} lg={16}>
                        <Card
                            className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden"
                            title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Đơn hàng gần đây</span>}
                            extra={<Link to="/admin/orders"><Button type="link" className="font-bold flex items-center gap-2">Xem tất cả <ChevronRight size={16} /></Button></Link>}
                        >
                            <Table
                                columns={orderColumns}
                                dataSource={recentOrders}
                                pagination={false}
                                rowKey="id"
                                className="admin-table-custom"
                            />
                        </Card>
                    </Col>

                    {/* Stock Alert Section */}
                    <Col xs={24} lg={8}>
                        <Card
                            className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden h-full"
                            title={<span className="text-lg font-black text-slate-800 uppercase tracking-tight">Cảnh báo tồn kho</span>}
                            extra={<Link to="/admin/products"><Button type="link" danger className="font-bold flex items-center gap-2">Quản lý <AlertCircle size={16} /></Button></Link>}
                        >
                            <div className="space-y-4">
                                {lowStockProducts.length > 0 ? lowStockProducts.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-colors group">
                                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm">
                                            <img src={p.image} className="w-full h-full object-cover" alt="" />
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
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
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
                    colorPrimary: '#3eb63a',
                    borderRadius: 16,
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
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 shrink-0">
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
                                <Badge count={3} dot color="#3eb63a">
                                    <Button shape="circle" icon={<Bell size={20} />} className="border-none bg-slate-50 flex items-center justify-center" />
                                </Badge>
                                <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
                                    <div className="flex items-center gap-3 cursor-pointer group">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1 group-hover:text-primary-600 transition-colors">{user.username}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
                                        </div>
                                        <Avatar size={48} className="bg-primary-600 text-white font-black shadow-lg shadow-primary-100 border-2 border-white ring-1 ring-primary-50">
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </div>
                                </Dropdown>
                            </Space>
                        </div>
                    </Header>

                    {/* Content */}
                    <Content className="p-8">
                        {loading ? (
                            <div className="h-[60vh] flex items-center justify-center"><Spin size="large" /></div>
                        ) : renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
