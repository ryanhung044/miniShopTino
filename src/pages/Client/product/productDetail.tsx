// src/pages/productDetail/index.tsx
import React, { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Header, Page, Swiper } from 'zmp-ui';
import axios from 'axios';
import { API_URL, APP_URL, getImageUrl } from '../config';
import { SwiperSlide } from 'swiper/react';
import '../css/ProductDetailPage.css';
import { toast } from 'react-toastify'; // dùng nếu bạn đã cài react-toastify
import { AxiosError } from 'axios';
import nativeStorage from '@/utils/nativeStorage';

interface User {
    id: number;
    name: string;
    // Add more fields depending on your `user` object
}
interface ProductDetailPageProps {
    user: User | null;  // user can be null if not logged in
}

interface Product {
    data: any;
    id: number;
    name: string;
    thumbnail: string;
    description: string;
    price: number;
    sale_price: string;
    stock: number;
    total_sold: number;
    slug: string;
}

// const handleAddToCart = async (productId: number) => {
//     try {
//         const res = await axios.post(`${API_URL}/cart/add/${productId}`,{}, {
//             withCredentials: true
//         });

//         toast.success(res.data.message || 'Thêm vào giỏ thành công!');
//     } catch (err: any) {
//         const message = err.response?.data?.error || 'Thêm vào giỏ thất bại';
//         toast.error(message);
//     }
// };





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
const ProductDetail: FC = () => {
    const [carts, setCarts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<any>({});

    useEffect(() => {
        const token = nativeStorage.getItem('access_token');
        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const dataUser = res.data;
            setUser(dataUser.user)
            console.log(user.id);
        });


    }, []);
    const handleAddToCart = async (productId: number) => {
        try {
            const res = await axios.get(`${API_URL}/check-stock/${productId}`);

            const product = res.data.product;

            // Lấy giỏ hàng hiện tại từ sessionStorage
            const savedCart = nativeStorage.getItem('cart') || localStorage.getItem('cart');
            const currentCart = savedCart ? JSON.parse(savedCart) : [];

            const newCart = [...currentCart];
            const index = newCart.findIndex((item: any) => item.id === productId);
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
            localStorage.setItem('cart', JSON.stringify(newCart));
            window.dispatchEvent(new Event("cart-updated"));
            setCarts(newCart);
            setTotal(newCart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0));
            toast.success('Đã thêm vào giỏ hàng');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Thêm vào giỏ thất bại';
            toast.error(message);
        }
    };
    useEffect(() => {
        const token = nativeStorage.getItem('access_token');
        if (!slug) return;
        axios
            .get(`${API_URL}/product/${slug}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            .then(res => {
                setProduct(res.data);
                setRelatedProducts(res.data.related_products || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra');
                setLoading(false);
            });

    }, [slug]);

    if (loading) {
        return <Box p={4}>Đang tải sản phẩm...</Box>;
    }
    if (error || !product) {
        return <Box p={4} color="danger">{error}</Box>;
    }

    console.log(product);
    const productData = product.data;

    const images = productData.images ? JSON.parse(productData.images) : [];
    const realSold = productData.total_sold || 0; // nếu có total_sold thì dùng
    const MIN_DISPLAY_SOLD = 1000;
    const EXTRA_RANDOM = 500;

    const displaySold = realSold < MIN_DISPLAY_SOLD
        ? MIN_DISPLAY_SOLD + Math.floor(Math.random() * EXTRA_RANDOM)
        : realSold;

    // const shareCommission = product.sale_price * (parseFloat(productData.commission_rate || 0) / 100);

    return (
        <div style={{ overflow: 'auto', marginBottom: '50px' }}>
            {/* Swiper Slider */}
            <Swiper
                // modules={[Navigation, Pagination]}
                loop={true}
                // navigation
                // pagination={{ clickable: true }}
                className="productSwiper"
            >
                <SwiperSlide >
                    <img src={`${getImageUrl(productData.thumbnail)}`} alt="Thumbnail" style={{ margin: 'auto', marginTop: '65px' }} />
                </SwiperSlide>
                {images.map((img, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                        <img src={`${getImageUrl(img.replace(/\\/g, ''))}`} alt={`Ảnh sản phẩm ${index}`} style={{ margin: 'auto', marginTop: '65px' }} />
                    </SwiperSlide>
                ))}


            </Swiper>

            {/* Product Info */}
            <div className="container py-4 bg-white">
                <div className="product-info">
                    <h4 className="mb-2">{productData.name}</h4>
                    <p className="text-danger price mb-2">
                        {productData.price && (
                            <span className="text-secondary text-decoration-line-through me-2" style={{ fontSize: '.8em' }}>
                                {parseInt(productData.price).toLocaleString('vi-VN')} VND
                            </span>
                        )}
                        <span className="fw-bold fs-5">
                            {parseInt(productData.sale_price).toLocaleString('vi-VN')} VND
                        </span>
                    </p>
                    {/* <div className="text-muted small mb-4">Đã bán: {productData.stock}</div> */}
                    <div className="text-muted small mb-4">Đã bán: {displaySold.toLocaleString('vi-VN')}</div>
                </div>

                {/* Share Button */}
                <div className="product-info">
                    <div className="d-flex justify-content-between align-items-center btn btn-primary w-100 mt-3 px-5" onClick={() => shareProduct(productData.name, `${APP_URL}/productDetail/${productData.slug}?ref=${user?.id ?? ''}`)}>
                        <span className="fw-bold">
                            Chia sẻ để nhận ngay 350.000đ
                        </span>
                        <i className="fas fa-share" style={{ fontSize: '2em' }}></i>
                    </div>
                </div>

                {/* Description */}
                {productData.content && (
                    <div className="mt-4">
                        <h5 className="fw-bold mb-2">Mô tả sản phẩm</h5>
                        <div className="text-muted" style={{ lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: productData.content }} />
                    </div>
                )}
            </div>
            {relatedProducts.length > 0 && (
                <div className="container py-4 bg-white">
                    <h5 className="fw-bold mb-3">Sản phẩm liên quan</h5>
                    <div className="row">
                        {relatedProducts.map((rp) => (
                            <div key={rp.id} className="col-6 mb-3">
                                <Link to={`/productDetail/${rp.slug}`} className="text-decoration-none text-dark">
                                    <div className="card">
                                        <img
                                            src={getImageUrl(rp.thumbnail)}
                                            alt={rp.name}
                                            className="card-img-top"
                                        />
                                        <div className="card-body p-2">
                                            <h6 className="card-title text-truncate">{rp.name}</h6>
                                            <p className="card-text text-danger fw-bold">
                                                {/* {parseInt(rp.sale_price).toLocaleString('vi-VN')} VND */}
                                                {parseInt(rp.sale_price).toLocaleString('vi-VN')} VND

                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="bottom-nav2">
                <a onClick={() => handleAddToCart(productData.id)} className="d-flex align-items-center gap-2">
                    <i className="fa fa-cart-plus me-1"></i>
                    <span className="fw-bold fs-5">Thêm vào giỏ hàng</span>
                </a>
                {/* <button onClick={() => handleAddToCart(productData.id)}
                    className="d-flex align-items-center gap-2 btn btn-warning w-100">
                    <i className="fa fa-cart-plus me-1"></i>
                    <span className="fw-bold fs-5">Thêm vào giỏ hàng</span>
                </button> */}

            </div>
            <div className="bottom-nav3">
                <Link to="/cart" className="position-relative nav-icons d-flex align-items-center gap-2">
                    <i className="fa fa-shopping-cart"></i>
                    <span className="fw-bold fs-5">Xem giỏ hàng</span>
                </Link>
            </div>
        </div>
    );
};
const ProductDetailPage2: FC = () => {
    const [user, setUser] = useState<any>({});

    useEffect(() => {
        const token = nativeStorage.getItem('access_token');
        axios.get(`${API_URL}/checkUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const dataUser = res.data;
            setUser(dataUser.user)
            console.log(user.id);
        });
        const footer = document.getElementById('footer');
        if (footer) footer.style.display = 'none';

        return () => {
            const footer = document.getElementById('footer');
            if (footer) footer.style.display = '';
        };

    }, []);

    return (
        <Page>
            <Header showBackIcon={true} title="Chi tiết sản phẩm" />
            {/* <Subscription /> */}
            <ProductDetail />
            {/* <Other /> */}
        </Page>
    );
};
export default ProductDetailPage2;

