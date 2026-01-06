import express, { Router } from "express";
import { commentConroller } from "./comment.controller";
import authMiddleware, { UserRole } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware(UserRole.USER, UserRole.ADMIN), commentConroller.createComment);

export const commentRouter: Router = router;