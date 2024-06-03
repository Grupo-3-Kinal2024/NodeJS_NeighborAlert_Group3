import { Router } from "express"; 
import { check } from "express-validator"; 
import { createPost, getMyPost, deletePost, updatePost } from "./post.controller.js"; 
import { validateJWT } from "../../middlewares/validate-jwt.js";
import { validateFields } from "../../middlewares/validate-fields.js";


const router = Router(); 

router.post(
    "/",
    [
        validateJWT,
        check("idCommunity", "idCommunity is required").isMongoId(), 
        check("title", "title is required").not().isEmpty(), 
        check("content", "content is required").not().isEmpty(),
        check("anonymous", "anonymous is required").not().isEmpty(),
        check("category", "category is required").not().isEmpty(), 
        
        validateFields
    ],
    createPost
);

router.put(
    "/:id", 
    [
        validateJWT,
        check("title", "title is required").not().isEmpty(), 
        check("content", "content is required").not().isEmpty(),
        check("category", "category is required").not().isEmpty(), 
        validateFields
    ], 
    updatePost

)

router.get("/", validateJWT, getMyPost);

router.delete("/:id", validateJWT, deletePost)

export default router;