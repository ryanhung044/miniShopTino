import React, { FC, useEffect, useState } from "react";
import { Box, Header, Icon, Page, Text } from "zmp-ui";
// import subscriptionDecor from "./static/subscription-decor.svg";
import { ListRenderer } from "./list-renderer";
// import { useToBeImplemented } from "hooks";
import { useRecoilCallback } from "recoil";
// import { userState } from "./state";
import { useNavigate } from "react-router-dom";
import { createShortcut } from "zmp-sdk/apis";
import axios from "axios";
import { API_URL } from "../config";
// import { userState } from "./state";
const createMiniAppShortcut = async () => {
  try {
    await createShortcut({
      params: {
        utm_source: "shortcut",
      },
    });
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};
const Subscription: FC = () => {
  const requestUserInfo = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const userInfo = await snapshot.getPromise(userState);
        console.warn("Các bên tích hợp có thể sử dụng userInfo ở đây...", {
          userInfo,
        });
      },
    []
  );

  return (
    <Box className="m-4 " onClick={requestUserInfo} style={{ paddingTop: '4rem' }}>
      <Box
        className="bg-green text-white rounded-xl p-4 space-y-2"
        style={{
          // backgroundImage: `url(${subscriptionDecor})`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Text.Title className="font-bold">Đăng ký thành viên</Text.Title>
        <Text size="xxSmall">Tích điểm đổi thưởng, mở rộng tiện ích</Text>
      </Box>
    </Box>
  );
};

const Personal: FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Cá nhân"
        items={[
          {
            left: <i className="fas fa-user text-primary" style={{ fontSize: '1.2rem' }}></i>,
            right: (
              <Box flex onClick={() => navigate("/account-info")}>
                <Text.Header className="flex-1 items-center font-normal">
                  Thông tin tài khoản
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <i className="fas fa-clock text-primary" style={{ fontSize: '1.2rem' }}></i>,
            right: (
              <Box flex onClick={() => navigate("/order-history")}>
                <Text.Header className="flex-1 items-center font-normal">
                  Lịch sử đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const Other: FC = () => {
  const navigate = useNavigate();
  const [withdrawEnabled, setWithdrawEnabled] = useState(false);

  useEffect(() => {
    axios
      .get(API_URL + "/config/withdraw")
      .then((res) => {
        setWithdrawEnabled(res.data.withdraw_enabled);
      })
      .catch(() => {
        setWithdrawEnabled(false);
      });
  }, []);

  const items = [
    {
      left: <i className="fas fa-headset text-primary" style={{ fontSize: '1.2rem' }}></i>,
      right: (
        <Box flex onClick={() => navigate("/chatAI")}>
          <Text.Header className="flex-1 items-center font-normal">Chat GPT</Text.Header>
          <Icon icon="zi-chevron-right" />
        </Box>
      ),
    },
    {
      left: <i className="fas fa-robot text-primary" style={{ fontSize: '1.2rem' }}></i>,
      right: (
        <Box flex onClick={() => navigate("/contentAI")}>
          <Text.Header className="flex-1 items-center font-normal">Tạo nội dung từ AI</Text.Header>
          <Icon icon="zi-chevron-right" />
        </Box>
      ),
    },
    ...(withdrawEnabled
      ? [
        {
          left: <i className="fas fa-credit-card text-primary" style={{ fontSize: '1.2rem' }}></i>,
          right: (
            <Box flex onClick={() => navigate("/bank-info")}>
              <Text.Header className="flex-1 items-center font-normal">Thẻ thanh toán</Text.Header>
              <Icon icon="zi-chevron-right" />
            </Box>
          ),
        },
      ]
      : []),
    ...(withdrawEnabled
      ? [
        {
          left: <i className="fas fa-money-bill-wave text-primary" style={{ fontSize: '1.2rem' }} />,
          right: (
            <Box flex onClick={() => navigate("/with-draw")}>
              <Text.Header className="flex-1 items-center font-normal">Yêu cầu rút tiền</Text.Header>
              <Icon icon="zi-chevron-right" />
            </Box>
          ),
        },
      ]
      : []),
    {
      left: <i className="fa-brands fa-app-store-ios text-primary" style={{ fontSize: '1.2rem' }} />,
      right: (
        <Box flex onClick={() => createMiniAppShortcut()}>
          <Text.Header className="flex-1 items-center font-normal">Tạo icon app trên màn hình chính</Text.Header>
          <Icon icon="zi-chevron-right" />
        </Box>
      ),
    },
  ];

  return (
    <Box className="m-4">
      <ListRenderer
        title="Khác"
        items={items}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};


const ProfilePage: FC = () => {
  useEffect(() => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.style.display = "block";
    }
  }, []);
  return (
    <Page style={{ overflow: 'auto', paddingBottom: '80px' }}>
      <Header showBackIcon={true} title="Thông tin tài khoản" />
      <Subscription />
      <Personal />
      <Other />
    </Page>
  );
};

export default ProfilePage;
