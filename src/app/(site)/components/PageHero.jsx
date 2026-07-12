export default function PageHero({ title, crumb }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        <div className="crumb">
          <a href="/">Home</a> &nbsp;/&nbsp; {crumb || title}
        </div>
      </div>
    </section>
  );
}
