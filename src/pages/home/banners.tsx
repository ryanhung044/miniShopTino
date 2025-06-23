import Carousel from "@/components/carousel";
import { useAtomValue } from "jotai";
import { bannersState } from "@/state";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faUsers, faGift, faHandshake, faM } from '@fortawesome/free-solid-svg-icons';

export default function Banners() {
  const banners = useAtomValue(bannersState);
  const features = [
    { icon: faGamepad, label: 'Mini game' },
    { icon: faUsers, label: 'Về chúng tôi' },
    { icon: faGift, label: 'Ưu đãi' },
    { icon: faHandshake, label: 'Cộng tác' },
    { icon: faM, label: 'Mini Form' },
    { icon: faM, label: 'Mini Form' },
    { icon: faM, label: 'Mini Form' },
    { icon: faM, label: 'Mini Form' },
  ];

  return (
    <div className="relative">
      {/* Banner */}
      <Carousel
        slides={banners.map((banner, index) => (
          <img key={index} className="w-full" src={banner} alt={`banner-${index}`} />
        ))}
      />

      {/* Nổi lên trên banner - dùng margin-top âm */}
      <div className="relative z-20 mt-[-40px] px-4">
        <div className="bg-white rounded-xl shadow-lg p-3 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-fit">
                <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center mb-1">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Khoảng cách an toàn phía dưới */}
      <div className="mt-4" />
    </div>
  );
}
