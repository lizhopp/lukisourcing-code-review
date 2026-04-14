import express from "express";
import { getFactoryById } from "#db/queries/factories";
import {
  createMaterial,
  getMaterialById,
  getMaterialsByUserId,
  updateMaterial,
} from "#db/queries/materials";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();

async function validateFactoryAccess(factoryId, userId, res) {
  if (!factoryId) {
    return true;
  }

  const factory = await getFactoryById(factoryId);
  if (!factory) {
    res.status(404).send("Factory not found.");
    return false;
  }

  if (factory.user_id !== userId) {
    res.status(403).send("Forbidden");
    return false;
  }

  return true;
}

router.get("/", requireUser, async (req, res) => {
  const materials = await getMaterialsByUserId(req.user.id);
  res.send(materials);
});

router.post("/", requireUser, requireBody(["name"]), async (req, res) => {
  const canUseFactory = await validateFactoryAccess(
    req.body.factory_id,
    req.user.id,
    res,
  );

  if (!canUseFactory) {
    return;
  }

  const material = await createMaterial(req.user.id, req.body);
  res.status(201).send(material);
});

router.get("/:id", requireUser, async (req, res) => {
  const material = await getMaterialById(req.params.id, req.user.id);
  if (!material) {
    return res.status(404).send("Material not found.");
  }

  res.send(material);
});

router.patch("/:id", requireUser, async (req, res) => {
  const existingMaterial = await getMaterialById(req.params.id, req.user.id);
  if (!existingMaterial) {
    return res.status(404).send("Material not found.");
  }

  const nextFactoryId =
    req.body.factory_id === undefined
      ? existingMaterial.primary_factory_id
      : req.body.factory_id;

  const canUseFactory = await validateFactoryAccess(nextFactoryId, req.user.id, res);
  if (!canUseFactory) {
    return;
  }

  const updatedMaterial = await updateMaterial(req.params.id, req.user.id, {
    name: req.body.name ?? existingMaterial.name,
    category: req.body.category ?? existingMaterial.category,
    description: req.body.description ?? existingMaterial.description,
    status: req.body.status ?? existingMaterial.status,
    cost: req.body.cost ?? existingMaterial.cost,
    eta: req.body.eta ?? existingMaterial.eta,
    factory_id: nextFactoryId,
  });

  res.send(updatedMaterial);
});

export default router;
