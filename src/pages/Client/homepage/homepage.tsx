import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { register } from 'swiper/element/bundle';
import { API_URL, APP_URL, getImageUrl } from "../config";
import { Link } from 'react-router-dom';
import nativeStorage from '@/utils/nativeStorage';
import { useRefAppIdEffect } from "./private/check-params";
import '../css/index.css'
import { useNavigate } from 'react-router-dom';
import { getRouteParams } from "zmp-sdk/apis";

register();
interface AppSetting {
    app_name: string;
    description?: string;
    logo_path: string;
    favicon_path?: string;
}

interface User {
    id: number;
    full_name: string;
    avatar?: string;
    app_id?: string;
    [key: string]: any; // để tránh lỗi nếu có thêm field
}

interface Product {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
    sale_price: number;
    stock: number;
    category_id?: number;
}

interface Article {
    id: number;
    slug: string;
    title: string;
    image: string;
}

interface Banner {
    id: number;
    image: string;
    link: string;
    title: string;
}

interface MenuItem {
    id: number;
    title: string;
    link: string;
    image?: string;
}

interface ReferrerUser {
    id: number;
    name: string;
    avatar_url?: string;
    total_sales: number;
}



const primaryColor = '#152379';
const handleAddToCart = async (productId) => {
    try {
        const res = await axios.get(`${API_URL}/check-stock/${productId}`);

        const product = res.data.product;
        const savedCart = nativeStorage.getItem('cart') || localStorage.getItem('cart');
        const currentCart = savedCart ? JSON.parse(savedCart) : [];

        const newCart = [...currentCart];
        const index = newCart.findIndex((item) => item.id === productId);

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
        nativeStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event("cart-updated"));
        toast.success('Đã thêm vào giỏ hàng');
    } catch (err) {
        const message = 'Thêm vào giỏ thất bại';
        toast.error(message);
    }
};

