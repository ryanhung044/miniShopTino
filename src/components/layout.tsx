import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Suspense } from "react";
import { PageSkeleton } from "./skeleton";
import { Toaster } from "react-hot-toast";
import { ScrollRestoration } from "./scroll-restoration";
import FloatingCartPreview from "./floating-cart-preview";

export default function Layout() {
  return (
    <div className="w-screen h-screen flex flex-col bg-section text-foreground">
      <Header />
      <div className="flex-1 overflow-y-auto bg-background">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <Toaster
        position="bottom-center" // 👈 vị trí toast mong muốn
        toastOptions={{
          duration: 1000,
          style: {
            background: '#212121',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
          },
        }}
      />
      <FloatingCartPreview />
      <ScrollRestoration />
    </div>
  );
}
