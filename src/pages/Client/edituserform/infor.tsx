import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';
import { toast } from 'react-toastify';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';

interface User {
    id: number;
    name: string;
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    address: string;
    avatar?: string;
}
interface FormData {
    name: string;
    full_name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    birthday: string;
    address: string;
    avatar: File | null;
}
interface EditUserFormProps {
    user?: User;
}

// const EditUserForm = ({ user }) => {
const EditUserForm: React.FC<EditUserFormProps> = ({ user }) => {
    const navigate = useNavigate();

    // const [formData, setFormData] = useState({
    //     name: user.name || '',
    //     full_name: user.full_name || '',
    //     email: user.email || '',
    //     password: '',
    //     phone: user.phone || '',
    //     gender: user.gender || '',
    //     birthday: user.birthday || '',
    //     address: user.address || '',
    //     avatar: null,
    // });
    const [formData, setFormData] = useState<FormData>({
        name: user?.name ||'',
        full_name: user?.full_name ||'',
        email: user?.email || '',
        password: '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        birthday: user?.birthday || '',
        address: user?.address || '',
        avatar: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            setFormData({ ...formData, avatar: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log(formData);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'avatar' && value instanceof File) {
                submitData.append('avatar', value); // file cụ thể
            } else if (value !== '' && value !== null) {
                submitData.append(key, value);
            }
        });


        try {
            const token = nativeStorage.getItem("access_token");
            await axios.post(`${API_URL}/users/${user?.id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Bắt buộc nếu bạn xác thực theo token
                    'X-HTTP-Method-Override': 'PUT',
                },
            });

            toast.success('Cập nhật thành công!');
            navigate('/');
        } catch (error) {
            console.error('Update failed', error);
            toast.error('Có lỗi xảy ra!');
        }
    };

    return (
        <div className="container" style={{ overflow: 'auto' }}>
            <div className="card shadow-sm p-4 rounded-4 mt-4">
                <h5 className="mb-4 text-center fw-bold">
                    <i className="fas fa-user-edit me-2 text-primary"></i>Chỉnh sửa thông tin
                </h5>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3 hidden">
                        <label className="form-label fw-semibold">Tên đăng nhập</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Họ và tên</label>
                        <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="mb-3 hidden">
                        <label className="form-label fw-semibold">Mật khẩu mới (nếu đổi)</label>
                        <input type="password" name="password" className="form-control" placeholder="Để trống nếu không muốn thay đổi" onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Giới tính</label>
                        <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                            <option value="">-- Chọn giới tính --</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Ngày sinh</label>
                        <input type="date" name="birthday" className="form-control" value={formData.birthday} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Địa chỉ</label>
                        <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} />
                    </div>

                    <div className="mb-3 hidden">
                        <label className="form-label fw-semibold">Ảnh đại diện</label>
                        <input type="file" name="avatar" className="form-control" onChange={handleChange} />
                        {user?.avatar && (
                            <div className="mt-2">
                                <img src={
                                    user?.avatar
                                        ? user.avatar.startsWith('http://') || user.avatar.startsWith('https://')
                                            ? user.avatar
                                            : getImageUrl(user.avatar)
                                        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
                                } alt="Avatar" width="100" className="rounded" />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
                        <i className="fas fa-save me-2"></i>Cập nhật thông tin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserForm;
