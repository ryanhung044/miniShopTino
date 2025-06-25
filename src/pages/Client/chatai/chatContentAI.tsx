import { API_URL, getImageUrl } from '../config';
import React from 'react';
import { useState, useEffect } from 'react';
import { Header } from 'zmp-ui';
type Product = {
    id: number;
    name: string;
    thumbnail: string;
    content: string;
    images: string;
};

function ContentGenerator() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productId, setProductId] = useState('');
    const [category, setCategory] = useState('');
    const [platform, setPlatform] = useState('');
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [thumbnail, setImage] = useState('');

    const categories = [
        { value: 'caption', label: 'Caption Facebook' },
        { value: 'mo-ta', label: 'Mô tả sản phẩm' },
        { value: 'short-quang-cao', label: 'Quảng cáo ngắn' },
    ];

    const platforms = ['Facebook', 'Zalo', 'TikTok', 'Shopee'];

    // Lấy sản phẩm từ backend Laravel
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products`);
                const data = await res.json();
                setProducts(data.data);
            } catch (err) {
                console.error('Lỗi khi lấy sản phẩm:', err);
            }
        };
        fetchProducts();
    }, []);

    const handleGenerate = async () => {
        if (!productId || !category || !platform) {
            alert('Vui lòng chọn đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        setReply('');

        const product = products.find(p => p.id == Number(productId));
        if (!product) {
            alert("Không tìm thấy sản phẩm!");
            return;
        }

        // let input = '';
        // switch (category) {
        //     case 'bai-viet-quang-cao':
        //         input = `Viết một đoạn quảng cáo hấp dẫn cho sản phẩm "${product.name}" để đăng trên ${platform}. ${product.content ? `Thông tin sản phẩm: ${product.content}` : ''}`;
        //         break;
        //     case 'mo-ta-ngan':
        //         input = `Viết mô tả ngắn gọn, súc tích cho sản phẩm "${product.name}" dùng trên ${platform}. ${product.content ? `Chi tiết sản phẩm: ${product.content}` : ''}`;
        //         break;
        //     case 'facebook-post':
        //         input = `Tạo một bài viết Facebook cho sản phẩm "${product.name}" hấp dẫn người xem. ${product.content ? `Thông tin thêm: ${product.content}` : ''}`;
        //         break;
        //     // Thêm các thể loại khác nếu cần
        //     default:
        //         input = `Viết 1 nội dung cho sản phẩm "${product.name}" phù hợp đăng trên ${platform}. ${product.content ? `Chi tiết sản phẩm: ${product.content}` : ''}`;
        // }

        // const input = `Viết ${category} cho sản phẩm "${product.name}" phù hợp đăng trên nền tảng ${platform}.${product.content ? `Mô tả sản phẩm: ${product.content}` : ''}`;
        const input = `Hãy viết một bài viết ${category.toLowerCase()} cho sản phẩm "${product.name}", phù hợp để đăng trên nền tảng ${platform}.${product.content ? `Mô tả sản phẩm: ${product.content}` : ''}.  Chỉ 1 lựa chọn`;


        const img = getImageUrl(product.thumbnail);
        let productImages: string[] = [];
        try {
            productImages = product.images ? JSON.parse(product.images) : [];
        } catch (e) {
            console.error("Lỗi khi parse images:", e);
        }
        setImages(productImages);
        setImage(img);


        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-r1-distill-llama-70b:free',
                    // model: 'google/gemini-2.0-flash-exp:free',
                    messages: [
                        { role: 'user', content: input },

                        // {
                        //     "type": "image_url",
                        //     "image_url": {
                        //         "url": img
                        //     }
                        // },
                    ],
                }),
            });

            const data = await response.json();
            const aiReply = data?.choices?.[0]?.message?.content || "Không có phản hồi từ AI.";
            setReply(aiReply);
        } catch (error) {
            console.error('Lỗi:', error);
            setReply("Đã xảy ra lỗi khi gửi tin nhắn.");
        } finally {
            setLoading(false);
        }
    };
    const formatMessage = (text: string) => {
        return text
            .replace(/\\"/g, '') // Xoá dấu \"
            .replace(/\n/g, '<br/>') // Xử lý xuống dòng
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // In đậm
    };

    const handleCopyText = async () => {
        const el = document.getElementById('copy-content');
        if (!el) return;

        const html = el.innerHTML;
        const plainText = el.innerText;

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([plainText], { type: 'text/plain' }),
                }),
            ]);
            alert('Đã sao chép nội dung vào clipboard!');
        } catch (err) {
            console.error('Lỗi khi copy:', err);
            alert('Không thể sao chép nội dung.');
        }
    };

    const handleCopy = async () => {
        const el = document.getElementById('copy-content');
        if (!el) return;
        // const html = el.innerHTML;
        // const plainText = el.innerText;
        const imageUrl = `${API_URL}/image-proxy?url=${encodeURIComponent(thumbnail)}`;
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imageUrl;
        image.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert('Không thể chuyển ảnh thành blob');
                    return;
                }

                const clipboardItems: ClipboardItem[] = [
                    new ClipboardItem({
                        // 'text/html': new Blob([html], { type: 'text/html' }),
                        // 'text/plain': new Blob([plainText], { type: 'text/plain' }),
                        'image/png': blob
                    })
                ];
                try {
                    await navigator.clipboard.write(clipboardItems);
                    alert('Đã sao chép văn bản và hình ảnh!');
                } catch (err) {
                    console.error('Clipboard write failed:', err);
                    alert('Sao chép thất bại. Kiểm tra console để biết thêm chi tiết.');
                }
            }, 'image/png');
        };

        image.onerror = () => {
            console.error('Ảnh không tải được:', imageUrl);
            alert('Không thể tải ảnh để sao chép.');
        };
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md pb-5" style={{ overflow: 'auto' }}>
            {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">✨ Tạo nội dung sản phẩm bằng AI</h1> */}
            <Header title="Tạo nội dung sản phẩm bằng AI" showBackIcon={true} />

            {/* Chọn sản phẩm */}
            <div className="mb-4 mt-3">
                <label className="block mb-2 font-medium text-gray-700">Chọn sản phẩm</label>
                <select
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Chọn sản phẩm --</option>
                    {Array.isArray(products) && products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
            </div>

            {/* Thể loại */}
            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Thể loại</label>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            {/* Nền tảng */}
            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Nền tảng</label>
                <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Chọn nền tảng --</option>
                    {platforms.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* Nút tạo nội dung */}
            <button
                onClick={handleGenerate}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-200"
                disabled={loading}
            >
                {loading ? '⏳ Đang tạo nội dung...' : '🚀 Tạo nội dung'}
            </button>

            {/* Kết quả AI */}
            {reply && (
                <div className="mt-8 pb-5 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                        <h2 className="text-xl font-semibold text-gray-800">📋 Kết quả từ AI:</h2>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition"
                                onClick={handleCopyText}
                            >
                                📄 Sao chép văn bản
                            </button>
                            <button
                                className="px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-50 transition"
                                onClick={handleCopy}
                            >
                                🖼️ Sao chép ảnh
                            </button>
                        </div>
                    </div>

                    <div id="copy-content" className="prose max-w-none text-gray-700">
                        <span dangerouslySetInnerHTML={{ __html: formatMessage(reply) }} />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {images.map((img, index) => (
                                <div key={index} className="rounded overflow-hidden shadow-sm border">
                                    <img
                                        src={getImageUrl(img.replace(/\\/g, ''))}
                                        alt={`Ảnh sản phẩm ${index}`}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default ContentGenerator;