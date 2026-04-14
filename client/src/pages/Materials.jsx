import { useEffect, useState } from "react";
import { getApiUrl } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";

const TOKEN_KEY = "luki_token";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  status: "requested",
  cost: "",
  eta: "",
  factory_id: "",
};

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [factories, setFactories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [materialsResponse, factoriesResponse] = await Promise.all([
        fetch(getApiUrl("/api/materials"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(getApiUrl("/api/factories"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!materialsResponse.ok || !factoriesResponse.ok) {
        throw new Error("Unable to load materials right now.");
      }

      const [materialsData, factoriesData] = await Promise.all([
        materialsResponse.json(),
        factoriesResponse.json(),
      ]);

      setMaterials(materialsData);
      setFactories(factoriesData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEdit(material) {
    setEditingId(material.id);
    setFormData({
      name: material.name ?? "",
      category: material.category ?? "",
      description: material.description ?? "",
      status: material.status ?? "requested",
      cost: material.cost ?? "",
      eta: material.eta ? String(material.eta).slice(0, 10) : "",
      factory_id: material.primary_factory_id ?? "",
    });
    setError("");
  }

  function handleCancel() {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      ...formData,
      factory_id: formData.factory_id || null,
      cost: formData.cost || null,
      eta: formData.eta || null,
    };

    try {
      const response = await fetch(
        getApiUrl(editingId ? `/api/materials/${editingId}` : "/api/materials"),
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await loadPageData();
      handleCancel();
    } catch (saveError) {
      setError(saveError.message || "Unable to save material.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Material Library"
        title="Materials"
        description="Create and update material records, then connect them to your factories."
      />

      <section className="card stack">
        <div className="section-heading">
          <h2>{editingId ? "Edit Material" : "Add Material"}</h2>
          <p>Keep the MVP focused on the core material fields your pitch describes.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Material Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Factory</span>
            <select
              name="factory_id"
              value={formData.factory_id}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {factories.map((factory) => (
                <option key={factory.id} value={factory.id}>
                  {factory.factory_name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Category</span>
            <input name="category" value={formData.category} onChange={handleChange} />
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="requested">Requested</option>
              <option value="quoted">Quoted</option>
              <option value="sampling">Sampling</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="in transit">In Transit</option>
              <option value="received">Received</option>
            </select>
          </label>

          <label className="field">
            <span>Cost</span>
            <input
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>ETA</span>
            <input name="eta" type="date" value={formData.eta} onChange={handleChange} />
          </label>

          <label className="field field-full">
            <span>Description</span>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <div className="section-actions field-full">
            <button className="button primary" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Material"
                  : "Create Material"}
            </button>
            {editingId ? (
              <button className="button secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        {error ? <p className="form-message error-text">{error}</p> : null}
      </section>

      <section className="card table-wrap">
        <div className="section-heading">
          <h2>Material Records</h2>
          <p>These rows are now connected to the real `materials` table.</p>
        </div>

        {loading ? (
          <p className="empty-state">Loading materials...</p>
        ) : materials.length === 0 ? (
          <p className="empty-state">No materials yet. Create the first one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Factory</th>
                <th>Status</th>
                <th>Category</th>
                <th>Cost</th>
                <th>ETA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td>{material.name}</td>
                  <td>{material.factory_names || "Unassigned"}</td>
                  <td>
                    <span className="tag neutral">{material.status}</span>
                  </td>
                  <td>{material.category || "—"}</td>
                  <td>{material.cost ?? "—"}</td>
                  <td>{material.eta ? String(material.eta).slice(0, 10) : "—"}</td>
                  <td className="table-actions">
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleEdit(material)}
                    >
                      Edit
                    </button>
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
