import { Search, Rocket, Pencil, Target, Send } from "./icons";

const STEPS = [
  {
    Icon: Search,
    title: "Discover",
    text: "Understanding your goals, audience, and challenges.",
  },
  {
    Icon: Rocket,
    title: "Ideate",
    text: "Brainstorming creative ideas and design concepts.",
  },
  {
    Icon: Pencil,
    title: "Design",
    text: "Crafting visuals and prototypes with purpose.",
  },
  {
    Icon: Target,
    title: "Refine",
    text: "Improving through feedback and perfecting the details.",
  },
  {
    Icon: Send,
    title: "Deliver",
    text: "Final design delivery that creates real impact.",
  },
];

export default function Process() {
  return (
    <section id="process" className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Our Process</div>
          <h2 className="section-title">
            From <span className="text-gold">Idea</span> to Impact — Our Design
            Process
          </h2>
        </div>

        <ol className="process-track">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li className="process-step" key={title}>
              <span className="step-ic">
                <Icon size={22} />
              </span>
              <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
              <h4>{title}</h4>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
