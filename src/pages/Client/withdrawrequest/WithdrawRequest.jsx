import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config';
import { useNavigate } from "react-router-dom";
import { Header } from 'zmp-ui';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';

const WithdrawRequest = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);

    const token = nativeStorage.getItem('access_token') || localStorage.getItem('access_token');

    const fetchUser = () => {
        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setBalance(res.data?.user?.balance || 0))
            .catch(() => toast.error('Không thể lấy số dư tài khoản'));
    };

    const fetchHistory = () => {
        axios.get(`${API_URL}/withdraw-requests`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setHistory(res.data);
        }).catch(() => toast.error('Không thể tải lịch sử rút tiền'));
    };
    useEffect(() => {
        if (!token) return;
        fetchUser();
        fetchHistory();

    }, [token]);

    const handleSubmit = e => {
        e.preventDefault();

        if (amount < 10000) {
            toast.error('Số tiền tối thiểu là 10.000đ');
            return;
        }

        axios.post(`${API_URL}/withdraw-requests`, { amount, note }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.error) {
                    toast.error('Bạn chưa điền thông tin thẻ thanh toán.');
                }
                toast.success('Đã gửi yêu cầu rút tiền');
                setAmount('');
                setNote('');
                fetchUser();
                fetchHistory();
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Gửi yêu cầu thất bại';
                toast.error(message);
            });
    };

    return (
        <div className="container mt-4" style={{ overflow: "auto", padding: "80px 0" }}>
            <Header showBackIcon={true} title="Rút tiền" />
            <div className="card shadow-sm p-4 rounded-4">
                <h5 className="mb-4 text-center fw-bold">Yêu cầu rút tiền</h5>

                {/* {user && (
                    <div className="mb-3">
                        Xin chào, <strong>{user.name}</strong>
                    </div>
                )} */}

                <div className="alert alert-info">
                    Số dư khả dụng: <strong className="text-success">
                        {Number(balance).toLocaleString()}đ
                    </strong>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Số tiền muốn rút</label>
                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min="10000"
                            max={balance}
                            required
                        />
                        <small className="text-muted">Tối thiểu 10.000đ</small>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ghi chú (tuỳ chọn)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-pill">
                        Gửi yêu cầu rút
                    </button>
                </form>
            </div>
            <div className="card shadow-sm p-4 rounded-4 mt-3">
                <h5 className="mb-3 fw-bold">Lịch sử rút tiền</h5>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Số tiền</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((item, index) => (
                                <tr key={index}>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>{Number(item.amount).toLocaleString()}đ</td>
                                    <td>{item.note || '-'}</td>
                                    <td>
                                        <span className={`badge text-bg-${item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'success' : 'secondary'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">Chưa có yêu cầu nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WithdrawRequest;
