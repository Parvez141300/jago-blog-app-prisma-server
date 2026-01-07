import express, { Router } from 'express';
import { PostController } from './post.controller';
import authMiddleware, { UserRole } from '../../middleware/authMiddleware';

const router = express.Router();

// get all or search post
router.get("/", authMiddleware(UserRole.USER, UserRole.ADMIN), PostController.getAllOrSearchPost);
// get stats form the post for admin
router.get("/stats", authMiddleware(UserRole.ADMIN), PostController.getStats);
// get my posts
router.get("/my-posts", authMiddleware(UserRole.USER, UserRole.ADMIN), PostController.getMyPosts);
// get a post by id
router.get("/:postId", PostController.getPostById);
// update a post
router.patch("/:postId", authMiddleware(UserRole.USER, UserRole.ADMIN), PostController.updatePost);
// create a post
router.post("/", authMiddleware(UserRole.USER), PostController.createPost);
// delete a post
router.delete("/:postId", authMiddleware(UserRole.USER, UserRole.ADMIN), PostController.deletePost);

export const postRouter: Router = router;
