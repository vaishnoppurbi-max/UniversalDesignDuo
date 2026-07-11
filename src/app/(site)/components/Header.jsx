const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Service" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ contact, active = "/" }) {
  return (
    <>
      {/* header-area-start */}
      <header className="header sticky-active">
        <div className="primary-header">
          <div className="container">
            <div className="primary-header-inner">
              <div className="header-logo d-lg-block">
                <a href="/">
                  <img src="/assets/img/logo/logo-dark.png" alt="Logo" />
                </a>
              </div>
              <div className="header-menu-wrap">
                <div className="mobile-menu-items">
                  <ul>
                    {NAV.map((item) => (
                      <li key={item.href} className={active === item.href ? "active" : ""}>
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* /.header-menu-wrap */}
              <div className="header-right">
                <div className="search-icon dl-search-icon">
                  <i className="fa-solid fa-magnifying-glass" />
                </div>
                <a href="/contact" className="pb-primary-btn header-btn">
                  Get Started
                </a>
                <div className="header-right-item">
                  <a
                    href="javascript:void(0)"
                    className="mobile-side-menu-toggle d-lg-none"
                  >
                    <i className="fa-sharp fa-solid fa-bars" />
                  </a>
                </div>
              </div>
              {/* /.header-right */}
            </div>
            {/* /.primary-header-inner */}
          </div>
        </div>
        {/* /.primary-header */}
      </header>
      {/* /.Main Header */}

      <div id="popup-search-box">
        <div className="box-inner-wrap d-flex align-items-center">
          <form id="form" action="#" method="get" role="search">
            <input
              id="popup-search"
              type="text"
              name="s"
              placeholder="Type keywords here..."
            />
          </form>
          <div className="search-close">
            <i className="fa-sharp fa-regular fa-xmark" />
          </div>
        </div>
      </div>
      {/* /#popup-search-box */}

      <div className="preloader">
        <img src="/assets/img/logo/proloader.gif" alt="preloader-icon" />
      </div>
      {/* /.site-preloader */}

      <div className="mobile-side-menu">
        <div className="side-menu-content">
          <div className="side-menu-head">
            <a href="/">
              <img src="/assets/img/logo/logo-dark.png" alt="logo" />
            </a>
            <button className="mobile-side-menu-close">
              <i className="fa-regular fa-xmark" />
            </button>
          </div>
          <div className="side-menu-wrap"></div>
          <div className="contact-item item-2">
            <ul className="contact-list">
              <li>
                Address : <span>{contact.address}</span>
              </li>
              <li>
                Phone :{" "}
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
              </li>
              <li>
                Email : <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* /.mobile-side-menu */}
      <div className="mobile-side-menu-overlay"></div>
    </>
  );
}
