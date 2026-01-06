import { Request, Response } from "express"

const createComment = async (req: Request, res: Response) => {
    try {
        
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