import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { login, register } from "./auth.controller.js";
import { validateExistentEmail, validateEmail, validateCommunity, validatePassword} from "../helpers/data-methods.js";

const router = Router();

router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("lastName", "Last name is required").not().isEmpty(),
        check("phone", "Phone is required").not().isEmpty(),
        check("email", "Email is required").isEmail(),
        check("email").custom(validateExistentEmail),
        check("email").custom(validateEmail),
        check("pass").custom(validatePassword),
        // check("img", "Image is required").not().isEmpty(),
        // check("idCommunity", "Community is required").not().isEmpty(),
        // check("idCommunity").custom(validateCommunity),
        validateFields,
    ],
    register
);

router.post(
    "/login",
    [
        check("email", "Email is required").isEmail(),
        check("pass", "Password is required").not().isEmpty(),
        validateFields,
    ],
    login
);

export default router;