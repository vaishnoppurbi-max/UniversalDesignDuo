import { Users, Chart, Trophy, ThumbsUp, Rocket } from "./icons";

const STATS = [
  { Icon: Users, num: "200+", lbl: "Happy Clients" },
  { Icon: Chart, num: "30K+", lbl: "Leads Generated" },
  { Icon: Trophy, num: "20+", lbl: "Industries Served" },
  { Icon: ThumbsUp, num: "300+", lbl: "Successful Campaigns" },
  { Icon: Rocket, num: "10+", lbl: "Years Experience" },
];

export default function StatsBar() {
  return (
    <div className="container">
      <div className="stats-bar">
        {STATS.map((s) => (
          <div className="stat-cell" key={s.lbl}>
            <span className="ic">
              <s.Icon size={26} />
            </span>
            <div className="num">{s.num}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
