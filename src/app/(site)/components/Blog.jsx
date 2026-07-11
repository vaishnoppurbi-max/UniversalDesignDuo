export default function Blog({ posts }) {
  return (
    <section id="blog" className="blog-section pt-120 pb-120">
      <div className="container">
        <div className="section-heading heading-2">
          <h4 className="sub-heading">Our Blogs</h4>
          <h2 className="section-title">
            Drive Results with <span>Effective</span> Online Marketing
          </h2>
        </div>
        <div className="row gy-lg-0 gy-4 justify-content-center">
          {posts.map((post, i) => (
            <div className="col-md-6" key={i}>
              <div className="post-card">
                <div className="post-thumb">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="post-content-wrap">
                  <ul className="post-meta">
                    <li>By {post.author || "admin"}</li>
                    {post.category && <li>{post.category}</li>}
                    <li>{post.date || ""}</li>
                  </ul>
                  <div className="post-content">
                    <h3 className="title">
                      <a href="/blog">{post.title}</a>
                    </h3>
                    <p>
                      {post.excerpt ||
                        "Medical is a field that deals with the study, diagnosis, and treatment diseases Medical is a field that deals with the"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
