import express, { Router } from "express";
import { commentConroller } from "./comment.controller";
import authMiddleware, { UserRole } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/:commentId", commentConroller.getCommentById);

router.get("/author/:authorId", commentConroller.getCommentByAuthorId);

router.post("/", authMiddleware(UserRole.USER, UserRole.ADMIN), commentConroller.createComment);

router.delete("/:commentId", authMiddleware(UserRole.USER, UserRole.ADMIN), commentConroller.deleteComment);

export const commentRouter: Router = router;