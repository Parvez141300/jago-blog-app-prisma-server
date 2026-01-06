import { Request, Response } from "express"
import { commentService } from "./comment.service";

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.getCommentByIdFromDB(commentId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to fetch a comment",
            message: error.message,
            details: error
        });
    }
}

const getCommentByAuthorId = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        console.log(authorId);
        const result = await commentService.getCommentByAuthorIdFromDB(authorId);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to fetch comment",
            message: error.message,
            details: error
        });
    }
}

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

const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentService.deleteCommentFromDB(commentId as string, user?.id as string);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to delete a comment",
            message: error.message,
            details: error
        });
    }
}

export const commentConroller = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment
}