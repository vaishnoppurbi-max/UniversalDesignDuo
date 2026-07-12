import { ArrowRight } from "./icons";

export default function Blog({ posts, heading = true }) {
  return (
    <section id="blog" className="section">
      <div className="container">
        {heading && (
          <div className="section-head">
            <div className="eyebrow">Our Blog</div>
            <h2 className="section-title">Latest Insights &amp; Tips</h2>
            <p>
              Drive results with effective online marketing — fresh ideas from
              our team.
            </p>
          </div>
        )}
        <div className="blog-grid">
          {posts.map((post, i) => (
            <article className="blog-card" key={i}>
              <div className="blog-thumb">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="blog-body">
                <div className="blog-meta">
                  {post.category && <span className="cat">{post.category}</span>}
                  <span>{post.date}</span>
                  <span>By {post.author || "admin"}</span>
                </div>
                <h3>{post.title}</h3>
                <p>
                  {post.excerpt ||
                    "Practical strategies and insights to help your brand grow online."}
                </p>
                <a href="/blog" className="learn">
                  Read More <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
