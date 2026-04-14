import { useEffect, useState } from "react";
import { getApiUrl } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";

const TOKEN_KEY = "luki_token";

export default function Dashboard() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function loadMaterials() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return;
      }

      try {
        const response = await fetch(getApiUrl("/api/materials"), {
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

  const summaryCards = [
    {
      label: "Requested",
      value: String(materials.filter((material) => material.status === "requested").length),
      tone: "blue",
    },
    {
      label: "Sampling",
      value: String(materials.filter((material) => material.status === "sampling").length),
      tone: "pink",
    },
    {
      label: "Approved",
      value: String(materials.filter((material) => material.status === "approved").length),
      tone: "green",
    },
  ];

  const recentMaterials = materials.slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Materials Dashboard"
        description="Track sourcing from request to delivery."
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
          <h2>Recent Materials</h2>
          <p>Quick view of active development materials.</p>
        </div>

        {recentMaterials.length === 0 ? (
          <p className="empty-state">No materials yet. Add one from the Materials page.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Factory</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMaterials.map((material) => (
                <tr key={material.id}>
                  <td>{material.name}</td>
                  <td>{material.factory_names || "Unassigned"}</td>
                  <td>{material.category_collection || "—"}</td>
                  <td>
                    <span className="tag neutral">{material.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
