import db from "#db/client";

function normalizeOptionalValue(value) {
  return value === "" ? null : value;
}

async function replaceMaterialFactories(materialId, factoryId) {
  await db.query(
    `
      DELETE FROM material_factories
      WHERE material_id = $1
    `,
    [materialId],
  );

  if (!factoryId) {
    return;
  }

  await db.query(
    `
      INSERT INTO material_factories (material_id, factory_id)
      VALUES ($1, $2)
    `,
    [materialId, factoryId],
  );
}

export async function createMaterial(userId, materialData) {
  const {
    rows: [material],
  } = await db.query(
    `
      INSERT INTO materials (
        created_by,
        name,
        category,
        description,
        status,
        cost,
        eta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [
      userId,
      materialData.name,
      normalizeOptionalValue(materialData.category) ?? null,
      normalizeOptionalValue(materialData.description) ?? null,
      normalizeOptionalValue(materialData.status) ?? "requested",
      normalizeOptionalValue(materialData.cost),
      normalizeOptionalValue(materialData.eta),
    ],
  );

  await replaceMaterialFactories(material.id, normalizeOptionalValue(materialData.factory_id));
  return getMaterialById(material.id, userId);
}

export async function getMaterialsByUserId(userId) {
  const { rows } = await db.query(
    `
      SELECT
        materials.*,
        COALESCE(
          string_agg(DISTINCT factories.factory_name, ', ')
            FILTER (WHERE factories.factory_name IS NOT NULL),
          ''
        ) AS factory_names,
        MIN(factories.id) AS primary_factory_id
      FROM materials
      LEFT JOIN material_factories
        ON material_factories.material_id = materials.id
      LEFT JOIN factories
        ON factories.id = material_factories.factory_id
      WHERE materials.created_by = $1
      GROUP BY materials.id
      ORDER BY materials.id DESC
    `,
    [userId],
  );

  return rows;
}

export async function getMaterialById(id, userId) {
  const {
    rows: [material],
  } = await db.query(
    `
      SELECT
        materials.*,
        COALESCE(
          string_agg(DISTINCT factories.factory_name, ', ')
            FILTER (WHERE factories.factory_name IS NOT NULL),
          ''
        ) AS factory_names,
        MIN(factories.id) AS primary_factory_id
      FROM materials
      LEFT JOIN material_factories
        ON material_factories.material_id = materials.id
      LEFT JOIN factories
        ON factories.id = material_factories.factory_id
      WHERE materials.id = $1
        AND materials.created_by = $2
      GROUP BY materials.id
    `,
    [id, userId],
  );

  return material;
}

export async function updateMaterial(id, userId, materialData) {
  const {
    rows: [material],
  } = await db.query(
    `
      UPDATE materials
      SET
        name = $3,
        category = $4,
        description = $5,
        status = $6,
        cost = $7,
        eta = $8
      WHERE id = $1
        AND created_by = $2
      RETURNING *
    `,
    [
      id,
      userId,
      materialData.name,
      normalizeOptionalValue(materialData.category),
      normalizeOptionalValue(materialData.description),
      normalizeOptionalValue(materialData.status),
      normalizeOptionalValue(materialData.cost),
      normalizeOptionalValue(materialData.eta),
    ],
  );

  if (!material) {
    return null;
  }

  await replaceMaterialFactories(material.id, normalizeOptionalValue(materialData.factory_id));
  return getMaterialById(material.id, userId);
}
