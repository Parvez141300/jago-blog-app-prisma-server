import express, { Router } from "express";
import { commentConroller } from "./comment.controller";

const router = express.Router();

router.post("/comments", commentConroller.createComment)

export const commentRouter: Router = router;