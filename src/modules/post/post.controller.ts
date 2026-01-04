import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post_status } from "../../../generated/prisma/enums";


const getAllOrSearchPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        // const isFeatured = req.query.isFeatured ? req.query.isFeatured === 'true' : undefined;
        const isFeatured = req.query.isFeatured ?
            req.query.isFeatured === 'true' ?
                true :
                req.query.isFeatured === 'false' ?
                    false : undefined : undefined;
        const status = req.query.status as Post_status || undefined;
        const author_id = req.query.author_id as string || undefined;
        const result = await PostService.getAllOrSearchPostFromDB({ search: searchString, tags, isFeatured, status, author_id });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to create post",
            message: error.message,
            details: error
        });
    }
};

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.createPostIntoDB(req.body, user.id);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to create post",
            message: error.message,
            details: error,
        });
    }
};

export const PostController = {
    createPost,
    getAllOrSearchPost
};