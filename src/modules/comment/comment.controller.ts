import { Request, Response } from "express"
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const comment = req.body;
        const user = req.user;
        comment.author_id = user?.id;
        const result = await commentService.createCommentIntoDB(comment);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to create a comment",
            message: error.message,
            details: error
        });
    }
}

export const commentConroller = {
    createComment,
}