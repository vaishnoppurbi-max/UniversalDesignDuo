export default function PageBanner({ title }) {
  return (
    <section
      className="page-header"
      data-background="/assets/img/bg-img/page-header-bg.jpg"
    >
      <div className="container">
        <div className="page-header-content">
          <h1 className="title">{title}</h1>
          <h4 className="sub-title">
            <a className="home" href="/">
              Home{" "}
            </a>
            <span></span>
            <span className="inner-page"> {title}</span>
          </h4>
        </div>
      </div>
    </section>
  );
}
