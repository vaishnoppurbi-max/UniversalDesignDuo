import { Trophy, ThumbsUp, Target, Users } from "./icons";

const STATS = [
  { Icon: Trophy, num: "150+", lbl: "Projects Delivered" },
  { Icon: ThumbsUp, num: "98%", lbl: "Client Satisfaction" },
  { Icon: Target, num: "6+", lbl: "Years of Experience" },
  { Icon: Users, num: "50+", lbl: "Happy Clients" },
];

export default function WhyChooseUs() {
  return (
    <section className="section soft">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Why Choose Universal Design Duo?</h2>
        </div>
        <div className="why-stats">
          {STATS.map(({ Icon, num, lbl }) => (
            <div className="why-stat" key={lbl}>
              <span className="wic">
                <Icon size={26} />
              </span>
              <div className="num">{num}</div>
              <div className="lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
