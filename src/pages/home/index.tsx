import Banners from "./banners";
import BestSellerSection from "./best-sellers";
import Category from "./category";
import FlashSales from "./flash-sales";
import NewsSection from "./news";
import SubscribeBox from "./subscribe";

const HomePage: React.FunctionComponent = () => {
  return (
    <div className="min-h-full">
      {/* <Category /> */}
      {/* <div className="bg-section"> */}
      <Banners />
      <SubscribeBox />
      <BestSellerSection />
      <NewsSection />
      {/* </div> */}
      <FlashSales />
    </div>
  );
};

export default HomePage;
