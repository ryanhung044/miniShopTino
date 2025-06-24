import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// import { nativeStorage } from "zmp-sdk/apis";
import { useNavigate } from 'react-router-dom';
import nativeStorage from '@/utils/nativeStorage';
type LoginErrors = {
    phone?: string[];
    password?: string[];
};

function LoginForm() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");

        try {
            const response = await axios.post(`${API_URL}/login`, {
                phone,
                password,
                remember
            });

            if (response.data) {
                toast.success("Đăng nhập thành công!");
                console.log(response.data.access_token);

                localStorage.setItem("access_token", response.data.access_token);
                nativeStorage.setItem("access_token", response.data.access_token);
                // window.location.href = "/";
                navigate('/');
            }
        } catch (error) {
            console.warn("nativeStorage error:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="register-container shadow rounded p-4 mx-auto" style={{ maxWidth: 400 }}>
                <h3 className="text-center mb-4">Đăng nhập</h3>

                {message && <div className="alert alert-danger">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại *</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && <small className="text-danger">{errors.phone[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mật khẩu *</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                        />
                        {errors.password && <small className="text-danger">{errors.password[0]}</small>}
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label className="form-check-label">Ghi nhớ tài khoản</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>

                    <p className="text-center mt-3">
                        Bạn chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
