import express from "express";
import { createPost, deletePost, readAllPost, readPost, updatePost } from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

router
    .route('/create')
    .post(protect, createPost)

router
    .route('/get')
    .get(readAllPost)

router
    .route('/:id/get')
    .get(readPost)

router
    .route('/:id/update')
    .patch(protect, updatePost)

router
    .route('/:id/delete')
    .delete(protect, deletePost)

export default router;
