import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserInfo, getPhoneNumber, getAccessToken, getRouteParams } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import { authorize, closeApp } from "zmp-sdk/apis";
import { API_URL, getImageUrl } from '../config';
import nativeStorage from '@/utils/nativeStorage';


interface AppSetting {
    app_name: string;
    description?: string;
    logo_path?: string;
    favicon_path?: string;
}

const SignupPage = () => {
    const [appSetting, setAppSetting] = useState<AppSetting | null>(null);
    const [data, setData] = useState<{
        appSetting: AppSetting;
        banners: any[];
        user: any;
        products: any[];
        topProducts: any[];
        articles: any[];
        menu1: any[];
        finalTop: any[];
        error: string | null;
    }>({
        appSetting: {
            app_name: '',
            description: '',
            logo_path: '',
            favicon_path: ''
        },
        banners: [],
        user: {},
        products: [],
        topProducts: [],
        articles: [],
        menu1: [],
        finalTop: [],
        error: null,
    });
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: '',
        avatar: '',
        id: '',
        phone: ''
    });
    const { ref, app_id } = getRouteParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/getInfoApp`);
                if (response.data?.appSetting) {
                    setAppSetting(response.data.appSetting);
                } else {
                    console.warn('Không có dữ liệu appSetting');
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        fetchData();
    }, []);


    const handleSignup = async () => {
        authorize({
            scopes: ["scope.userPhonenumber"],
            success: async () => {
                try {
                    const phonePromise = new Promise<string>((resolve, reject) => {
                        getPhoneNumber({
                            success: async (data) => {
                                const { token } = data;
                                try {
                                    const accessToken = await getAccessToken({});
                                    const res = await axios.post(`${API_URL}/zalo/user-info`, {
                                        access_token: accessToken,
                                        code: token,
                                    });
                                    const phone = res.data.data.number ?? '';
                                    resolve(phone);
                                } catch (err) {
                                    reject(err);
                                }
                            },
                            fail: reject,
                        });
                    });

                    const infoPromise = new Promise<any>((resolve, reject) => {
                        getUserInfo({
                            success: (res) => resolve(res.userInfo),
                            fail: reject,
                        });
                    });

                    const [phone, user] = await Promise.all([phonePromise, infoPromise]);

                    const fullUserInfo = {
                        name: user.name,
                        avatar: user.avatar,
                        id: user.id,
                        phone,
                    };

                    setUserInfo(fullUserInfo);

                    // Call signup
                    const res = await axios.post(`${API_URL}/zalo/signup`, {
                        name: fullUserInfo.name || 'User' + fullUserInfo.id,
                        avatar: fullUserInfo.avatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
                        id: fullUserInfo.id,
                        phone: fullUserInfo.phone,
                        referrer_id: nativeStorage.getItem("referrer_id"),
                        app_id: nativeStorage.getItem("app_id"),
                    });

                    const token = res.data.token;
                    nativeStorage.setItem("access_token", token);
                    localStorage.setItem("access_token", token);
                    toast.success("Đăng ký thành công!");

                    const response = await axios.get(`${API_URL}/index`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                    });

                    setData(prevData => ({
                        ...prevData,
                        ...response.data,
                    }));

                    navigate('/');
                } catch (error) {
                    console.error("Đăng ký thất bại:", error);
                    toast.error("Có lỗi xảy ra khi đăng ký.");
                }
            },
            fail: (error) => {
                console.log('authorize error:', error);
                toast.error('Bạn cần cấp quyền để sử dụng ứng dụng.');
            }
        });

    }

    return (
        <div style={{ overflow: 'auto' }}>
            <div style={{ position: 'relative' }}>
                <div className="background"></div>
                <div className="header" style={{ position: 'absolute' }}>
                    <div
                        className="logo-top d-flex align-items-center gap-3"
                        style={{ position: 'absolute', top: '50px', left: '20px' }}
                    >
                        {/* <img
                            src={`${getImageUrl(appSetting?.favicon_path ?? '')}`}
                            alt={appSetting?.app_name}
                            style={{
                                background: 'white',
                                borderRadius: '50%',
                                height: '70px'
                            }}
                        />
                        <span className="text-white fs-3 fw-bold text-uppercase text-nowrap">
                            {appSetting?.app_name}
                        </span> */}
                    </div>
                </div>
            </div>
            <div className="container" style={{ paddingTop: '130px', margin: 'auto' }}>
                <div className="wallet-box p-3 rounded-4 shadow-sm" style={{ position: 'relative' }}>
                    <div className="m-auto d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
                        <button
                            onClick={handleSignup}
                            className="bg-blue-500 text-white px-4 py-2 rounded">
                            Kích hoạt tài khoản
                        </button>
                        <div className="small text-muted mt-2 text-center" style={{ fontSize: '.75em' }}>
                            Bằng việc bấm "Kích hoạt tài khoản", chúng tôi hiểu rằng bạn đã đồng ý với điều khoản của Gia Việt
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
