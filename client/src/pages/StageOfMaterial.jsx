import PageHeader from "../components/PageHeader.jsx";

const stages = [
  {
    material: "Chalk Wax Melange",
    stage: "Requested",
    owner: "Lucas",
    eta: "2025-08-21",
  },
  {
    material: "Stretch Cotton Nylon Twill",
    stage: "Sampling",
    owner: "Production",
    eta: "2025-08-25",
  },
  {
    material: "Elohim / Thiago",
    stage: "Approved",
    owner: "Design",
    eta: "2025-08-28",
  },
];

export default function StageOfMaterial() {
  return (
    <>
      <PageHeader
        eyebrow="Workflow"
        title="Stage of Material"
        description="Follow each material through the sourcing workflow."
        actionLabel="+ Add Stage"
      />

      <section className="card stack">
        <div className="section-heading">
          <h2>Current Workflow</h2>
          <p>Use this page to map request, sampling, approval, and delivery stages.</p>
        </div>

        <div className="timeline">
          {stages.map((stage) => (
            <article key={stage.material} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-body">
                <div className="timeline-top">
                  <h3>{stage.material}</h3>
                  <span className="mini-tag">{stage.stage}</span>
                </div>
                <p>{stage.owner}</p>
                <p className="muted-copy">ETA: {stage.eta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
