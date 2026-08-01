import { ArrowRight, Target, Users, Pencil } from "./icons";

const CHIPS = [
  { Icon: Target, label: "Product Strategy Research", pos: "one" },
  { Icon: Users, label: "User-Centered Design", pos: "two" },
  { Icon: Pencil, label: "Industrial Design Concept", pos: "three" },
];

export default function Hero({ hero, shots = [] }) {
  // The collage uses the hero banner as the anchor image and borrows the next
  // three images from the gallery so it fills out without extra admin fields.
  const collage = [hero.bannerImage, ...shots].filter(Boolean).slice(0, 4);

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            Design That Connects. Products That Impact.
          </div>
          <h1>
            {hero.titleLine1}{" "}
            <span className="text-gold">{hero.titleHighlight}</span>
            <br />
            {hero.titleLine2}{" "}
            {hero.titleHighlight2 && (
              <span className="text-gold">{hero.titleHighlight2}</span>
            )}
          </h1>
          <p className="lead">{hero.subtitle}</p>
          <div className="hero-cta">
            <a href="/portfolio" className="btn btn-primary">
              View Our Work <ArrowRight size={16} />
            </a>
            <a href="/services" className="btn btn-outline">
              Explore Services <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="hero-collage">
          {collage.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src + i} className={`shot s${i + 1}`} src={src} alt="" />
          ))}
          {CHIPS.map(({ Icon, label, pos }) => (
            <div className={`hero-chip ${pos}`} key={label}>
              <span className="chip-ic">
                <Icon size={14} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
