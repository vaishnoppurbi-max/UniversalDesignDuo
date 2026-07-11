const COUNTERS = [
  { icon: "counter-1.png", count: "200", suffix: "+", label: "Team member" },
  { icon: "counter-2.png", count: "30", suffix: "k+", label: "Winning award" },
  { icon: "promo-1.png", count: "20", suffix: "+", label: "Complete project" },
  { icon: "counter-4.png", count: "300", suffix: "+", label: "Client review" },
];

export default function Counter() {
  return (
    <section className="counter-section">
      <div className="bg-color"></div>
      <div className="container">
        <div className="row counter-wrap gy-lg-0 gy-4">
          {COUNTERS.map((c) => (
            <div className="col-lg-3 col-md-6" key={c.label}>
              <div className="counter-item">
                <div className="counter-icon">
                  <img src={`/assets/img/icon/${c.icon}`} alt="icon" />
                </div>
                <div className="counter-content">
                  <h3 className="title">
                    <span className="odometer" data-count={c.count}>
                      0
                    </span>
                    <span className="text">{c.suffix}</span>
                  </h3>
                  <p>{c.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
