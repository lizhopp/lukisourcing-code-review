import PageHeader from "../components/PageHeader.jsx";

const factories = [
  {
    name: "Mozartex",
    country: "China",
    contact: "Lina Chen",
    email: "lina@mozartex.example.com",
  },
  {
    name: "Bombyx",
    country: "Korea",
    contact: "Min Park",
    email: "min@bombyx.example.com",
  },
  {
    name: "YESUNG",
    country: "Korea",
    contact: "Sora Kim",
    email: "sora@yesung.example.com",
  },
];

export default function Factories() {
  return (
    <>
      <PageHeader
        eyebrow="Sourcing Base"
        title="Factories"
        description="Manage your mills, partners, and production contacts."
        actionLabel="+ Add Factory"
      />

      <section className="card stack">
        <div className="section-heading">
          <h2>Factory Directory</h2>
          <p>Each factory belongs to the logged-in sourcing workspace.</p>
        </div>

        <div className="list-grid">
          {factories.map((factory) => (
            <article key={factory.name} className="list-card">
              <div className="list-card-top">
                <h3>{factory.name}</h3>
                <span className="mini-tag">{factory.country}</span>
              </div>
              <p>{factory.contact}</p>
              <p className="muted-copy">{factory.email}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
