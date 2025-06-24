import { APP_URL }  from '../config';
import React from 'react';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';
import { getRouteParams } from "zmp-sdk/apis";

type ReferralProps = {
    user: any;
    appSetting: any;
};
const Referral = ({ user, appSetting }) => {
    console.log(user);
    const { ref } = getRouteParams();


    const handleShare = () => {
        const userId = user?.id;
        const shareData = {
            // title: 'Ứng dụng mua hàng trực tuyến',
            // text: 'Tải app và nhận tới 600.000đ!',
            url: APP_URL + '/referrer?ref=' + userId + 'app_id=' + user?.app_id ,
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert('Link đã được sao chép! Hãy chia sẻ với bạn bè của bạn nhé 🎉');
            });
        }
    };

    // const params = new URLSearchParams(window.location.search);
    // const ref = params.get('ref');

    if (ref) {
        nativeStorage.setItem('referrer_id', ref);
        // localStorage.setItem('referrer_id', ref);
        console.log('Referrer ID saved:', ref);
    }


    if (!user) {
        return (
            <button>Kích hoạt tài khoản</button>
        );
    }
    return (
        <div className="container d-flex align-items-center justify-content-center mt-2 h-100">
            <div className="card p-4 shadow-sm rounded-4 text-center" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="mb-3 p-3 bg-light rounded-3 d-flex justify-content-between">
                    <div className="text-muted">Người giới thiệu</div>
                    {user?.referrer_id ? (
                        <div className="fw-bold text-primary">GT{user.referrer_id}</div>
                    ) : (
                        <div className="fw-bold text-primary">Không có</div>
                    )}
                </div>

                <div className="mb-4 p-3 bg-light rounded-3 d-flex justify-content-between">
                    <div className="text-muted">Mã giới thiệu của bạn</div>
                    <div className="fw-bold text-primary">GT{user?.id}</div>
                </div>

                <button
                    onClick={handleShare}
                    className="btn"
                    style={{
                        backgroundColor: '#152379',
                        color: 'white',
                        borderRadius: '999px',
                        padding: '10px 30px',
                    }}
                >
                    Chia sẻ link giới thiệu
                </button>
            </div>
        </div>
    );
};

export default Referral;
