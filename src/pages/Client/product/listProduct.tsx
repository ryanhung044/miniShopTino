import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/index.css'
import { API_URL, APP_URL, getImageUrl } from "../config";
import { toast } from 'react-toastify';
import { Header } from 'zmp-ui';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';
interface Category {
    id: number;
    name: string;
}
interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    price: number;
    sale_price: number;
    stock: number;
    thumbnail: string;
    commission_rate: number;
}
const shareProduct = (name, link) => {
    const shareData = {
        // title: name,
        // text: `Khám phá sản phẩm "${name}" này nhé!`,
        url: link
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('✅ Chia sẻ thành công'))
            .catch((err) => console.warn('❌ Chia sẻ bị huỷ hoặc lỗi:', err));
    } else {
        navigator.clipboard.writeText(link)
            .then(() => alert('🔗 Link sản phẩm đã được sao chép!'))
            .catch(() => alert('❌ Không thể sao chép link'));
    }
};
const handleAddToCart = async (productId) => {
    try {
        const res = await axios.get(`${API_URL}/check-stock/${productId}`);

        const product = res.data.product;

        // Lấy giỏ hàng hiện tại từ sessionStorage
        const savedCart = nativeStorage.getItem('cart');
        const currentCart = savedCart ? JSON.parse(savedCart) : [];

        const newCart = [...currentCart];
        const index = newCart.findIndex((item) => item.id === productId);
        console.log(index);

        if (index >= 0) {
            if (newCart[index].quantity >= product.stock) {
                toast.error('Không đủ hàng trong kho!');
                return;
            }
            newCart[index].quantity++;
        } else {
            newCart.push({
                id: productId,
                name: product.name,
                price: product.sale_price,
                quantity: 1,
                image: product.thumbnail,
                category_id: product.category_id,
            });
        }

        // sessionStorage.setItem('cart', JSON.stringify(newCart));
        nativeStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event("cart-updated"));
        toast.success('Đã thêm vào giỏ hàng');
    } catch (err) {
        const message = 'Thêm vào giỏ thất bại';
        toast.error(message);
    }
};
const listProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const initialCategoryId = query.get('category_id') || 'all';

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<any>({});
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);

    useEffect(() => {
        const token = nativeStorage.getItem('access_token');
        console.log(token);
        
        axios.get(`${API_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setCategories(res.data.data));

        axios.get(`${API_URL}/products`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setProducts(res.data.data));

        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setUser(res.data.data));
    }, []);


    const filterCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        const urlParams = new URLSearchParams(location.search);
        if (categoryId === 'all') {
            urlParams.delete('category_id');
        } else {
            urlParams.set('category_id', categoryId);
        }
        navigate({ search: urlParams.toString() });
    };

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => String(p.category_id) === String(selectedCategory));

    const copyReferralLink = (link) => {
        navigator.clipboard.writeText(link)
            .then(() => alert('Link giới thiệu đã được sao chép!'))
            .catch(err => console.error('Không thể sao chép link', err));
    };

    return (
        <div className="product-section px-3 mt-4" style={{ overflow: 'auto', paddingBottom: '80px', paddingTop: '80px' }}>
            {/* Danh mục */}
            <Header title="Danh sách sản phẩm" showBackIcon={true} />
            <div className="mb-3 overflow-auto d-flex" style={{ whiteSpace: 'nowrap' }}>
                <button
                    className={`btn btn-sm btn-category me-2 ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => filterCategory('all')}
                >
                    Tất cả
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`btn btn-sm btn-category me-2 ${String(selectedCategory) === String(category.id) ? 'active' : ''}`}
                        onClick={() => filterCategory(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Danh sách sản phẩm */}
            <div className="row g-3">
                {filteredProducts.map(product => (
                    <div className="col-6 product-item" key={product.id}>
                        <div className="card border-0 shadow-sm rounded-3 position-relative">
                            <Link to={`/productDetail/${product.slug}`}>
                                <img src={`${getImageUrl(product.thumbnail)}`} className="card-img-top rounded-top-3" style={{ 'height': '200px', 'objectFit': 'contain' }} alt="" />
                            </Link>
                            {product.stock === 0 && (
                                <div className="top-badge">
                                    <span className="badge bg-danger">Hết hàng</span>
                                </div>
                            )}
                            <div className="card-body p-2">
                                <h6 className="card-title text-truncate mb-1">{product.name}</h6>
                                <p className="text-danger mb-1">
                                    {product.price && (
                                        <span className="text-secondary text-decoration-line-through mb-1" style={{ marginRight: '10px' }}>
                                            {Number(product.price).toLocaleString('vi-VN')} VND
                                        </span>
                                    )}
                                    <p className="fw-bold mb-0">
                                        {Number(product.sale_price).toLocaleString('vi-VN')} VND
                                    </p>
                                </p>
                                <div className="d-flex gap-2 flex-column">
                                    <div className="small text-muted">
                                        Bạn có thể nhận{' '}
                                        {Math.floor(product.sale_price * (40 / 100)).toLocaleString('vi-VN')}đ
                                        {/* {Math.floor(product.sale_price * (product.commission_rate / 100)).toLocaleString('vi-VN')}đ */}

                                    </div>
                                    <div className='text-end'>
                                        <a onClick={() => handleAddToCart(product.id)} className="btn btn-light rounded-circle border">
                                            <i className="fa fa-plus"></i>
                                        </a>
                                        <button
                                            className="btn btn-light rounded-circle border ms-1"
                                            onClick={() => shareProduct(product.name, `${APP_URL}/productDetail/${product.slug}?ref=${user?.id ?? ''}`)}
                                        >
                                            <i className="fa fa-share"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default listProduct;
