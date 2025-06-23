export default function BestSellerSection() {
  const bestSellers = [
    {
      title: "Mini Shop",
      price: "499.000 VNĐ",
      image: "https://zalo-miniapp.github.io/zaui-market/dummy/product/apples.png",
    },
    {
      title: "Zalo Business Account",
      price: "1.990.000 VNĐ",
      image:
        "https://zalo-miniapp.github.io/zaui-market/dummy/product/milk.png",
    },
    {
      title: "Giờ vàng ưu đãi",
      price: "1.299.000 VNĐ",
      image:
        "https://zalo-miniapp.github.io/zaui-market/dummy/product/danisa.png",
    },
  ];

  return (
    <div className="px-4 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold text-gray-800">Sản phẩm bán chạy</h2>
        <button className="text-blue-600 text-sm">Xem tất cả</button>
      </div>

      {/* Product Scroll List */}
      <div className="flex overflow-x-auto space-x-4 hide-scrollbar pb-3">
        {bestSellers.map((item, index) => (
          <div
            key={index}
            className="w-[230px] bg-white rounded-xl shadow-sm p-3 flex flex-col items-center flex-shrink-0"
          >
            {/* Hình ảnh */}
            <img
              src={item.image}
              alt={item.title}
              className="w-[200px] h-[200px] object-contain mb-2"
            />

            {/* Tên */}
            <p className="text-sm  text-start w-full font-normal text-gray-800 mb-1">{item.title}</p>

{/* Tên sản phẩm + nút giỏ */}
<div className="flex items-center justify-between w-full mb-1">
  <p className="text-sm font-normal text-gray-800">{item.price}</p>
  <button className="w-7 h-7 bg-green-100 text-green-700 rounded-md text-lg leading-none flex items-center justify-center">
    +
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}
