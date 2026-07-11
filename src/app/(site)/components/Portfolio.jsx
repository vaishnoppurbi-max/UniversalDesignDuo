const FILTER_CLASSES = ["authority content", "authority", "content"];

export default function Portfolio({ projects }) {
  return (
    <section id="portfolio" className="project-section pt-120 bg-grey">
      <div className="bg-color"></div>
      <div className="shapes">
        <div className="shape shape-1">
          <img src="/assets/img/shapes/project-shape-1.png" alt="project" />
        </div>
        <div className="shape shape-2">
          <img src="/assets/img/shapes/project-shape-2.png" alt="project" />
        </div>
      </div>
      <div className="container">
        <div className="section-heading text-center">
          <h4 className="sub-heading">Our Portfolio</h4>
          <h2 className="section-title">
            Optimizing Brands for Online <span>Success</span>
          </h2>
        </div>
        <div className="project-filter">
          <div className="row">
            <div className="col-lg-12">
              <div className="project-filter-list text-center">
                <div className="filter-item active" data-filter="*">
                  Search Engine
                </div>
                <div className="filter-item" data-filter=".authority">
                  Real Authority Method
                </div>
                <div className="filter-item" data-filter=".content">
                  Content Creation
                </div>
              </div>
            </div>
          </div>
          <div className="row filter-items justify-content-center gy-lg-0 gy-4">
            {projects.map((project, i) => (
              <div
                className={`col-lg-4 col-md-6 single-item ${
                  FILTER_CLASSES[i % FILTER_CLASSES.length]
                }`}
                key={i}
              >
                <div className="project-item">
                  <div className="project-thumb">
                    <a href="/portfolio">
                      <img src={project.image} alt="project" />
                    </a>
                    <div className="project-content">
                      <h3 className="title">
                        <a href="/portfolio">{project.title}</a>
                      </h3>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
