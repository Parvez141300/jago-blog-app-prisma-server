import express, { Router } from 'express';
import { PostController } from './post.controller';
import authMiddleware, { UserRole } from '../../middleware/authMiddleware';

const router = express.Router();

// get all or search post
router.get("/", authMiddleware(UserRole.USER), PostController.getAllOrSearchPost);
// create a post
router.post("/", authMiddleware(UserRole.USER), PostController.createPost);
   
export const postRouter: Router = router;
