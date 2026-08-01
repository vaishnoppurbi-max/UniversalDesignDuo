const BRANDS = [
  "logitech",
  "boAt",
  "zomato",
  "PHILIPS",
  "DREAM11",
  "amazon",
  "noise",
  "TATA",
  "CRED",
  "Microsoft",
];

export default function BrandStrip() {
  return (
    <section className="brand-strip">
      <div className="container">
        <p className="trusted">Trusted by forward-thinking brands</p>
        <div className="brand-row">
          {BRANDS.map((b) => (
            <span className="brand-mark" key={b}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
