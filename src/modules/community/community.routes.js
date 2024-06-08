import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../../middlewares/validate-jwt.js";
import { validateFields } from "../../middlewares/validate-fields.js";
import { validateAdmin } from "../../helpers/data-methods.js";
import { createCommunity, getCommunities, getCommunity, updateCommunity, deleteCommunity } from "./community.controller.js";

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        validateAdmin,
        check("name", "Name is required").not().isEmpty(),
        check("location", "Location is required").not().isEmpty(),
        check("img", "Image is required").not().isEmpty(),
        validateFields,
    ],
    createCommunity
);

router.get("/", validateJWT, getCommunities);

router.get("/:id", validateJWT, getCommunity);

router.put(
    "/:id",
    [
        validateJWT,
        check("name", "Name is required").not().isEmpty(),
        check("location", "Location is required").not().isEmpty(),
        check("img", "Image is required").not().isEmpty(),
        validateFields,
    ],
    updateCommunity
);

router.delete("/:id", validateJWT, deleteCommunity);

export default router;