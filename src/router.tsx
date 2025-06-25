import Layout from "@/components/layout";
import CartPage from "@/pages/cart";
import CategoryDetailPage from "@/pages/catalog/category-detail";
import CategoryListPage from "@/pages/catalog/category-list";
import ProductDetailPage from "@/pages/catalog/product-detail";
import HomePage from "@/pages/home";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/search";
import { createBrowserRouter } from "react-router-dom";
import { getBasePath } from "@/utils/zma";
import OrdersPage from "./pages/orders";
import ShippingAddressPage from "./pages/cart/shipping-address";
import StationsPage from "./pages/cart/stations";
import OrderDetailPage from "./pages/orders/detail";
import ProfileEditorPage from "./pages/profile/editor";
import ClientHomePage from "./pages/Client/homepage/homepage";
import ListProduct from "./pages/Client/product/listProduct";
import LoginForm from "./pages/Client/LoginForm/login";
import ProductDetailPage2 from "./pages/Client/product/productDetail";
import CartPage2 from "./pages/Client/cart/cartpage";
import OrderHistory from "./pages/Client/order/orderHistory";
import OrderHistoryAffilate from "./pages/Client/order/orderHistoryAffilate";
import AgencyPage from "./pages/Client/agency/agencyPage";
import Referral from "./pages/Client/agency/referrer";
import AmbassadorPage from "./pages/Client/ambassador/ambassadorPage";
import MemberPage from "./pages/Client/member/memberPage";
import CProfilePage from "./pages/Client/profilepage/profile";
import ArticleDetail from "./pages/Client/article/ArticleDetail";
import WithdrawRequest from "./pages/Client/withdrawrequest/WithdrawRequest";
import Infor from "./pages/Client/edituserform/infor";
import ChatAI from "./pages/Client/chatai/chatAI";
import ChatContentAI from "./pages/Client/chatai/chatContentAI";
import BankInfoForm from "./pages/Client/bankinfoform/BankInfoForm";
import PrivateRoute from "./PrivateRoute";
import SignupPage from "./pages/Client/LoginForm/signup";
import ClientLayout from "./ClientLayout";

const withClientLayout = (component: JSX.Element) => (
  <ClientLayout>{component}</ClientLayout>
);

const withPrivateClientLayout = (component: JSX.Element) => (
  <PrivateRoute>
    <ClientLayout>{component}</ClientLayout>
  </PrivateRoute>
);

// const router = createBrowserRouter(
//   [
//     {
//       path: "/home2",
//       element: withClientLayout(<ClientHomePage />),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/all-products",
//       element: <ListProduct />,
//       handle: {
//         search: true,
//         title: "Danh mục",
//         noFooter: true,
//       },
//     }, {
//       path: "/login",
//       element: <LoginForm />,
//       handle: {
//         search: true,
//         title: "Đăng nhập",
//         noFooter: true,
//       },
//     }, {
//       path: "/signup",
//       element: <SignupPage />,
//       handle: {
//         search: true,
//         title: "Đăng nhập",
//         noFooter: true,
//       },
//     }, {
//       path: "/productDetail/:slug",
//       element: <ProductDetailPage2 />,
//       handle: {
//         search: true,
//         title: "Chi tiết sản phẩm",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/cart2",
//       element: (
//         <PrivateRoute>
//           <CartPage2 />
//         </PrivateRoute>
//       ),
//       handle: {
//         search: true,
//         title: "Giỏ hàng",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/order-history",
//       element: (
//         <PrivateRoute>
//           <OrderHistory />
//         </PrivateRoute>
//       ),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/orders/history/affiliate",
//       element:
//         (
//           <PrivateRoute>
//             <OrderHistoryAffilate />
//           </PrivateRoute>
//         ),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/agency",
//       element:
//         (
//           <PrivateRoute>
//             <AgencyPage />
//           </PrivateRoute>
//         ),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/referrer",
//       element: <Referral />,
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/ambassador",
//       element:
//         (
//           <PrivateRoute>
//             <AmbassadorPage />
//           </PrivateRoute>
//         ),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/users/member",
//       element:

