import React from 'react';
import { Link } from 'react-router-dom';

function AmbassadorCard() {
  return (
    <div className="container d-flex align-items-center justify-content-center mt-2 h-100">
      <div
        className="card p-4 shadow-sm rounded-4"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h5 className="mb-3 fw-bold">Đại sứ kết nối</h5>
        <h2 className="mb-3 fw-bold fs-1" style={{ color: '#152379' }}>
          1.000.000đ
        </h2>
        <p className="text-muted mb-4">
          Để hưởng những quyền lợi của đại sứ kết nối
        </p>

        <Link
          to="/all-products?category_id=2"
          className="btn btn-success rounded-pill mb-3 px-4"
          style={{ background: '#152379' }}
        >
          Tiếp tục đăng ký
        </Link>

        <div className="text-center" style={{ width: '100%' }}>
          <Link
            to="/agency"
            className="text-primary small text-decoration-underline"
          >
            Bỏ qua
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AmbassadorCard;
