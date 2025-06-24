import React, { useEffect, useState } from "react";
import CONFIG from "@/config";
import { userInfoKeyState, userInfoState } from "@/state";
import { useAtomValue, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "zmp-ui";
import nativeStorage from "@/utils/nativeStorage";
import axios from "axios";
import { API_URL } from "../Client/config";

const ProfileEditorPage = () => {
  const navigate = useNavigate();
  const userInfo = useAtomValue(userInfoState);
  const setUserInfoKey = useSetAtom(userInfoKeyState);
  const refreshUserInfo = () => setUserInfoKey((key) => key + 1);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    avatar: null as File | null,
  });

  // ✅ Load dữ liệu user cũ từ API
  useEffect(() => {
    const token = nativeStorage.getItem("access_token");
    if (!token) return;

    axios
      .get(`${API_URL}/checkUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const dataUser = res.data.user;
        setFormData((prev) => ({
          ...prev,
          name: dataUser.name || "",
          phone: dataUser.phone || "",
          email: dataUser.email || "",
          address: dataUser.address || "",
        }));
      })
      .catch((err) => {
        console.error("Không thể lấy thông tin người dùng:", err);
        toast.error("Không thể tải thông tin người dùng");
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "avatar" && files) {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "avatar" && value instanceof File) {
        submitData.append("avatar", value);
      } else if (value !== null && value !== "") {
        submitData.append(key, value as string);
      }
    });

    try {
      const token = nativeStorage.getItem("access_token");

      const checkUserRes = await axios.get(`${API_URL}/checkUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = checkUserRes.data.user?.id;

      await axios.post(`${API_URL}/users/${userId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "X-HTTP-Method-Override": "PUT",
        },
      });

      toast.success("Cập nhật thông tin thành công!");

      // Lưu lại user mới vào localStorage
      const newUserInfo = { ...userInfo, ...formData };
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(newUserInfo));
      refreshUserInfo();
      navigate(-1);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <form className="h-full flex flex-col justify-between" onSubmit={handleSubmit}>
      <div className="bg-section p-4 grid gap-4">
        <Input
          name="full_name"
          label="Họ tên"
          value={formData.full_name}
          onChange={handleChange}
        />
        <Input
          name="phone"
          label="Số điện thoại"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          name="email"
          label="Email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="address"
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          value={formData.address}
          onChange={handleChange}
        />
        {/* <input
          type="file"
          name="avatar"
          onChange={handleChange}
          className="mt-2"
        /> */}
      </div>
      <div className="p-6 pt-4 bg-section">
        <Button htmlType="submit" fullWidth>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditorPage;