const shareProduct = (name, link) => {
    const shareData = {
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

const ClientHomePage = () => {
    const navigate = useNavigate();
    useRefAppIdEffect();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [menu1, setMenu] = useState<MenuItem[]>([]);
    const [finalTop, setFinalTop] = useState<ReferrerUser[]>([]);
    const [appSetting, setAppSetting] = useState<AppSetting | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const fetchData = async () => {
        try {
            const { ref, app_id } = await getRouteParams();
            console.log("ZMP SDK route params:", { ref, app_id });
            if (ref) nativeStorage.setItem("referrer_id", ref);
            if (app_id) nativeStorage.setItem("app_id", app_id);
        } catch (err) {
            console.error("Lỗi khi lấy getRouteParams:", err);
        }
        const token = nativeStorage.getItem('access_token') || localStorage.getItem('access_token');
        const app_id = nativeStorage.getItem('app_id');
        console.log('app_id', app_id);

        axios.get(`${API_URL}/index`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            },
            params: app_id ? { app_id } : undefined

        })
            .then(response => {
                const { appSetting, banners, user, products, topProducts, menu1, articles, finalTop } = response.data;
                setBanners(banners);
                setTopProducts(topProducts);
                setArticles(articles);
                setProducts(products);
                setAppSetting(appSetting);
                setUser(user);
                setMenu(menu1);
                setFinalTop(finalTop);

            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
                navigate('/home');
            });
    };

    useEffect(() => {
        const footer = document.getElementById("footer");
        if (footer) {
            footer.style.display = "block";
        }
        // if (window.zaloMiniApp) {
        //   window.zaloMiniApp.onPullToRefresh(() => {
        //     console.log('Người dùng kéo để reload');
        //     fetchData();
        //     window.zaloMiniApp.stopPullToRefresh();
        //   });
        // }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (banners.length > 0) {
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
        // if (topProducts.length > 0) {
        const topProductsSwiper = new Swiper('.topProductsSwiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 10,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });

        return () => topProductsSwiper.destroy();
        // }
    }, [topProducts]);

    useEffect(() => {
        if (articles.length > 0) {
            const articlesSwiper = new Swiper('.articlesSwiper', {
                loop: true,
                slidesPerView: 1.1,
                spaceBetween: 10,
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
            });

            return () => articlesSwiper.destroy();
        }
    }, [articles]);

    useEffect(() => {
        if (products.length > 0) {
            const suggestedSwiper = new Swiper('.suggestedProductsSwiper', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 10,
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
            });

            return () => suggestedSwiper.destroy();
        }
    }, [products]);

    useEffect(() => {
        const swiperEl = document.querySelector('swiper-container');;
        if (swiperEl) {
            Object.assign(swiperEl, {
                loop: true,
                slidesPerView: 2,
                spaceBetween: 20,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
            });

            swiperEl.initialize();
        }
    })
    useEffect(() => {
        if (appSetting) {
            document.title = appSetting.app_name;

            const metaTags = [
                { property: "og:type", content: "website" },
                { property: "og:site_name", content: appSetting.app_name },
                { property: "og:description", content: appSetting.description ?? appSetting.app_name },
                { property: "og:image", content: `${getImageUrl(appSetting.logo_path)}` },
            ];

            metaTags.forEach(({ property, content }) => {
                let tag = document.querySelector(`meta[property='${property}']`);
                if (!tag) {
                    tag = document.createElement("meta");
                    tag.setAttribute("property", property);
                    document.head.appendChild(tag);
                }
                tag.setAttribute("content", content);
            });
            // Cập nhật favicon
            let favicon = document.querySelector("link[rel='icon']");
            if (!favicon) {
                favicon = document.createElement("link");
                favicon.setAttribute("rel", "icon");
                favicon.setAttribute("type", "image/x-icon");
                document.head.appendChild(favicon);
            }
            favicon.setAttribute("href", `${getImageUrl(appSetting.favicon_path ?? '')}`);
        }
    }, [appSetting]);


    return (
        <div style={{ overflow: 'auto', marginBottom: '80px' }}>
            <div style={{ position: 'relative' }}>
                <div className="background"></div>
                <div className="header" style={{ position: 'absolute' }}>
                    <div
                        className="logo-top d-flex align-items-center gap-3"
                        style={{ position: 'absolute', top: '50px', left: '20px' }}
                    >
                        <img
                            src={`${getImageUrl(appSetting?.favicon_path ?? '')}`}
                            alt=""
                            style={{
                                background: 'white',
                                borderRadius: '50%',
                                height: '70px'
                            }}
                        />
                        <span className="text-white fs-3 fw-bold text-uppercase text-nowrap">
                            {appSetting?.app_name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '130px', margin: 'auto' }}>
                {/* Box tài khoản */}
                <div className="wallet-box p-3 rounded-4 shadow-sm" style={{ position: 'relative' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div style={{ color: '#152379' }}>
                            <p className="mb-1 fw-semibold">Tài khoản xác thực</p>
                            <p className="mb-0 fw-light small">Thành viên mới</p>
                        </div>
                        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                            <div style={{ color: '#152379', textAlign: 'right' }}>
                                <p className="mb-1 fw-light small">Xin chào,</p>
                                <p className="mb-0 fw-semibold text-uppercase">{user?.full_name}</p>
                            </div>
                            <div style={{ width: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ccc' }}>
                                <Link to={`/referrer?ref=${user?.id ?? ''}&app_id=${user?.app_id}`} className="text-decoration-none">
                                    <img
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
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-between">
                        <Link to="/agency" className="text-decoration-none">
                            <div className="ml-3 d-flex flex-column align-items-center">
                                <div className="fw-bold fs-1" style={{ color: '#152379' }}>
                                    <i className="fas fa-medal"></i>
                                </div>
                                <small className="text-muted">Tích điểm</small>
                            </div>
                        </Link>

                        <Link to="/order-history" className="text-decoration-none">
                            <div className="ml-3 d-flex flex-column align-items-center">
                                <div className="fw-bold fs-1" style={{ color: '#152379' }}>
                                    <i className="fas fa-cart-arrow-down"></i>
                                </div>
                                <small className="text-muted">Đơn hàng</small>
                            </div>
                        </Link>

                        <Link to="/chatAI" className="text-decoration-none">
                            <div className="ml-3 d-flex flex-column align-items-center">
                                <div className="fw-bold fs-1" style={{ color: '#152379' }}>
                                    {/* <i className="fas fa-comments"></i> */}
                                    <i className="fas fa-headphones"></i>
                                </div>
                                <small className="text-muted">Chat AI</small>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Danh sách menu */}
                {/* <div className="wallet-box p-3 rounded-4 shadow-sm mt-3">
          <div className="text-decoration-none d-flex justify-content-start gap-4">
            {menu1?.map((menu) => (
              <a key={menu.id} href={menu.link} className="text-decoration-none">
                <div className="ml-3 d-flex flex-column align-items-center">
                  <div
                    style={{
                      width: '48px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '1px solid #ccc'
                    }}
                  >
                    <img
                      src={`${getImageUrl(menu.image || AppSetting?.logo_path)}`}
                      alt={menu.title}
                      className="img-fluid"
                    />
                  </div>
                  <small className="text-muted mt-2 text-uppercase fw-bold">
                    {menu.title}
                  </small>
                </div>
              </a>
            ))}
          </div>
        </div> */}

                {/* Swiper banners (placeholder) */}
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

                {/* Top cộng tác viên */}
                {finalTop.length > 0 && (
                    <>
                        <div className="d-flex justify-content-between align-items-end mt-4">
                            <span className="fw-bold fs-4" style={{ color: "#152379" }}>Top thu nhập cao nhất</span>
                        </div>
                        <swiper-container class="topReferrersSwiper" init="false">
                            {finalTop.map((user, index) => (
                                <swiper-slide key={user.id}>
                                    <img
                                        src={
                                            user.avatar_url
                                                ? user.avatar_url.startsWith('http')
                                                    ? user.avatar_url
                                                    : getImageUrl(user.avatar_url)
                                                : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                                        }
                                        alt={user.name}
                                        className="avatar"
                                    />

                                    <div className="top-badge">
                                        {index === 0 && <span className="badge bg-warning text-dark">TOP 1</span>}
                                        {index === 1 && <span className="badge bg-secondary text-white">TOP 2</span>}
                                        {index === 2 && <span className="badge bg-muted text-dark">TOP 3</span>}
                                        {index > 2 && <span className="badge bg-light text-dark">TOP {index + 1}</span>}
                                    </div>
                                    <div className="name text-center">{user.name}</div>
                                    <div className="sales text-center">
                                        {Number(user.total_sales).toLocaleString('vi-VN')}₫
                                    </div>
                                </swiper-slide>
                            ))}
                        </swiper-container>
                    </>
                )}
                {topProducts.length > 0 && (
                    <>
                        {/* Sản phẩm bán chạy */}
                        <div className="d-flex justify-content-between align-items-end mt-3">
                            <span className="fw-bold fs-4" style={{ color: "#152379" }}>Sản phẩm bán chạy</span>
                            {/* <a href="/products" className="text-decoration-none" style={{ color: "#ccc" }}>Xem thêm</a> */}
                        </div>

                        <div className="swiper topProductsSwiper mySwiper mt-2">
                            <div className="swiper-wrapper">
                                {topProducts.map(product => (
                                    <div className="swiper-slide pad-10" key={product.id}>
                                        <div className="product-card p-2 rounded-3 shadow-sm bg-white">
                                            <Link to={`/productDetail/${product.slug}`}>
                                                {/* <img src={`${getImageUrl(product.thumbnail)}`} className="w-100 rounded-2 mb-2 img-product" alt="" style={{ height: 300, objectFit: "contain" }} /> */}
                                                <img src={`${getImageUrl(product.thumbnail)}`} className="w-100 rounded-2 mb-2 img-product" />
                                            </Link>
                                            {product.stock === 0 && (
                                                <div className="top-badge">
                                                    <span className="badge bg-danger">Hết hàng</span>
                                                </div>
                                            )}
                                            <div className="small text-dark fw-medium">{product.name}</div>
                                            <div>
                                                <p className="text-danger">
                                                    {product.price && (
                                                        <span className="text-secondary text-decoration-line-through mb-1" style={{ marginRight: 10 }}>
                                                            {Number(product.price).toLocaleString('vi-VN')} VND
                                                        </span>
                                                    )}
                                                    <span className="fw-bold fs-5">{Number(product.sale_price ?? 0).toLocaleString('vi-VN')} VND</span>
                                                </p>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-1">
                                                <p onClick={() => handleAddToCart(product.id)} className='btn btn-primary' style={{ background: primaryColor }}>Thêm vào giỏ hàng</p>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}


                {/* Tin tức */}
                {articles.length > 0 && (
                    <>
                        <div className="d-flex justify-content-between align-items-end mt-4">
                            <span className="fw-bold fs-4" style={{ color: "#152379" }}>Tin tức</span>
                        </div>
                        <div className="swiper articlesSwiper mySwiper mt-2">
                            <div className="swiper-wrapper">
                                {articles.map(article => (
                                    <div className="swiper-slide" key={article.id}>
                                        <Link to={`/articleDetail/${article.slug}`}>
                                            <img
                                                src={`${getImageUrl(article.image)}`}
                                                className="w-100 rounded-4 mb-2"
                                                style={{ height: 200, objectFit: "cover" }}
                                                alt={article.title}
                                            />
                                        </Link>
                                        <h5 className="text-dark fw-bold">{article.title}</h5>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {/* Gợi ý cho bạn */}
                {products.length > 0 && (
                    <>
                        <div className="d-flex justify-content-between align-items-end mt-4">
                            <span className="fw-bold fs-4" style={{ color: "#152379" }}>Gợi ý cho bạn</span>
                            <Link to="/all-products" className="text-decoration-none" style={{ color: "#ccc" }}>Xem thêm</Link>
                        </div>
                        <div className="swiper suggestedProductsSwiper mySwiper mt-2">
                            <div className="swiper-wrapper">
                                {products.map(product => (
                                    <div className="swiper-slide pad-10" key={product.id}>
                                        <div className="product-card p-2 rounded-3 shadow-sm bg-white">
                                            <Link to={`/productDetail/${product.slug}`}>
                                                {/* <img src={`${getImageUrl(product.thumbnail)}`} className="w-100 rounded-2 mb-2 img-product" alt={product.name} style={{ height: 300, objectFit: "contain" }} /> */}
                                                <img src={`${getImageUrl(product.thumbnail)}`} className="w-100 rounded-2 mb-2 img-product" />
                                            </Link>
                                            {product.stock === 0 && (
                                                <div className="top-badge">
                                                    <span className="badge bg-danger">Hết hàng</span>
                                                </div>
                                            )}
                                            <div className="small text-dark fw-medium">{product.name}</div>
                                            <div>
                                                <p className="text-danger">
                                                    {product.price && (
                                                        <span className="text-secondary text-decoration-line-through mb-1" style={{ marginRight: 10 }}>
                                                            {Number(product.price).toLocaleString('vi-VN')} VND
                                                        </span>
                                                    )}
                                                    <span className="fw-bold fs-5">{Number(product.sale_price ?? 0).toLocaleString('vi-VN')} VND</span>
                                                </p>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-1">
                                                <p onClick={() => handleAddToCart(product.id)} className='btn btn-primary' style={{ background: primaryColor }}>Thêm vào giỏ hàng</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientHomePage;

