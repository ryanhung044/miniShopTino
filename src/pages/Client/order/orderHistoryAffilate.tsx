import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import { Header } from 'zmp-ui';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';
type OrderItem = {
    product_name: string;
    quantity: number;
    price: number;
    commission_amount: number;
    thumbnail: string;
};

type Order = {
    id: number;
    name: string;
    status: string;
    created_at: string; // hoặc Date nếu đã parse
    total: number;
    items: OrderItem[];
};

const statusLabels = {
    pending: { label: 'Khởi tạo', class: 'secondary' },
    approved: { label: 'Duyệt', class: 'info' },
    packed: { label: 'Đóng gói', class: 'primary' },
    shipped: { label: 'Xuất kho', class: 'warning' },
    completed: { label: 'Hoàn thành', class: 'success' },
    cancelled: { label: 'Hủy đơn', class: 'danger' },
};

const OrderHistoryAffilate: React.FC = ({ }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const token = nativeStorage.getItem('access_token');
    useEffect(() => {

        axios.get(`${API_URL}/order-history-affilate`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
            .then(response => {
                console.log("Dữ liệu nhận được:", response.data);
                setOrders(response.data.orders);
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
            });
    }, [])

    return (
        <div className="container" style={{ overflow: "auto", paddingTop: '80px' }}>
            <Header title="Lịch sử đơn hàng liên kết" showBackIcon={true} />

            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                orders.map((order) => {
                    const status = statusLabels[order.status] || {
                        label: 'Không xác định',
                        class: 'dark',
                    };

                    return (
                        <div className="card mb-4" key={order.id}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <strong>Mã đơn: #{order.id}</strong>
                                <span className={`badge bg-${status.class} text-uppercase`}>
                                    {status.label}
                                </span>
                            </div>
                            <div className="card-body">
                                <p>
                                    <strong>Họ tên:</strong> {order.name}
                                </p>
                                <p>
                                    <strong>Ngày đặt:</strong>{' '}
                                    {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                                </p>
                                <p>
                                    <strong>Tổng tiền:</strong>{' '}
                                    {order.total.toLocaleString('vi-VN')}đ
                                </p>

                                <ul className="list-group">
                                    {order.items.map((item, idx) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                            key={idx}
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={`${getImageUrl(item.thumbnail)}`}
                                                    alt={item.product_name}
                                                    width="50"
                                                    className="me-2"
                                                />
                                                <span>
                                                    {item.product_name} (x{item.quantity}){' '}
                                                    <p>
                                                        Hoa hồng: {item.commission_amount.toLocaleString('vi-VN')}đ
                                                    </p>
                                                </span>
                                            </div>
                                            <span>
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default OrderHistoryAffilate;
