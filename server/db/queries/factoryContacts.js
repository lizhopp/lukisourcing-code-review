import db from "#db/client";

function normalizeOptionalValue(value) {
  return value === "" ? null : value;
}

export async function createFactoryContact(contactData) {
  const sql = `
    INSERT INTO factory_contacts (
      factory_id,
      full_name,
      job_title,
      email,
      phone,
      is_primary_contact,
      notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    contactData.factory_id,
    contactData.full_name,
    normalizeOptionalValue(contactData.job_title),
    normalizeOptionalValue(contactData.email),
    normalizeOptionalValue(contactData.phone),
    contactData.is_primary_contact ?? false,
    normalizeOptionalValue(contactData.notes),
  ];

  const {
    rows: [contact],
  } = await db.query(sql, values);
  return contact;
}

export async function getContactsByFactoryId(factoryId) {
  const sql = `
    SELECT *
    FROM factory_contacts
    WHERE factory_id = $1
    ORDER BY id
  `;
  const { rows: contacts } = await db.query(sql, [factoryId]);
  return contacts;
}

export async function updateFactoryContact(id, factoryId, contactData) {
  const sql = `
    UPDATE factory_contacts
    SET
      full_name = $3,
      job_title = $4,
      email = $5,
      phone = $6,
      is_primary_contact = $7,
      notes = $8
    WHERE id = $1
      AND factory_id = $2
    RETURNING *
  `;

  const {
    rows: [contact],
  } = await db.query(sql, [
    id,
    factoryId,
    contactData.full_name,
    normalizeOptionalValue(contactData.job_title),
    normalizeOptionalValue(contactData.email),
    normalizeOptionalValue(contactData.phone),
    contactData.is_primary_contact ?? false,
    normalizeOptionalValue(contactData.notes),
  ]);

  return contact;
}
