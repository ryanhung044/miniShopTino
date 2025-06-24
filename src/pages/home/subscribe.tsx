import React from "react";
import { followOA } from "zmp-sdk/apis";


export default function SubscribeBox() {
    const handleFollow = async () => {
        try {
            await followOA({
                id: "xxxx",
            });
            console.log("Theo dõi thành công");
        } catch (error) {
            console.log("Lỗi: " , error);

        };
    }
    return (
        <div className="bg-white rounded-xl shadow p-4 mt-4 mx-4">
            <p className="text-sm text-gray-600 mb-2">
                Nhận thông báo khuyến mãi mới nhất từ cửa hàng
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src="https://www.tinotech.app/storage/uploads/logo/logo-default.jpg" // logo OA
                        alt="Mini shop"
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Mini shop</p>
                        <p className="text-xs text-gray-500">Official Account</p>
                    </div>
                </div>

                <button
                    onClick={handleFollow}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg"
                >
                    Quan Tâm
                </button>
            </div>
        </div>
    );
}
