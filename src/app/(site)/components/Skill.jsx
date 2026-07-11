export default function Skill() {
  return (
    <section className="skill-section pb-120">
      <div className="container">
        <div className="row skill-wrap gy-lg-0 gy-4 align-items-center">
          <div className="col-lg-6">
            <div className="skill-content">
              <div className="section-heading heading-2">
                <h4 className="sub-heading">What We Do</h4>
                <h2 className="section-title">
                  Drive More <span>Traffic</span> Get More Sales
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  sit amet rcus nunc. Duis egestas ac ante sed tincidunt.
                </p>
              </div>
              <div className="skills-items">
                <div className="skills-item">
                  <div className="item-content">
                    <h4 className="title">International Authority</h4>
                    <span>$4000</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "80%" }}
                    >
                      <span data-background="/assets/img/shapes/skill-shape.png">
                        80%
                      </span>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
                <div className="skills-item">
                  <div className="item-content">
                    <h4 className="title">Real Authority Method</h4>
                    <span>12 Month</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "70%" }}
                    >
                      <span data-background="/assets/img/shapes/skill-shape.png">
                        70%
                      </span>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="skill-img">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=700&h=700&q=80"
                alt="skill"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
