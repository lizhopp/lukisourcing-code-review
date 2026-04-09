import PageHeader from "../components/PageHeader.jsx";

const summaryCards = [
  { label: "Requested", value: "12", tone: "blue" },
  { label: "Sampling", value: "8", tone: "pink" },
  { label: "Approved", value: "21", tone: "green" },
];

const recentFabrics = [
  {
    fabric: "PF10002065",
    factory: "Bombyx",
    composition: "66% Cotton 29% Nylon 5% Spandex",
    status: "Sampling",
    tone: "sampling",
  },
  {
    fabric: "SJ-1408",
    factory: "Shinjintex",
    composition: "41% Modal 38% Organic Cotton 17% Linen 4% Spandex",
    status: "Approved",
    tone: "approved",
  },
];

export default function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Fabric Dashboard"
        description="Track sourcing from request to delivery."
        actionLabel="+ Add Fabric"
      />

      <section className="grid three">
        {summaryCards.map((card) => (
          <article key={card.label} className="stat-card">
            <div className="stat-label">{card.label}</div>
            <div className={`stat-value ${card.tone}`}>{card.value}</div>
          </article>
        ))}
      </section>

      <section className="card table-wrap">
        <div className="section-heading">
          <h2>Recent Fabrics</h2>
          <p>Quick view of active development materials.</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Factory</th>
              <th>Composition</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentFabrics.map((fabric) => (
              <tr key={fabric.fabric}>
                <td>{fabric.fabric}</td>
                <td>{fabric.factory}</td>
                <td>{fabric.composition}</td>
                <td>
                  <span className={`tag ${fabric.tone}`}>{fabric.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
