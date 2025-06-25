import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import { Header } from 'zmp-ui';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';

const BankInfoForm = () => {
    const [info_user, setInfo] = useState({
        account_name: '',
        account_number: '',
        bank_name: '',
    });

    const token = nativeStorage.getItem('access_token') || localStorage.getItem('access_token'); // Hoặc nơi bạn lưu access_token

    useEffect(() => {
        axios.get(`${API_URL}/bank-info`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            },
        })
            .then(res => {
                if (res.data) setInfo(res.data);
                console.log(info_user);
                
            })
            .catch(() => toast.error('Không thể tải thông tin tài khoản'));
    }, []);

    const handleChange = e => {
        const updated = { ...info_user, [e.target.name]: e.target.value };
        console.log('handleChange:', updated);
        setInfo(updated);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await new Promise(resolve => setTimeout(resolve, 50)); // delay nhẹ 50ms

        console.log('Submitting:', info_user);

        axios.post(`${API_URL}/bank-account`, info_user, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => toast.success('Cập nhật thành công'))
            .catch(err => {
                console.error('Submit error:', err.response?.data || err);
                toast.error('Lỗi khi cập nhật');
            });
    };

    return (
        <div className="container mt-4" style={{ overflow: 'auto', paddingBottom: '80px', paddingTop: '80px' }}>
            <Header title="Thông tin tài khoản nhận hoa hồng" showBackIcon={true} />
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm rounded-4">
                <div className="mb-3">
                    <label className="form-label">Tên tài khoản</label>
                    <input type="text" className="form-control" name="account_name" value={info_user.account_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Số tài khoản</label>
                    <input type="text" className="form-control" name="account_number" value={info_user.account_number} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ngân hàng</label>
                    <input type="text" className="form-control" name="bank_name" value={info_user.bank_name} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary rounded-pill w-100">Lưu thông tin</button>
            </form>
        </div>
    );
};

export default BankInfoForm;
