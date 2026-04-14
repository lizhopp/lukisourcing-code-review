import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";

const TOKEN_KEY = "luki_token";

export default function StageOfMaterial() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function loadMaterials() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return;
      }

      try {
        const response = await fetch("/api/materials", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadMaterials();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Workflow"
        title="Stage of Material"
        description="Follow each material through the sourcing workflow."
      />

      <section className="card stack">
        <div className="section-heading">
          <h2>Current Workflow</h2>
          <p>Use this page to map request, sampling, approval, and delivery stages.</p>
        </div>

        {materials.length === 0 ? (
          <p className="empty-state">No materials yet. Once materials exist, their status will show here.</p>
        ) : (
          <div className="timeline">
            {materials.map((material) => (
              <article key={material.id} className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-body">
                  <div className="timeline-top">
                    <h3>{material.name}</h3>
                    <span className="mini-tag">{material.status}</span>
                  </div>
                  <p>{material.factory_names || "No factory assigned yet"}</p>
                  <p className="muted-copy">
                    ETA: {material.eta ? String(material.eta).slice(0, 10) : "Pending"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
