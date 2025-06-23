import React from "react";

const newsList = [
    {
        title: "🔥 TỰ CHỦ KÊNH BÁN HÀNG: LỢI HAY HẠI?",
        image: "https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/501209829_602119292904719_5642096946167144784_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZI2A_KavbGYQ7kNvwE44LVR&_nc_oc=AdmNTnHj4Cl5A2xwXBa0-gK2Ghh1EbrsTNL6hw5MTxE3rRX8X9yeP8-Fpkjkci_fRq0&_nc_zt=23&_nc_ht=scontent.fhan17-1.fna&_nc_gid=67M3LiJSuSmDhBs8ZGSrkQ&oh=00_AfPH5rs14PVoSEcP81plS7F9NBIzvVsldTzSfJOfF9B0LA&oe=685C4A0A",
        time: "14:02 - 21/06/2025",
    },
    {
        title: "🔥 TĂNG DOANH THU KHÔNG TĂNG NGÂN SÁCH",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4lIF3TrqrbiwMnThFEDwLrtkyI8HZtzQMg&s",
        time: "15:30 - 20/06/2025",
    },
    {
        title: "🔥 TĂNG DOANH THU KHÔNG TĂNG NGÂN SÁCH",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4lIF3TrqrbiwMnThFEDwLrtkyI8HZtzQMg&s",
        time: "15:30 - 20/06/2025",
    },
    {
        title: "🔥 TĂNG DOANH THU KHÔNG TĂNG NGÂN SÁCH",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4lIF3TrqrbiwMnThFEDwLrtkyI8HZtzQMg&s",
        time: "15:30 - 20/06/2025",
    },
];

export default function NewsSection() {
    return (

        <div className="px-4 mt-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-[16px] text-gray-800">Tin tức</h2>
                <button className="text-blue-600 text-sm">Xem tất cả</button>
            </div>

            {/* News Card Horizontal Scroll */}
            <div className="flex overflow-x-auto hide-scrollbar scroll-x-snap space-x-4 pb-3">
                {newsList.map((item, index) => (
                    <div
                        key={index}
                        className="min-w-[200px] max-w-[300px] bg-white rounded-xl shadow-md flex-shrink-0 snap-start"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-[340px] object-cover object-center rounded-t-xl"
                        />
                        <div className="p-3">
                            <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">{item.time}</p>
                            <button className="text-blue-600 text-xs font-medium">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
