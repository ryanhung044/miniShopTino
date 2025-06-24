import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { API_URL, getImageUrl } from '../config';
import { Header } from 'zmp-ui';
// import { nativeStorage } from 'zmp-sdk/apis';
import nativeStorage from '@/utils/nativeStorage';

type Member = {
    id: number;
    name: string;
    phone: string;
    avatar: string;
    joined_at: string;
    level: string;
    total_members?: number;
    branch_count?: number;
    personal_sales?: number;
    personal_sales_completed?: number;
    commission?: number;
};

const MemberList: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = nativeStorage.getItem('access_token');
                const res = await axios.get(`${API_URL}/members?q=${query}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });

                setMembers(res.data.members);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách thành viên:', err);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchMembers();
        }, 500); // debounce search

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="container mt-4" style={{ overflow: 'auto', paddingTop: '80px' }}>
            <Header title="Danh sách thành viên" showBackIcon={true} />
            {/* <h5 className="fw-bold mb-3">Danh sách thành viên</h5> */}

            <div className="mb-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="form-control"
                    placeholder="Nhập tên, SĐT hoặc ID thành viên"
                />
            </div>

            {members.map((member) => (
                <div className="member-card d-flex" key={member.id} style={cardStyle}>
                    <img
                        // src={`${getImageUrl(member.avatar)}`}
                        src={
                            member?.avatar
                                ? member.avatar.startsWith('http://') || member.avatar.startsWith('https://')
                                    ? member.avatar
                                    : getImageUrl(member.avatar)
                                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
                        }
                        alt="Avatar"
                        style={avatarStyle}
                    />
                    <div className="member-info flex-grow-1" style={{ marginLeft: '10px' }}>
                        <div className="d-flex justify-content-between">
                            <div>
                                <strong>{member.name}</strong> - {member.phone}
                            </div>
                            <div className="text-end">
                                <span className="badge bg-warning text-dark">Hệ cấp: {member.level}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                            {/* <div className="text-success">Hạng: Thành viên mới</div> */}
                            <div className="text-muted small">
                                Ngày tham gia: {format(new Date(member.joined_at), 'dd/MM/yyyy')}
                            </div>
                        </div>
                        {/* <StatRow label="Tổng thành viên" value={member.total_members ?? 0} />
                        <StatRow label="Số lượng nhánh" value={member.branch_count ?? 0} /> */}
                        <StatRow label="Doanh thu cá nhân" value={member.personal_sales ? Number(member.personal_sales).toLocaleString('vi-VN') + 'đ' : '0đ'} />
                        <StatRow label="Doanh số cá nhân" value={member.personal_sales_completed ? Number(member.personal_sales_completed).toLocaleString('vi-VN') + 'đ' : '0đ'} />
                        <StatRow label="Hoa hồng" value={member.commission ? Number(member.commission).toLocaleString('vi-VN') + 'đ' : '0đ'} />
                    </div>
                </div>
            ))}
        </div>
    );
};

const StatRow = ({ label, value }: { label: string; value: number | string }) => (
    <div className="stat-row d-flex justify-content-between" style={{ fontSize: '14px', marginTop: '5px' }}>
        <div>{label}</div>
        <div>{value}</div>
    </div>
);

const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    background: '#fff',
    position: 'relative',
};

const avatarStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '50%',
};

export default MemberList;
