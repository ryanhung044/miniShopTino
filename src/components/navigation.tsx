import { MenuItem } from "@/types/menu";
import nativeStorage from "@/utils/nativeStorage";
import React, { FC, useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";

const tabs: Record<string, MenuItem> = {
  "/": {
    label: "Trang chủ",
    icon: "fa-home",
  },
  "/all-products": {
    label: "Sản phẩm",
    icon: "fa-box",
  },
  "/cart2": {
    label: "Giỏ hàng",
    icon: "fa-shopping-cart",
  },
  "/agency": {
    label: "Đại lý",
    icon: "fa-id-badge",
  },
  "/c-profile": {
    label: "Cá nhân",
    icon: "fa-user",
  },
};

const NO_BOTTOM_NAVIGATION_PAGES = ["/search", "/category", "/result"];

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  const [cartQuantity, setCartQuantity] = useState<number>(0);

  useEffect(() => {
    const updateCart = () => {
      const cart = nativeStorage.getItem("cart") || localStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];
      const totalQuantity = cartItems.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );
      setCartQuantity(totalQuantity);
    };

    updateCart();

    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, []);

  if (noBottomNav) return null;

  return (
    <nav className="navbar fixed-bottom navbar-light bg-light border-top shadow-sm">
      <div className="container-fluid d-flex justify-content-around text-center">
        {Object.entries(tabs).map(([path, tab]) => {
          const isActive = location.pathname === path;
          const isCart = path === "/cart2";

          return (
            <Link
              key={path}
              to={path}
              className={`nav-item text-decoration-none ${
                isActive ? "text-primary fw-bold" : "text-secondary"
              }`}
            >
              <div className="position-relative">
                <i className={`fas ${tab.icon}`}></i>
                {isCart && cartQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartQuantity > 99 ? "99+" : cartQuantity}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.75rem" }}>{tab.label}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
