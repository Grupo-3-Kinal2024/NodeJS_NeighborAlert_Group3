import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../../middlewares/validate-jwt.js";
import { validateFields } from "../../middlewares/validate-fields.js";
import { isMycomment } from "../../helpers/validate-yours.js";
import { createComment, getComments, updateComment, deleteComment } from "./comment.controller.js";

const router = Router();

router.post(
    "/createComment",
    [
        validateJWT,

        check("idPost", "Post is required").not().isEmpty(),
        check("content", "Content is required").not().isEmpty(),
        check("anonymous", "Anonymous is required").not().isEmpty(),
        validateFields,
    ],
    createComment
)

router.get("/getComment/:idPost", validateJWT, getComments);

router.put(
    "/updateComment/:id",
    [
        validateJWT,
        isMycomment,
        check("content", "Content is required").not().isEmpty(),
        validateFields,
    ],
    updateComment
)

router.delete("/deleteComment/:id", validateJWT, isMycomment, deleteComment);



export default router;