//         (
//           <PrivateRoute>
//             <MemberPage />
//           </PrivateRoute>
//         ),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },
//     {
//       path: "/c-profile",
//       element: (
//         <PrivateRoute>
//           <CProfilePage />
//         </PrivateRoute>
//       ),
//       handle: {
//         search: true,
//         title: "Trang chủ",
//         noFooter: true,
//       },
//     },

//     {
//       path: "/",
//       element: <Layout />,
//       children: [
//         {
//           path: "/",
//           element: <HomePage />,
//           handle: {
//             logo: true,
//             search: true,
//           },
//         },
//         {
//           path: "/categories",
//           element: <CategoryListPage />,
//           handle: {
//             title: "Danh mục",
//             noBack: true,
//           },
//         },
//         {
//           path: "/orders/:status?",
//           element: <OrdersPage />,
//           handle: {
//             title: "Đơn hàng",
//           },
//         },
//         {
//           path: "/order/:id",
//           element: <OrderDetailPage />,
//           handle: {
//             title: "Thông tin đơn hàng",
//           },
//         },
//         {
//           path: "/cart",
//           element: <CartPage />,
//           handle: {
//             title: "Giỏ hàng",
//             noBack: true,
//             noFloatingCart: true,
//           },
//         },
//         {
//           path: "/shipping-address",
//           element: <ShippingAddressPage />,
//           handle: {
//             title: "Địa chỉ nhận hàng",
//             noFooter: true,
//             noFloatingCart: true,
//           },
//         },
//         {
//           path: "/stations",
//           element: <StationsPage />,
//           handle: {
//             title: "Điểm nhận hàng",
//             noFooter: true,
//           },
//         },
//         {
//           path: "/profile",
//           element: <ProfilePage />,
//           handle: {
//             logo: true,
//           },
//         },
//         {
//           path: "/profile/edit",
//           element: <ProfileEditorPage />,
//           handle: {
//             title: "Thông tin tài khoản",
//             noFooter: true,
//             noFloatingCart: true,
//           },
//         },
//         {
//           path: "/category/:id",
//           element: <CategoryDetailPage />,
//           handle: {
//             search: true,
//             title: ({ categories, params }) =>
//               categories.find((c) => String(c.id) === params.id)?.name,
//           },
//         },
//         {
//           path: "/product/:id",
//           element: <ProductDetailPage />,
//           handle: {
//             scrollRestoration: 0, // when user selects another product in related products, scroll to the top of the page
//             noFloatingCart: true,
//           },
//         },
//         {
//           path: "/search",
//           element: <SearchPage />,
//           handle: {
//             search: true,
//             title: "Tìm kiếm",
//             noFooter: true,
//           },
//         },
//       ],
//     },
//   ],
//   { basename: getBasePath() }
// );
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: withClientLayout(<ClientHomePage />),
      handle: {
        search: true,
        title: "Trang chủ",
        noFooter: true,
      },
    },
    {
      path: "/all-products",
      element: withClientLayout(<ListProduct />),
      handle: {
        search: true,
        title: "Danh mục",
        noFooter: true,
      },
    },
    {
      path: "/login",
      element: withClientLayout(<LoginForm />),
      handle: {
        search: true,
        title: "Đăng nhập",
        noFooter: true,
      },
    },
    {
      path: "/signup",
      element: withClientLayout(<SignupPage />),
      handle: {
        search: true,
        title: "Đăng ký",
        noFooter: true,
      },
    },
    {
      path: "/productDetail/:slug",
      element: withClientLayout(<ProductDetailPage2 />),
      handle: {
        search: true,
        title: "Chi tiết sản phẩm",
        noFooter: true,
      },
    },
    {
      path: "/cart2",
      element: withPrivateClientLayout(<CartPage2 />),
      handle: {
        search: true,
        title: "Giỏ hàng",
        noFooter: true,
      },
    },
    {
      path: "/order-history",
      element: withPrivateClientLayout(<OrderHistory />),
      handle: {
        search: true,
        title: "Lịch sử đơn hàng",
        noFooter: true,
      },
    },
    {
      path: "/orders/history/affiliate",
      element: withPrivateClientLayout(<OrderHistoryAffilate />),
      handle: {
        search: true,
        title: "Đơn hàng cộng tác viên",
        noFooter: true,
      },
    },
    {
      path: "/agency",
      element: withPrivateClientLayout(<AgencyPage />),
      handle: {
        search: true,
        title: "Đại lý",
        noFooter: true,
      },
    },
    {
      path: "/referrer",
      element: withClientLayout(<Referral />), // Không cần login
      handle: {
        search: true,
        title: "Người giới thiệu",
        noFooter: true,
      },
    },
    {
      path: "/ambassador",
      element: withPrivateClientLayout(<AmbassadorPage />),
      handle: {
        search: true,
        title: "Đại sứ thương hiệu",
        noFooter: true,
      },
    },
    {
      path: "/users/member",
      element: withPrivateClientLayout(<MemberPage />),
      handle: {
        search: true,
        title: "Thành viên",
        noFooter: true,
      },
    },
    {
      path: "/c-profile",
      element: withPrivateClientLayout(<CProfilePage />),
      handle: {
        search: true,
        title: "Tài khoản của tôi",
        noFooter: true,
      },
    },
    {
      path: "/account-info",
      element: withPrivateClientLayout(<ProfileEditorPage />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    // lỗi api * chưa có api 
     {
      path: "/articleDetail/:slug",
      element: withPrivateClientLayout(<ArticleDetail />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    {
      path: "/c-account-info",
      element: withPrivateClientLayout(<Infor />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    {
      path: "/with-draw",
      element: withPrivateClientLayout(<WithdrawRequest />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    {
      path: "/bank-info",
      element: withPrivateClientLayout(<BankInfoForm />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    {
      path: "/chatAI",
      element: withPrivateClientLayout(<ChatAI />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    {
      path: "/contentAI",
      element: withPrivateClientLayout(<ChatContentAI />),
      handle: {
        search: true,
        title: "Thay đổi thông tin",
        noFooter: true,
      },
    },
    
    // Các route khác (admin/shop) giữ nguyên, ví dụ:
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home",
          element: <HomePage />,
          handle: {
            logo: true,
            search: true,
          },
        },
        {
          path: "/categories",
          element: <CategoryListPage />,
          handle: {
            title: "Danh mục",
            noBack: true,
          },
        },
        {
          path: "/orders/:status?",
          element: <OrdersPage />,
          handle: {
            title: "Đơn hàng",
          },
        },
        {
          path: "/order/:id",
          element: <OrderDetailPage />,
          handle: {
            title: "Thông tin đơn hàng",
          },
        },
        {
          path: "/cart",
          element: <CartPage />,
          handle: {
            title: "Giỏ hàng",
            noBack: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/shipping-address",
          element: <ShippingAddressPage />,
          handle: {
            title: "Địa chỉ nhận hàng",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/stations",
          element: <StationsPage />,
          handle: {
            title: "Điểm nhận hàng",
            noFooter: true,
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/profile/edit",
          element: <ProfileEditorPage />,
          handle: {
            title: "Thông tin tài khoản",
            noFooter: true,
            noFloatingCart: true,
          },
        },
        {
          path: "/category/:id",
          element: <CategoryDetailPage />,
          handle: {
            search: true,
            title: ({ categories, params }) =>
              categories.find((c) => String(c.id) === params.id)?.name,
          },
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
          handle: {
            scrollRestoration: 0,
            noFloatingCart: true,
          },
        },
        {
          path: "/search",
          element: <SearchPage />,
          handle: {
            search: true,
            title: "Tìm kiếm",
            noFooter: true,
          },
        },
      ],
    },
  ],
  { basename: getBasePath() }
);

export default router;
