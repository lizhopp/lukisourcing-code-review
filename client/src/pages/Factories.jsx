import { useEffect, useState } from "react";
import { getApiUrl } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";

const TOKEN_KEY = "luki_token";

export default function Factories() {
  const [factories, setFactories] = useState([]);

  useEffect(() => {
    async function loadFactories() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return;
      }

      try {
        const response = await fetch(getApiUrl("/api/factories"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setFactories(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadFactories();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Sourcing Base"
        title="Factories"
        description="Manage your mills, partners, and production contacts."
      />

      <section className="card stack">
        <div className="section-heading">
          <h2>Factory Directory</h2>
          <p>Each factory belongs to the logged-in sourcing workspace.</p>
        </div>

        {factories.length === 0 ? (
          <p className="empty-state">No factories yet. Seed data or create one from the API.</p>
        ) : (
          <div className="list-grid">
            {factories.map((factory) => (
              <article key={factory.id} className="list-card">
                <div className="list-card-top">
                  <h3>{factory.factory_name}</h3>
                  <span className="mini-tag">{factory.country || "—"}</span>
                </div>
                <p>{factory.main_phone || "No phone listed"}</p>
                <p className="muted-copy">{factory.main_email || "No email listed"}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
