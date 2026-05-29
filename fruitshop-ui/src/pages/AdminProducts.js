import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
    Layout,
    Menu,
    Button,
    Card,
    Table,
    Tag,
    Avatar,
    Space,
    Typography,
    ConfigProvider,
    Input,
    Modal,
    Form,
    InputNumber,
    Select,
    Upload,
    Tooltip,
    Popconfirm
} from 'antd';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Menu as MenuIcon, Plus, Search, Edit3, Trash2, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from "../api/adminService";
import { getProductImage } from "../utils/imageUtils";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = [
    { value: "fruit", label: "Trái cây & hạt" },
    { value: "vegetable", label: "Rau củ" },
    { value: "meat", label: "Thịt hữu cơ" },
    { value: "organic", label: "Bơ & Trứng" },
    { value: "dairy", label: "Sữa & Kem" },
];

export default function AdminProducts() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProducts();
    }, []);

    if (!user || user.role !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/products");
            if (res.data.success) setProducts(res.data.data);
        } catch {
            toast.error("Không thể tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values) => {
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/admin/products/${editingId}`, values);
                toast.success("Đã cập nhật sản phẩm");
            } else {
                await api.post("/admin/products", values);
                toast.success("Đã thêm sản phẩm mới");
            }
            setIsModalOpen(false);
            setEditingId(null);
            form.resetFields();
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success("Đã xóa sản phẩm");
            fetchProducts();
        } catch {
            toast.error("Xóa thất bại");
        }
    };

    const openEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (text, record) => (
                <Space size={16}>
                    <Avatar
                        src={getProductImage(record.image)}
                        shape="square"
                        size={64}
                        icon={<ImageIcon size={20} />}
                        className="rounded-xl border border-slate-100 shadow-sm"
                    />
                    <div>
                        <Text className="font-black text-slate-800 uppercase tracking-tight block">{record.name}</Text>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">ID: #PROD-{record.id}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <Tag color="blue" className="rounded-full px-4 py-1 font-bold uppercase text-[10px] border-none bg-blue-50 text-blue-600">
                    {CATEGORIES.find(c => c.value === category)?.label || category}
                </Tag>
            )
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <Text className="font-black text-primary-600">{price?.toLocaleString()} đ</Text>
        },
        {
            title: 'Tồn kho',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty) => {
                const color = qty <= 0 ? 'red' : qty <= 10 ? 'orange' : 'green';
                const bg = qty <= 0 ? 'bg-red-50' : qty <= 10 ? 'bg-orange-50' : 'bg-green-50';
                const text = qty <= 0 ? 'text-red-600' : qty <= 10 ? 'text-orange-600' : 'text-green-600';
                return (
                    <div className={`px-4 py-1.5 rounded-xl ${bg} ${text} inline-flex items-center gap-2 border border-current/10`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${qty <= 0 ? 'bg-red-500 animate-pulse' : text.replace('text-', 'bg-')}`} />
                        <span className="font-black text-xs">{qty}</span>
                    </div>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (text, record) => (
                <Space size={12}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<Edit3 size={16} />}
                            className="bg-slate-50 border-none hover:bg-primary-50 hover:text-primary-600 rounded-xl w-10 h-10 flex items-center justify-center"
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa sản phẩm này?"
                        description="Hành động này không thể hoàn tác."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa ngay"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true, className: 'rounded-lg' }}
                        cancelButtonProps={{ className: 'rounded-lg' }}
                    >
                        <Button
                            danger
                            icon={<Trash2 size={16} />}
                            className="bg-red-50 border-none hover:bg-red-100 rounded-xl w-10 h-10 flex items-center justify-center"
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const menuItems = [
        { key: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: <Link to="/admin/dashboard">Dashboard</Link> },
        { key: '/admin/products', icon: <Package size={18} />, label: <Link to="/admin/products">Sản phẩm</Link> },
        { key: '/admin/orders', icon: <ShoppingCart size={18} />, label: <Link to="/admin/orders">Đơn hàng</Link> },
        { key: '/admin/users', icon: <Users size={18} />, label: <Link to="/admin/users">Người dùng</Link> },
        { key: '/admin/reports', icon: <BarChart3 size={18} />, label: <Link to="/admin/reports">Báo cáo</Link> },
        { type: 'divider' },
        { key: '/admin/settings', icon: <Settings size={18} />, label: <Link to="/admin/settings">Cài đặt</Link> },
    ];

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#3eb63a', borderRadius: 16 } }}>
            <Layout className="min-h-screen bg-slate-50">
                <Sider trigger={null} collapsible collapsed={collapsed} width={280} className="bg-white border-r border-slate-200 sticky top-0 h-screen" theme="light">
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 shrink-0">
                            <Package size={24} />
                        </div>
                        {!collapsed && <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">ADMIN PANEL</span>}
                    </div>
                    <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} className="border-none px-4 space-y-2" />
                </Sider>

                <Layout>
                    <Header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40 h-[100px]">
                        <div className="flex items-center gap-6">
                            <Button type="text" icon={collapsed ? <MenuIcon size={20} /> : <MenuIcon size={20} className="rotate-180" />} onClick={() => setCollapsed(!collapsed)} className="w-12 h-12 bg-slate-50 rounded-xl" />
                            <div>
                                <Title level={4} className="mb-0 font-black tracking-tight uppercase">Quản lý sản phẩm</Title>
                                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">{products.length} sản phẩm trong kho</Text>
                            </div>
                        </div>
                        <Space size={16}>
                            <Input
                                prefix={<Search size={16} className="text-slate-300 mr-2" />}
                                placeholder="Tìm sản phẩm..."
                                className="w-64 h-12 rounded-xl bg-slate-50 border-none"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<Plus size={18} />}
                                className="h-12 px-6 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-primary-100"
                                onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
                            >
                                THÊM SẢN PHẨM
                            </Button>
                        </Space>
                    </Header>

                    <Content className="p-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 overflow-hidden">
                                <Table
                                    columns={columns}
                                    dataSource={filtered}
                                    loading={loading}
                                    rowKey="id"
                                    pagination={{ pageSize: 8, className: "px-8" }}
                                />
                            </Card>
                        </motion.div>
                    </Content>
                </Layout>

                {/* Edit/Add Modal */}
                <Modal
                    title={<span className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</span>}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    width={800}
                    className="admin-modal-custom"
                    centered
                >
                    <Form form={form} layout="vertical" onFinish={handleSave} className="mt-8 space-y-6" requiredMark={false}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Form.Item label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ảnh sản phẩm</span>}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <Form.Item name="image" noStyle>
                                            <Input placeholder="URL ảnh hoặc tải lên..." className="h-12 rounded-xl flex-1" />
                                        </Form.Item>
                                        <Upload
                                            name="file"
                                            action={`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/products/upload-image`}
                                            headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                                            showUploadList={false}
                                            onChange={(info) => {
                                                if (info.file.status === 'uploading') return;
                                                if (info.file.status === 'done') {
                                                    form.setFieldsValue({ image: info.file.response.data });
                                                    toast.success("Tải ảnh lên thành công");
                                                } else if (info.file.status === 'error') {
                                                    toast.error("Tải ảnh thất bại");
                                                }
                                            }}
                                        >
                                            <Button type="button" icon={<UploadCloud size={18} />} className="h-12 px-6 rounded-xl font-bold flex items-center gap-2">
                                                TẢI LÊN
                                            </Button>
                                        </Upload>
                                    </div>
                                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.image !== curr.image}>
                                        {({ getFieldValue }) => {
                                            const image = getFieldValue('image');
                                            return image ? (
                                                <div className="mt-2 relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner">
                                                    <img
                                                        src={getProductImage(image)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => form.setFieldsValue({ image: '' })}
                                                        className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full text-red-500 hover:text-red-600 transition-colors shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : null;
                                        }}
                                    </Form.Item>
                                </div>
                            </Form.Item>
                            <Form.Item name="category" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Danh mục</span>} rules={[{ required: true }]}>
                                <Select className="h-12 w-full custom-select" placeholder="Chọn danh mục">
                                    {CATEGORIES.map(c => <Option key={c.value} value={c.value}>{c.label}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item name="name" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tên sản phẩm</span>} rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                            <Input placeholder="VD: Táo Fuji hữu cơ" className="h-12 rounded-xl" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Form.Item name="price" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Giá bán (đ)</span>} rules={[{ required: true }]}>
                                <InputNumber className="w-full h-12 flex items-center rounded-xl" min={0} />
                            </Form.Item>
                            <Form.Item name="quantity" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Số lượng tồn kho</span>} rules={[{ required: true }]}>
                                <InputNumber className="w-full h-12 flex items-center rounded-xl" min={0} />
                            </Form.Item>
                        </div>

                        <Form.Item name="description" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Mô tả sản phẩm</span>}>
                            <TextArea rows={4} className="rounded-2xl p-4" placeholder="Nhập mô tả sản phẩm..." />
                        </Form.Item>

                        <div className="flex justify-end gap-4 pt-6">
                            <Button size="large" className="h-12 px-8 rounded-xl font-bold" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" size="large" htmlType="submit" loading={saving} className="h-12 px-10 rounded-xl font-black tracking-widest shadow-lg shadow-primary-200">
                                {editingId ? "CẬP NHẬT" : "THÊM NGAY"}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </Layout>
        </ConfigProvider>
    );
}
