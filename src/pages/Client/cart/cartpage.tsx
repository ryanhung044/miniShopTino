import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header, Page } from "zmp-ui";
import { API_URL, getImageUrl }  from '../config';
import { toast } from 'react-toastify';
import CryptoJS from "crypto-js";
// import { nativeStorage, Payment } from "zmp-sdk/apis";
// import { Payment } from "zmp-sdk/apis";
import zmp, { Payment } from "zmp-sdk";
import { number } from 'prop-types';
import nativeStorage from '@/utils/nativeStorage';
interface Province {
    name: string;
    code: number;
    districts: any;
}

interface District {
    name: string;
    code: number;
    wards: any;
}

interface Ward {
    name: string;
    code: number;
}

const CartPage2 = () => {
    const [carts, setCarts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [level, setLevel] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState("");
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const oldUser = nativeStorage.getItem('oldUser') || localStorage.getItem('oldUser');
    const token = nativeStorage.getItem('access_token') || localStorage.getItem('access_token');
    const validatePhone = (value: string) => {
        // Regex cho số điện thoại Việt Nam, bắt đầu bằng 0, có 10 chữ số
        const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
        return phoneRegex.test(value);
    };
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);

        if (!validatePhone(value)) {
            setPhoneError("Số điện thoại không hợp lệ");
        } else {
            setPhoneError("");
        }
    };

    const navigate = useNavigate();  // Dùng useNavigate thay vì useHistory
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=3')
            .then(res => {
                setProvinces(res.data);
            });
    }, []);
    useEffect(() => {
        if (selectedProvince) {
            const province = provinces.find((p: any) => p.name === selectedProvince);
            setDistricts(province?.districts || []);
            setSelectedDistrict('');
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const district = districts.find((d: any) => d.name === selectedDistrict);
            setWards(district?.wards || []);
            setSelectedWard('');
        }
    }, [selectedDistrict]);
    useEffect(() => {
        if (selectedWard && selectedDistrict && selectedProvince) {
            setAddress(`${houseNumber}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`);
            console.log(address);

        }
    }, [houseNumber, selectedWard, selectedDistrict, selectedProvince]);

    const resetCart = async () => {
        console.log("resetCart called");

        try {
            const savedCart = nativeStorage.getItem('cart') || localStorage.getItem('cart');
            console.log("savedCart:", savedCart);

            if (savedCart) {
                let parsedCart = JSON.parse(savedCart);
                const refreshRes = await axios.post(`${API_URL}/cart/refresh`, { cart: parsedCart });
                let updatedCart = refreshRes.data;

                // let updatedCart = [...parsedCart];

                // Gọi API để lấy thông tin người dùng
                const userRes = await axios.get(`${API_URL}/checkUser`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = userRes.data;
                const level = userData.level;
                const hasHighValueCombo = userData.hasHighValueCombo;

                console.log("User data:", userData);

                // Hàm tính hệ số giảm giá theo cấp bậc
                const getDiscountByLevel = (level: number) => {
                    if (level >= 3) return 0.60; // F1
                    if (level === 2) return 0.65; // F2
                    if (level === 1) return 0.70; // F3
                    if (level === 0) return 0.80; // F4
                    return 1;
                };

                // Logic áp dụng giảm giá
                if (!hasHighValueCombo) {
                    updatedCart = updatedCart.map((item: any) => {
                        if (item.category_id != 2) {
                            return {
                                ...item,
                                discounted: true,
                                originalPrice: Number(item.price),
                                price: item.price * 0.90 // Giảm 10% cho lần đầu
                            };
                        }
                        return item;
                    });
                } else if (hasHighValueCombo && level >= 0) {
                    const discountFactor = getDiscountByLevel(level);
                    updatedCart = updatedCart.map((item: any) => {
                        if (item.category_id != 2) {
                            return {
                                ...item,
                                discounted: true,
                                originalPrice: Number(item.price),
                                price: item.price * discountFactor
                            };
                        }
                        return item;
                    });
                }

                // Cập nhật state giỏ hàng
                setCarts(updatedCart);
                const totalPrice = updatedCart.reduce(
                    (acc: number, item: any) => acc + item.price * item.quantity, 0
                );
                setTotal(totalPrice);
            }

            // Luôn dispatch sự kiện, kể cả khi không có cart
            console.log("Dispatching cart-updated");
            window.dispatchEvent(new Event("cart-updated"));

        } catch (error) {
            console.error("Lỗi trong resetCart:", error);
        }
    };


    useEffect(() => {
        resetCart();
        fetchUser();
    }, []);

    const fetchUser = () => {
        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                console.log(res.data);
                setLevel(res.data.level)
                setPhone(res.data.user?.phone || '')
                setName(res.data.user?.full_name || '')
            }

            )
            .catch(() => toast.error('Không thể lấy số dư tài khoản'));
    };

    const handleRemove = (productId: number) => {

        const savedCart = nativeStorage.getItem('cart');
        if (!savedCart) return;

        const cart = JSON.parse(savedCart).filter((item: any) => item.id !== productId);
        console.log(cart);

        nativeStorage.setItem('cart', JSON.stringify(cart));
        setCarts(cart);
        // window.dispatchEvent(new Event("cart-updated"));
        const totalPrice = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
        setTotal(totalPrice);
        resetCart();
    };

    const handleIncrease = async (productId: number) => {
        const savedCart = nativeStorage.getItem('cart');
        if (!savedCart) return;

        const cart = JSON.parse(savedCart);
        const item = cart.find((item: any) => item.id === productId);
        if (!item) return;

        try {
            const res = await axios.get(`${API_URL}/check-product/${productId}`);
            const stock = res.data.stock;

            if (item.quantity >= stock) {
                toast.error("Không đủ hàng trong kho!");
                return;
            }

            const updatedCart = cart.map((i: any) => {
                if (i.id === productId) {
                    return { ...i, quantity: i.quantity + 1 };
                }
                return i;
            });

            nativeStorage.setItem('cart', JSON.stringify(updatedCart));
            setCarts(updatedCart);
            // window.dispatchEvent(new Event("cart-updated"));
            const totalPrice = updatedCart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
            setTotal(totalPrice);
            resetCart();

        } catch (err) {
            toast.error("Lỗi kiểm tra tồn kho!");
        }
    };


    const handleDecrease = (productId: number) => {
        const savedCart = nativeStorage.getItem('cart');
        if (!savedCart) return;

        // Lấy giỏ hàng từ LocalStorage
        let cart = JSON.parse(savedCart);
        console.log('Giỏ hàng trước khi giảm:', cart);

        // Tìm và giảm số lượng sản phẩm trong giỏ
        const updatedCart = cart.map((item: any) => {
            if (item.id === productId) {
                console.log(`Giảm số lượng sản phẩm: ${item.name}`);
                return { ...item, quantity: item.quantity - 1 }; // Giảm số lượng sản phẩm
            }
            return item;
        });

        // Lọc giỏ hàng để xóa sản phẩm có số lượng = 0
        const filteredCart = updatedCart.filter((item: any) => item.quantity > 0);
        console.log('Giỏ hàng sau khi lọc:', filteredCart);
        // Cập nhật giỏ hàng vào LocalStorage
        nativeStorage.setItem('cart', JSON.stringify(filteredCart));
        // window.dispatchEvent(new Event("cart-updated"));
        // Cập nhật giỏ hàng trong state
        setCarts(filteredCart);
        // Tính lại tổng giá trị giỏ hàng
        const totalPrice = filteredCart.reduce((acc: number, item: any) => acc + parseFloat(item.price) * item.quantity, 0);
        setTotal(totalPrice);
        resetCart();
    };
    const handleSubmitOrder = async (e: any) => {
        e.preventDefault();

        const savedCart = nativeStorage.getItem('cart');
        if (!savedCart) return;
        let cart = JSON.parse(savedCart);

        try {
            Payment.selectPaymentMethod({
                channels: [
                    // {
                    //     method: "COD",
                    //     subMethod: "bank1",
                    //     subInfo: "Thanh toán khi nhận hàng",
                    // },
                    {
                        method: "BANK",
                        subMethod: "bank2",
                        subInfo: "Chuyển khoản ngân hàng",
                    },
                    {
                        method: "VNPAY",
                        subMethod: "bank3",
                        subInfo: "Phương thức thanh toán VNPay",
                    },
                ],
                success: async (paymentData) => {
                    const { method, subMethod, isCustom = false } = paymentData;
                    const referrerId = nativeStorage.getItem('referrer_id');
                    const token = nativeStorage.getItem("access_token");
                    const response = await axios.post(`${API_URL}/order/place`, {
                        name,
                        phone,
                        address,
                        // payment_method: 'COD', // Lưu method ZALOPAY / MOMO / BANK_SANDBOX
                        payment_method: method, // Lưu method ZALOPAY / MOMO / BANK_SANDBOX
                        // sub_method: subMethod || null, // Lưu nếu có
                        cart,
                        referrer_id: referrerId,
                        oldUser: oldUser,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });
                    nativeStorage.setItem('oldUser', 'true');
                    const data = response.data;
                    const orderId = data.order_id;
                    createOrder(cart, method, isCustom, orderId, subMethod);

                    toast.success('Đặt hàng thành công');
                    nativeStorage.removeItem('cart');
                    resetCart();
                    navigate('/');
                },

                fail: (err) => {
                    toast.error("Có lỗi xảy ra.");
                    console.error("Lỗi chọn phương thức thanh toán", err);
                },
            });
        } catch (err) {
            toast.error('Có lỗi xảy ra khi đặt hàng');
            console.error(err);
        }
    };

    const createOrder = (cart: any[], method: string, isCustom: boolean, orderId?: number, subMethod?: string) => {
        const transactionId = `ORDER_${orderId}`;
        const params = {
            desc: `Thanh toán ${total.toLocaleString()}đ`,
            item: cart.map(item => ({
                id: item.id.toString(),
                amount: item.price * item.quantity,
            })),
            amount: total,
            extradata: JSON.stringify({
                storeName: "Cửa hàng A",
                storeId: "123",
                orderGroupId: "345",
                myTransactionId: transactionId, // random ID
                notes: "Ghi chú đơn hàng",
            }),
            method: JSON.stringify({
                id: method,
                subMethod: subMethod || null,
                isCustom,
            }),
        };

        const privateKey = "ec592cfd05a814637f63a05004c459d9";
        const mac = generateMac(params, privateKey);

        Payment.createOrder({
            ...params,
            mac,
            success: (data) => {
                // navigate('/result', {
                // state: {
                //     transactionId,
                //     // path: data.data,
                //     // },
                // });

                console.log("✅ Order created:", data.orderId);
            },
            fail: (err) => {
                console.error("❌ Order failed:", err);
            },
        });
    };



    // Hàm tạo MAC HMAC-SHA256
    const generateMac = (params: any, privateKey: string) => {
        // Sắp xếp keys tăng dần
        const sortedKeys = Object.keys(params).sort();

        // Tạo chuỗi dataMac: key1=value1&key2=value2...
        const dataMac = sortedKeys
            .map((key) => {
                const value = typeof params[key] === "object"
                    ? JSON.stringify(params[key])
                    : params[key];
                return `${key}=${value}`;
            })
            .join("&");

        // Tạo MAC bằng HmacSHA256
        const mac = CryptoJS.HmacSHA256(dataMac, privateKey).toString();
        return mac;
    };


    return (

        <div className="container mt-4 px-3" style={{ overflow: 'auto', paddingBottom: '80px' }}>
            <Header title="Giỏ hàng" showBackIcon={true} />
            <h5 className="fw-bold mb-3">Giỏ hàng của bạn</h5>
            {carts && carts.length === 0 ? (
                <div className="text-center py-5">
                    <h5 className="mb-3">Giỏ hàng của bạn đang trống</h5>
                    <button onClick={() => navigate('/all-products')} className="btn btn-primary">Mua sắm ngay</button>
                </div>
            ) : (
                <div>
                    {carts.map((item) => (
                        <div key={item.id} className="cart-item d-flex gap-3 mb-3 bg-white p-3 rounded-3 shadow-sm">
                            <img src={getImageUrl(item.image)} className="rounded-2" alt="SP" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            <div className="flex-grow-1">
                                <div className="fw-semibold">{item.name}</div>
                                {item.discounted ? (
                                    <>
                                        <div style={{ textDecoration: 'line-through', color: 'gray' }}>{Number(item.originalPrice).toLocaleString()}đ</div>

                                        <div className="text-danger fw-bold">{Number(item.price).toLocaleString()}đ</div>
                                    </>
                                ) : (
                                    <div className="text-danger fw-bold">{Number(item.price).toLocaleString()}đ</div>

                                )}

                                <div className="d-flex align-items-center mt-2">
                                    <button onClick={() => handleDecrease(item.id)} className="btn btn-outline-secondary btn-sm">-</button>
                                    <input type="text" className="form-control form-control-sm mx-2 text-center" style={{ width: '50px' }} value={item.quantity} readOnly />
                                    <button onClick={() => handleIncrease(item.id)} className="btn btn-outline-secondary btn-sm">+</button>
                                </div>
                            </div>
                            <div className="text-end">
                                <button onClick={() => handleRemove(item.id)} className="btn btn-link btn-danger">
                                    <i className="fa fa-trash text-danger"></i>
                                </button>
                            </div>
                        </div>
                    ))}

                    <form onSubmit={handleSubmitOrder}>
                        <div className="bg-white p-3 rounded-3 shadow-sm mb-3">
                            <h6 className="fw-bold mb-2">Thông tin nhận hàng</h6>
                            <div className="mb-2">
                                <label className="form-label">Họ và tên</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập họ và tên" required />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className={`form-control ${phoneError ? "is-invalid" : ""}`}
                                    value={phone} onChange={handlePhoneChange}
                                    placeholder="Nhập số điện thoại" required />
                                {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Tỉnh/Thành phố</label>
                                <select className="form-select" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} required>
                                    <option value="">-- Chọn tỉnh/thành --</option>
                                    {provinces.map((p: any) => (
                                        <option key={p.code} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Quận/Huyện</label>
                                <select className="form-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} required>
                                    <option value="">-- Chọn quận/huyện --</option>
                                    {districts.map((d: any) => (
                                        <option key={d.code} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Phường/Xã</label>
                                <select className="form-select" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} required>
                                    <option value="">-- Chọn phường/xã --</option>
                                    {wards.map((w: any) => (
                                        <option key={w.code} value={w.name}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Địa chỉ nhận hàng</label>
                                <input type="text" className="form-control" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} placeholder="Số nhà" required />
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded-3 shadow-sm mb-3 hidden">
                            <h6 className="fw-bold mb-2">Phương thức thanh toán</h6>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="payment_method" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                <label className="form-check-label">Thanh toán khi nhận hàng (COD)</label>
                            </div>
                            {/* <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="payment_method" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} />
                                <label className="form-check-label">Chuyển khoản ngân hàng</label>
                            </div> */}
                        </div>

                        <div className="d-flex justify-content-between mt-4 mb-3">
                            <div className="fw-bold">Tổng cộng</div>
                            <div className="fw-bold text-danger">{total.toLocaleString()}đ</div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-semibold">
                            {/* Thanh toán */}
                            Đặt hàng
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CartPage2;
