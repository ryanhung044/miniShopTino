import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
// import './ArticleDetailPage.css';
import { API_URL, APP_URL, getImageUrl }  from '../config';
import { Header } from 'zmp-ui';

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  slug: string;
  created_at: string;
}
const shareProduct = (name, link) => {
  const shareData = {
    // title: name,
    // text: `Khám phá sản phẩm "${name}" này nhé!`,
    url: link
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('✅ Chia sẻ thành công'))
      .catch((err) => console.warn('❌ Chia sẻ bị huỷ hoặc lỗi:', err));
  } else {
    navigator.clipboard.writeText(link)
      .then(() => alert('🔗 Link sản phẩm đã được sao chép!'))
      .catch(() => alert('❌ Không thể sao chép link'));
  }
};
const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!slug) return;

    axios.get(`${API_URL}/article/${slug}`).then(res => {
      setArticle(res.data.article);
      setRelatedArticles(res.data.relatedArticles);
    });
  }, [slug]);

  const copyReferralLink = (link: string) => {
    navigator.clipboard.writeText(link)
      .then(() => alert('Link bài viết đã được sao chép!'))
      .catch(err => console.error('Không thể sao chép link', err));
  };

  if (!article) return <div className="container py-5">Đang tải bài viết...</div>;

  return (
    <div className="container" style={{ overflow: 'auto',paddingTop: '80px',paddingBottom: '80px' }}>
      <Header title="Bài viết" showBackIcon={true} />
      <div className="row">
        <div className="article-detail card border-0 shadow-sm rounded-3">
          <img src={getImageUrl(article.image)} className="card-img-top rounded-3" alt="Article" />
          <div className="card-body">
            <h2 className="card-title fw-bold mb-3">{article.title}</h2>
            <p className="small text-muted mb-3">Đăng vào {new Date(article.created_at).toLocaleDateString('vi-VN')}</p>
            <div className="content" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Chia sẻ */}
            <div className="mt-4 d-flex gap-2">
              <button className="btn btn-primary rounded-5" onClick={() => shareProduct(article.title, `${APP_URL}/articleDetail/${article.slug}`)}>
                <i className="fa fa-share-alt"></i> Chia sẻ
              </button>
              <button
                className="btn btn-light rounded-5 border"
                onClick={() => copyReferralLink(`${APP_URL}/articleDetail/${article.slug}`)}
              >
                <i className="fa fa-link"></i> Sao chép link
              </button>
            </div>
          </div>
        </div>

        {/* Bài viết liên quan */}
        <div className="related-articles mt-5">
          <h5 className="fw-bold mb-3">Bài viết liên quan</h5>
          <div className="row">
            {relatedArticles.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="card border-0 shadow-sm rounded-3">
                  <Link to={`/articleDetail/${item.slug}`}>
                    <img
                      src={getImageUrl(item.image)}
                      className="card-img-top rounded-3"
                      alt="Related"
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="card-body p-2">
                    <h6 className="card-title text-truncate mb-1">{item.title}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Có thể thêm sidebar hoặc thông tin tác giả nếu muốn */}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
