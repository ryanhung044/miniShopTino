// import nativeStorage from "@/utils/nativeStorage";
// import { useEffect } from "react";
// import { getRouteParams } from "zmp-sdk/apis";

// export const useRefAppIdEffect = () => {
//   useEffect(() => {
//     const { ref, appId } = getRouteParams();
//     // console.log('getRouteParams' , appId);
    

//     if (ref) nativeStorage.setItem("referrer_id", ref);
//     if (appId) nativeStorage.setItem("app_id", '1');
//   }, []);
// };
import nativeStorage from "@/utils/nativeStorage";
import { useEffect } from "react";
// import { getRouteParams } from "zmp-sdk/apis";
import zmp from "zmp-sdk";


export const useRefAppIdEffect = () => {
  useEffect(() => {
    const getParams = async () => {
      try {
        const { ref, appId } = await (zmp as any).getRouteParams();
        console.log("ZMP SDK route params:", { ref, appId });
        if (ref) nativeStorage.setItem("referrer_id", ref);
        if (appId) nativeStorage.setItem("app_id", appId);
      } catch (err) {
        console.error("Lỗi khi lấy getRouteParams:", err);
      }
    };

    getParams();
  }, []);
};
