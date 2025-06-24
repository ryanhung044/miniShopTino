import { API_URL, APP_URL, getImageUrl } from '../config';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    full_name: string;
    balance: number;
    avatar: string;
    app_id: number;
    // Các trường khác nếu có
}

type Banner = {
    id: number;
    image: string;
    link: string;
    title: string;

};


const AgencyPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [teamSales, setTeamSales] = useState(0);
    const [userSale, setUserSale] = useState(0);
    const [commissionPending, setCommissionPending] = useState(0);
    const [commissionCompleted, setCommissionCompleted] = useState(0);
    const [countOrderCompleted, setCountOrderCompleted] = useState(0);
    const [countUserReferrer, setCountUserReferrer] = useState(0);
    const [banners, setBanners] = useState<Banner[]>([]);
    const token = nativeStorage.getItem('access_token');
    console.log(token);
    
    const [hasHighValueCombo, setHasHighValueCombo] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = () => {
        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                setHasHighValueCombo(res.data.hasHighValueCombo);
                setLoading(false);
            }

            )
            .catch(() => toast.error('Không thể lấy số dư tài khoản'));
    };
    useEffect(() => {
        if (!token) return;
        fetchUser();

    }, [token]);
    useEffect(() => {
        if (banners && banners?.length > 0) {
            const swiper = new Swiper('.banner-swiper', {
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 3000,
                },
                slidesPerView: 1,
            });

            return () => swiper.destroy();
        }
    }, [banners]);
    useEffect(() => {
        // Fetch user data and sales info from an API (replace with your actual API endpoint)
        const fetchData = async () => {
            const token = nativeStorage.getItem('access_token') || localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/agency`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // truyền token vào header
                }
            });

            // const response = await fetch(`${API_URL}/agency`);
            const data = await response.json();
            // console.log(data);

            setUser(data.user);
            setTeamSales(data.teamSales);
            setUserSale(data.userSale);
            setCommissionPending(data.commission_pending);
            setCommissionCompleted(data.commission_completed);
            setCountOrderCompleted(data.count_order_completed);
            setCountUserReferrer(data.count_user_referrer);
            setBanners(data.banners);
        };

        fetchData();
    }, []);

    const handleShare = () => {
        const userId = user ? user.id : '';
        const shareData = {
            // title: 'Ứng dụng mua hàng trực tuyến',
            // text: 'Tải app và nhận tới 600.000đ!',
            url: `${APP_URL}/referrer?ref=${userId}&app_id=${user?.app_id}`
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully', shareData))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert('Link đã được sao chép! Hãy chia sẻ với bạn bè của bạn nhé 🎉');
            });
        }
    };

    return (
        <div className="container pt-3" style={{ overflow: 'auto', paddingBottom: '80px' }}>
            {/* Banner */}
            <div className="swiper banner-swiper mt-3">
                <div className="swiper-wrapper">
                    {banners?.map((banner) => (
                        <div className="swiper-slide" key={banner.id}>
                            <Link to={banner.link}>
                                <img
                                    src={`${getImageUrl(banner.image)}`}
                                    alt={banner.title}
                                    className="img-fluid rounded-3 w-100"
                                />
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="swiper-pagination"></div>
            </div>

            {/* Member Section */}
            <div className="mt-3 mb-1 d-flex justify-content-center">
                {/* <Link to="/ambassador" className="btn" style={{ backgroundColor: '#152379', color: 'white' }}>
                    Nâng cấp gói thành viên
                </Link> */}
                {!loading && (
                    hasHighValueCombo ? (
                        <div className="badge" style={{ backgroundColor: '#FFD700', color: '#000', padding: '10px 20px', borderRadius: '6px' }}>
                            Thành viên vàng
                        </div>
                    ) : (
                        <Link to="/ambassador" className="btn" style={{ backgroundColor: '#152379', color: 'white' }}>
                            Nâng cấp gói thành viên
                        </Link>
                    )
                )}
            </div>
            <div>
                {!loading && (
                    hasHighValueCombo ? (
                        <span></span>
                    ) : (
                        <p className="text-center">Để hưởng những quyền lợi của thành viên vàng</p>

                    )
                )}
            </div>

            <div className="wallet-box p-3 rounded-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Left Section */}
                    <div style={{ color: '#152379' }}>
                        {!loading && (
                            hasHighValueCombo ? (
                                <p className="mb-1 fw-semibold">Cộng tác viên</p>
                            ) : (
                                <p className="mb-1 fw-semibold">Chưa đăng ký cộng tác viên</p>
                            )
                        )}
                        {!loading && (
                            hasHighValueCombo ? (
                                <p className="mb-0 fw-light small">Bắt đầu kiếm tiền</p>
                            ) : (
                                <p className="mb-0 fw-light small">Thành viên mới</p>
                            )
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <div style={{ color: '#152379', textAlign: 'right' }}>
                            <p className="mb-1 fw-light small">Xin chào,</p>
                            <p className="mb-0 fw-semibold text-uppercase">{user ? user.full_name : ''}</p>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ccc' }}><img
                            src={
                                user?.avatar
                                    ? user.avatar.startsWith('http://') || user.avatar.startsWith('https://')
                                        ? user.avatar
                                        : getImageUrl(user.avatar)
                                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
                            }
                            alt="Avatar"
                            className="w-16 rounded-full"
                        />

                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Section */}
            <div className="wallet-box">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <div>Số dư ví</div>
                        <div className="wallet-amount" style={{ fontSize: '2em' }}>
                            {user ? Number(user.balance).toLocaleString('vi-VN') + ' đ' : '0đ'}
                        </div>
                    </div>
                </div>
                <div className="small text-muted mt-2">
                    Bạn đã có {commissionPending ? Number(commissionPending).toLocaleString('vi-VN') + ' đ' : '0đ'} đang chờ duyệt, chia sẻ để kiếm thêm!
                    <i className="fas fa-paper-plane text-primary"></i>
                </div>
            </div>

            {/* Stats Section */}
            <div className="row">
                {/* Team Sales */}
                <div className="col-6">
                    <div className="wallet-box">
                        <div className="d-flex align-items-center gap-3">
                            <div><i className="fa-solid fs-1 fa-sack-dollar" style={{ color: '#152379' }}></i></div>
                            <div>
                                <div className="small text-muted mt-2" style={{ fontSize: '.75em' }}>
                                    Doanh số nhóm
                                </div>
                                <div className="wallet-amount">
                                    {teamSales ? Number(teamSales).toLocaleString('vi-VN') + ' đ' : '0đ'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Sale */}
                <div className="col-6">
                    <div className="wallet-box">
                        <div className="d-flex align-items-center gap-3">
                            <div><i className="fa-solid fs-1 fa-sack-dollar" style={{ color: '#152379' }}></i></div>
                            <div>
                                <div className="small text-muted mt-2" style={{ fontSize: '.75em' }}>
                                    Doanh số cá nhân
                                </div>
                                <div className="wallet-amount">
                                    {userSale ? Number(userSale).toLocaleString('vi-VN') + ' đ' : '0đ'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Commission Pending */}
                <div className="col-6">
                    <div className="wallet-box">
                        <div className="d-flex align-items-center gap-3">
                            <div><i className="fa-solid fs-1 fa-sack-dollar" style={{ color: '#152379' }}></i></div>
                            <div>
                                <div className="small text-muted mt-2" style={{ fontSize: '.75em' }}>
                                    Hoa hồng chờ duyệt
                                </div>
                                <div className="wallet-amount">
                                    {commissionPending ? Number(commissionPending).toLocaleString('vi-VN') + ' đ' : '0đ'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Commission Completed */}
                <div className="col-6">
                    <div className="wallet-box">
                        <div className="d-flex align-items-center gap-3">
                            <div><i className="fa-solid fs-1 fa-sack-dollar" style={{ color: '#152379' }}></i></div>
                            <div>
                                <div className="small text-muted mt-2" style={{ fontSize: '.75em' }}>
                                    Hoa hồng đã duyệt
                                </div>
                                <div className="wallet-amount">
                                    {commissionCompleted ? Number(commissionCompleted).toLocaleString('vi-VN') + ' đ' : '0đ'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Completed */}
                <div className="col-6">
                    <div className="wallet-box">
                        <div className="d-flex align-items-center gap-3">
                            <div><i className="fa-solid fs-1 fa-sack-dollar" style={{ color: '#152379' }}></i></div>
                            <div>
                                <div className="small text-muted mt-2" style={{ fontSize: '.75em' }}>
                                    Đơn thành công
                                </div>
                                <div className="wallet-amount">
                                    {countOrderCompleted ? countOrderCompleted : 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Referrer */}
                <div className="col-6">
                    <div className="wallet-box">
                        <div className="d-flex align-items-center gap-3">
                            <div><i className="fa-solid fs-1 fa-sack-dollar" style={{ color: '#152379' }}></i></div>
                            <div>
                                <div className="small text-muted mt-2" style={{ fontSize: '.75em' }}>
                                    Số thành viên
                                </div>
                                <div className="wallet-amount">
                                    {countUserReferrer ? countUserReferrer : 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools */}
            <div className="wallet-box">
                <div>
                    <div className="mb-2 fw-bold" style={{ fontSize: '1.2em' }}>Công cụ</div>
                    <div className="row">
                        <div className="col-4">
                            <Link to="/orders/history/affiliate" className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center">
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9QmbnMDHpGBLwzsWXuWwEhKZxodBxPikWnw&s"
                                        style={{ height: '80px' }}
                                        alt="Đơn hàng"
                                    />
                                    <div className="wallet-amount text-center">Đơn hàng</div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-4">
                            <Link to="/users/member" className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center">
                                    <img
                                        src="https://canhquan.net/Content/Images/FileUpload/customerfiles/94/images/Meet-the-Team-Team-Icon.png"
                                        style={{ height: '80px' }}
                                        alt="Đội nhóm"
                                    />
                                    <div className="wallet-amount text-center">Đội nhóm</div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-4">
                            <Link to="/articleDetail/chinh-sach-cong-tac-vien" className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center">
                                    <img
                                        src="https://hocdohoaonline.com/wp-content/uploads/2015/11/long-icon-011.jpg"
                                        style={{ height: '80px' }}
                                        alt="Chính sách"
                                    />
                                    <div className="wallet-amount text-center">Chính sách</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 mb-3">
                <button
                    onClick={handleShare}

                    className="w-100 btn rounded-pill border-black d-flex justify-content-center gap-3 align-items-center"
                    style={{ border: '1px solid #ccc', fontWeight: 'bold', fontSize: '1rem' }}
                >
                    Chia sẻ ngay để nhận tới 350.000đ
                    <i className="fas fa-share" style={{ fontSize: '2rem', color: 'blue' }}></i>
                </button>
            </div>
            <div>
                <div className="mb-2 fw-bold text-center" style={{ fontSize: '1.2em' }}>
                    3 bước để nhận hoa hồng dễ dàng
                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="d-flex flex-column align-items-center">
                            <img src="https://cdn-icons-png.flaticon.com/512/1646/1646851.png" style={{ height: '80px' }} alt="Chia sẻ link" />
                            <div className="wallet-amount text-center">Chia sẻ link</div>
                        </div>
                    </div>
                    <div className="col-1 d-flex flex-column align-items-center justify-content-center">
                        <img src="https://static.thenounproject.com/png/790923-200.png" style={{ height: '30px', maxWidth: 'unset' }} alt="Arrow" />
                    </div>
                    <div className="col-4">
                        <div className="d-flex flex-column align-items-center">
                            <img src="https://cdn-icons-png.flaticon.com/256/1057/1057240.png" style={{ height: '80px' }} alt="Nhận giới thiệu" />
                            <div className="wallet-amount text-center">Nhận giới thiệu</div>
                        </div>
                    </div>
                    <div className="col-1 d-flex flex-column align-items-center justify-content-center">
                        <img src="https://static.thenounproject.com/png/790923-200.png" style={{ height: '30px', maxWidth: 'unset' }} alt="Arrow" />
                    </div>
                    <div className="col-3">
                        <div className="d-flex flex-column align-items-center">
                            <img src="https://cdn-icons-png.flaticon.com/256/9603/9603812.png" style={{ height: '80px' }} alt="Nhận hoa hồng" />
                            <div className="wallet-amount text-center">Nhận hoa hồng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AgencyPage;
