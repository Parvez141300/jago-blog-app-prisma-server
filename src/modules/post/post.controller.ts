import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import { Post_status } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/authMiddleware";


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
        // pagination and sorting function
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
        // result
        const result = await PostService.getAllOrSearchPostFromDB({ search: searchString, tags, isFeatured, status, author_id, page, limit, skip, sortBy, sortOrder });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to get all post",
            message: error.message,
            details: error
        });
    }
};

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post id is required!!!");
        }
        const result = await PostService.getPostByIdFromDB(postId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({
            error: "Failed to get a post",
            message: error.message,
            details: error
        });
    }
};

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log(user?.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.getMyPostsFromDB(user.id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to get my post",
            message: error.message,
            details: error,
        });
    }
}

const getStats = async (req: Request, res: Response) => {
    try {
        const result = await PostService.getStatsFromDB();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to get post stats",
            message: error.message,
            details: error,
        });
    }
}

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.createPostIntoDB(req.body, user.id);
        res.status(201).json(result);
    } catch (error: any) {
        next(error);
    }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { postId } = req.params;
        const isAdmin = user?.role === UserRole.ADMIN;
        console.log(isAdmin);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.updatePostIntoDB(postId as string, user.id, req.body, isAdmin);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
}

const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { postId } = req.params;
        const isAdmin = user?.role === UserRole.ADMIN;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.deletePostFromDB(postId as string, user?.id, isAdmin);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to delete a post",
            message: error.message,
            details: error,
        });
    }
}

export const PostController = {
    createPost,
    getAllOrSearchPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats,
};