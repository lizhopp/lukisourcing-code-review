import express from "express";
import {
  createFactory,
  getFactoriesByUserId,
  getFactoryById,
  updateFactory,
} from "#db/queries/factories";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.post(
  "/",
  requireUser,
  requireBody(["factory_name"]),
  async (req, res) => {
    const factory = await createFactory(req.user.id, req.body);
    res.status(201).send(factory);
  },
);

router.get("/", requireUser, async (req, res) => {
  const factories = await getFactoriesByUserId(req.user.id);
  res.send(factories);
});

router.get("/:id", requireUser, async (req, res) => {
  const factory = await getFactoryById(req.params.id);
  if (!factory) {
    return res.status(404).send("Factory not found.");
  }

  if (factory.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  res.send(factory);
});

router.patch("/:id", requireUser, requireBody(["factory_name"]), async (req, res) => {
  const existingFactory = await getFactoryById(req.params.id);
  if (!existingFactory) {
    return res.status(404).send("Factory not found.");
  }

  if (existingFactory.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  const factory = await updateFactory(existingFactory.id, req.user.id, {
    factory_name: req.body.factory_name ?? existingFactory.factory_name,
    country: req.body.country ?? existingFactory.country,
    address: req.body.address ?? existingFactory.address,
    main_phone: req.body.main_phone ?? existingFactory.main_phone,
    main_email: req.body.main_email ?? existingFactory.main_email,
    shipping_account_number:
      req.body.shipping_account_number ?? existingFactory.shipping_account_number,
    shipping_notes: req.body.shipping_notes ?? existingFactory.shipping_notes,
    notes: req.body.notes ?? existingFactory.notes,
  });

  res.send(factory);
});

export default router;
