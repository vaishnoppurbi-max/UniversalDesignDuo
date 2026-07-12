import { Rocket, Chart, ThumbsUp, Target, Chart as Flow, Shield } from "./icons";

const CLIENTS = [
  { Icon: Rocket, name: "TechStart" },
  { Icon: Chart, name: "GrowthCo" },
  { Icon: ThumbsUp, name: "ShopEasy" },
  { Icon: Target, name: "InnovateLab" },
  { Icon: Flow, name: "DataFlow" },
  { Icon: Shield, name: "BrandBoost" },
];

export default function Clients() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 34 }}>
          <div className="eyebrow">Our Clients</div>
          <h2 className="section-title">Trusted by Leading Brands</h2>
        </div>
        <div className="clients-row">
          {CLIENTS.map((c) => (
            <div className="client" key={c.name}>
              <c.Icon size={22} />
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
