import axios from "axios";
import { API_URL, getImageUrl } from '../config';
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { nativeStorage } from "zmp-sdk/apis";
import nativeStorage from '@/utils/nativeStorage';
import { Page, Box, Text, Header } from "zmp-ui";

type OrderStatus =
    | "pending"
    | "approved"
    | "packed"
    | "shipped"
    | "completed"
    | "cancelled";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface OrderItem {
    product_name: string;
    thumbnail: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    created_at: string;
    total: number;
    status: OrderStatus;
    status_payment: PaymentStatus;
    payment_method: "COD" | "VNPAY" | string;
    items: OrderItem[];
}

const OrderHistory: FC = ({ }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const token = nativeStorage.getItem('access_token');
    useEffect(() => {
        axios.get(`${API_URL}/order-history`, {
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
    }, []);
    const statusLabels: Record<
        OrderStatus,
        { label: string; className: string }
    > = {
        pending: { label: "Khởi tạo", className: "bg-secondary" },
        approved: { label: "Duyệt", className: "bg-info" },
        packed: { label: "Đóng gói", className: "bg-primary" },
        shipped: { label: "Xuất kho", className: "bg-warning" },
        completed: { label: "Hoàn thành", className: "bg-success" },
        cancelled: { label: "Hủy đơn", className: "bg-danger" },
    };

    const paymentStatusLabels: Record<
        PaymentStatus,
        { label: string; className: string }
    > = {
        pending: { label: "Chờ thanh toán", className: "bg-danger" },
        paid: { label: "Đã thanh toán", className: "bg-success" },
        failed: { label: "Thất bại", className: "bg-danger" },
        refunded: { label: "Đã hoàn tiền", className: "bg-primary" },
    };

    const paymentMethodLabels: Record<string, string> = {
        COD: "Thanh toán khi nhận hàng",
        VNPAY: "Chuyển khoản ngân hàng",
    };

    return (
        <Page style={{ padding: '80px 0' }}>
            {/* <Text.Title className="mb-4">Lịch sử đơn hàng</Text.Title> */}
            <Header showBackIcon={true} title="Lịch sử đơn hàng" />

            {orders.length === 0 ? (
                <Text>Bạn chưa có đơn hàng nào.</Text>
            ) : (
                orders.map((order) => {
                    const status = statusLabels[order.status] || {
                        label: "Không xác định",
                        className: "bg-dark",
                    };
                    const paymentStatus =
                        paymentStatusLabels[order.status_payment] || {
                            label: "Không xác định",
                            className: "bg-dark",
                        };
                    return (
                        <Box key={order.id} className="card mb-4">
                            <Box className="card-header d-flex justify-between items-center">
                                <strong>Mã đơn: #{order.id}</strong>
                                <Box className="d-flex items-center gap-2">
                                    {!["completed", "cancelled"].includes(order.status) && (
                                        <div className="dropdown d-inline ms-2">
                                            <button
                                                className="btn btn-sm btn-light dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="fas fa-ellipsis-h"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                {order.payment_method === "VNPAY" &&
                                                    order.status_payment !== "paid" &&
                                                    order.status_payment !== "refunded" && (
                                                        <li>
                                                            <form
                                                                onSubmit={(e) => {
                                                                    e.preventDefault();

                                                                    // Get CSRF token from meta tag
                                                                    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";
                                                                    fetch(`${API_URL}/order/checkout/${order.id}`, {
                                                                        method: "POST",
                                                                        headers: {
                                                                            "Content-Type": "application/json",
                                                                            "X-CSRF-TOKEN": csrfToken,
                                                                        },
                                                                        body: JSON.stringify({
                                                                            id: order.id,
                                                                            total: order.total,
                                                                        }),
                                                                    })
                                                                        .then((res) => res.json())  // Ensure you parse the response as JSON
                                                                        .then((data) => {
                                                                            if (data.success) {
                                                                                // Redirect the user to VNPay payment page
                                                                                window.location.href = data.payment_url;
                                                                            } else {
                                                                                window.location.href = '/';
                                                                                toast.error("Thanh toán thất bại");
                                                                            }
                                                                        })
                                                                        .catch((err) => {
                                                                            toast.error("Có lỗi xảy ra: " + err.message);
                                                                        });
                                                                }}>
                                                                <button type="submit" className="dropdown-item text-primary">
                                                                    <i className="bi bi-x-circle me-1"></i> Thanh toán
                                                                </button>
                                                            </form>
                                                        </li>
                                                    )}

                                                <li>
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            if (confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
                                                                fetch(`${API_URL}/orders/${order.id}/cancel`, {
                                                                    method: "PATCH",
                                                                    headers: {
                                                                        "Content-Type": "application/json",
                                                                        "X-CSRF-TOKEN":
                                                                            (document.querySelector(
                                                                                'meta[name="csrf-token"]'
                                                                            ) as HTMLMetaElement)?.content || "",
                                                                    },
                                                                })
                                                                    .then((res) => {
                                                                        if (!res.ok) toast.error("Hủy đơn hàng thất bại");
                                                                        // return res.json();
                                                                    })
                                                                    .then(() => {
                                                                        toast.success("Đơn hàng đã được hủy");
                                                                        // window.location.reload();
                                                                    })
                                                                    .catch((err) => alert(err.message));
                                                            }
                                                        }}
                                                    >
                                                        <button type="submit" className="dropdown-item text-danger">
                                                            <i className="bi bi-x-circle me-1"></i> Hủy đơn
                                                        </button>
                                                    </form>
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    <span className={`badge ${status.className}`}>
                                        {status.label}
                                    </span>
                                </Box>
                            </Box>
                            <Box className="card-body">
                                <p>
                                    <strong>Ngày đặt:</strong>{" "}
                                    {new Date(order.created_at).toLocaleString("vi-VN")}
                                </p>
                                <p>
                                    <strong>Tổng tiền:</strong>{" "}
                                    {Number(order.total).toLocaleString("vi-VN")}đ
                                </p>
                                <p>
                                    <strong>Phương thức thanh toán:</strong>{" "}
                                    {paymentMethodLabels[order.payment_method] ||
                                        order.payment_method}
                                </p>
                                <p>
                                    <strong>Trạng thái thanh toán:</strong>{" "}
                                    <span className={`badge ${paymentStatus.className}`}>
                                        {paymentStatus.label}
                                    </span>
                                </p>

                                <ul className="list-group">
                                    {order.items.map((item, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item d-flex justify-between items-center"
                                        >
                                            <Box className="d-flex items-center">
                                                <img
                                                    src={`${getImageUrl(item.thumbnail)}`}
                                                    alt={item.product_name}
                                                    width="50"
                                                    className="me-2"
                                                />
                                                <span>
                                                    {item.product_name} (x{item.quantity})
                                                </span>
                                            </Box>
                                            <span>
                                                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </Box>
                    );
                })
            )}
        </Page>
    );
};

export default OrderHistory;
