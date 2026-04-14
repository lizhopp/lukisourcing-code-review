import { useEffect, useState } from "react";
import { getApiUrl } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";

const TOKEN_KEY = "luki_token";

function createEmptyFactoryForm() {
  return {
    factory_name: "",
    country: "",
    address: "",
    main_phone: "",
    main_email: "",
  };
}

function createEmptyContactForm(factoryId = "") {
  return {
    factory_id: factoryId,
    full_name: "",
    email: "",
    phone: "",
    job_title: "",
    notes: "",
    is_primary_contact: false,
  };
}

export default function Factories() {
  const [factories, setFactories] = useState([]);
  const [factoryForm, setFactoryForm] = useState(createEmptyFactoryForm());
  const [editingFactoryId, setEditingFactoryId] = useState(null);
  const [contactForms, setContactForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingFactory, setSavingFactory] = useState(false);
  const [factoryError, setFactoryError] = useState("");

  useEffect(() => {
    loadFactories();
  }, []);

  async function loadFactories() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/factories"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load factories.");
      }

      const data = await response.json();
      setFactories(data);
    } catch (error) {
      setFactoryError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFactoryChange(event) {
    const { name, value } = event.target;
    setFactoryForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEditFactory(factory) {
    setEditingFactoryId(factory.id);
    setFactoryForm({
      factory_name: factory.factory_name ?? "",
      country: factory.country ?? "",
      address: factory.address ?? "",
      main_phone: factory.main_phone ?? "",
      main_email: factory.main_email ?? "",
    });
    setFactoryError("");
  }

  function handleCancelFactory() {
    setEditingFactoryId(null);
    setFactoryForm(createEmptyFactoryForm());
    setFactoryError("");
  }

  async function handleFactorySubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    setSavingFactory(true);
    setFactoryError("");

    try {
      const response = await fetch(
        getApiUrl(editingFactoryId ? `/api/factories/${editingFactoryId}` : "/api/factories"),
        {
          method: editingFactoryId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(factoryForm),
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await loadFactories();
      handleCancelFactory();
    } catch (error) {
      setFactoryError(error.message || "Unable to save factory.");
    } finally {
      setSavingFactory(false);
    }
  }

  function startNewContact(factoryId) {
    setContactForms((current) => ({
      ...current,
      [factoryId]: [...(current[factoryId] ?? []), createEmptyContactForm(factoryId)],
    }));
  }

  function handleContactChange(factoryId, index, field, value) {
    setContactForms((current) => ({
      ...current,
      [factoryId]: (current[factoryId] ?? []).map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, [field]: value } : contact,
      ),
    }));
  }

  async function saveContact(factoryId, index) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    const contact = contactForms[factoryId]?.[index];
    if (!contact) {
      return;
    }

    const isEditingExisting = Boolean(contact.id);
    const endpoint = isEditingExisting
      ? getApiUrl(`/api/factory-contacts/${contact.id}`)
      : getApiUrl("/api/factory-contacts");

    const method = isEditingExisting ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    await loadFactories();
    setContactForms((current) => ({
      ...current,
      [factoryId]: [],
    }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Sourcing Base"
        title="Factories"
        description="Create factories, edit their details, and manage more than one contact in one place."
      />

      <section className="card stack">
        <div className="section-heading">
          <h2>{editingFactoryId ? "Edit Factory" : "Add Factory"}</h2>
          <p>Factory details can start simple and be completed as sourcing moves forward.</p>
        </div>

        <form className="form-grid" onSubmit={handleFactorySubmit}>
          <label className="field">
            <span>Factory Name</span>
            <input
              name="factory_name"
              value={factoryForm.factory_name}
              onChange={handleFactoryChange}
              required
            />
          </label>

          <label className="field">
            <span>Country</span>
            <input name="country" value={factoryForm.country} onChange={handleFactoryChange} />
          </label>

          <label className="field field-full">
            <span>Address</span>
            <input name="address" value={factoryForm.address} onChange={handleFactoryChange} />
          </label>

          <label className="field">
            <span>Phone Number</span>
            <input
              name="main_phone"
              value={factoryForm.main_phone}
              onChange={handleFactoryChange}
            />
          </label>

          <label className="field">
            <span>Contact Email</span>
            <input
              name="main_email"
              type="email"
              value={factoryForm.main_email}
              onChange={handleFactoryChange}
            />
          </label>

          <div className="section-actions field-full">
            <button className="button primary" type="submit" disabled={savingFactory}>
              {savingFactory
                ? "Saving..."
                : editingFactoryId
                  ? "Save Factory"
                  : "Create Factory"}
            </button>
            {editingFactoryId ? (
              <button className="button secondary" type="button" onClick={handleCancelFactory}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        {factoryError ? <p className="error-text">{factoryError}</p> : null}
      </section>

      <section className="card stack">
        <div className="section-heading">
          <h2>Factory Directory</h2>
          <p>Edit factory details and manage one or many contacts from the same page.</p>
        </div>

        {loading ? (
          <p className="empty-state">Loading factories...</p>
        ) : factories.length === 0 ? (
          <p className="empty-state">No factories yet. Create the first one above.</p>
        ) : (
          <div className="list-grid">
            {factories.map((factory) => (
              <article key={factory.id} className="list-card stack">
                <div className="list-card-top">
                  <h3>{factory.factory_name}</h3>
                  <span className="mini-tag">{factory.country || "—"}</span>
                </div>

                <p>{factory.address || "No address listed"}</p>
                <p>{factory.main_phone || "No phone listed"}</p>
                <p className="muted-copy">{factory.main_email || "No email listed"}</p>

                <div className="section-actions">
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleEditFactory(factory)}
                  >
                    Edit Factory
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => startNewContact(factory.id)}
                  >
                    Add Contact
                  </button>
                </div>

                <div className="stack">
                  <h4>Contacts</h4>
                  {factory.contacts?.length ? (
                    factory.contacts.map((contact) => (
                      <div key={contact.id} className="contact-card">
                        <p>{contact.full_name}</p>
                        <p className="muted-copy">{contact.email || "No email"}</p>
                        <p className="muted-copy">{contact.phone || "No phone"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">No contacts saved yet.</p>
                  )}

                  {(contactForms[factory.id] ?? []).map((contact, index) => (
                    <div key={`draft-${factory.id}-${index}`} className="contact-editor">
                      <div className="form-grid">
                        <label className="field">
                          <span>Contact Name</span>
                          <input
                            value={contact.full_name}
                            onChange={(event) =>
                              handleContactChange(factory.id, index, "full_name", event.target.value)
                            }
                          />
                        </label>

                        <label className="field">
                          <span>Contact Email</span>
                          <input
                            type="email"
                            value={contact.email}
                            onChange={(event) =>
                              handleContactChange(factory.id, index, "email", event.target.value)
                            }
                          />
                        </label>

                        <label className="field">
                          <span>Phone Number</span>
                          <input
                            value={contact.phone}
                            onChange={(event) =>
                              handleContactChange(factory.id, index, "phone", event.target.value)
                            }
                          />
                        </label>

                        <label className="field">
                          <span>Job Title</span>
                          <input
                            value={contact.job_title}
                            onChange={(event) =>
                              handleContactChange(factory.id, index, "job_title", event.target.value)
                            }
                          />
                        </label>
                      </div>

                      <div className="section-actions">
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => saveContact(factory.id, index)}
                        >
                          Save Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
