import { prisma } from "../../lib/prisma";

const createCommentIntoDB = async (payload: {
    content: string,
    author_id: string,
    post_id: string,
    parent_id?: string
}) => {
    console.log(payload);
    const result = await prisma.comment.create({
        data: payload
    });
    return result;
}

export const commentService = {
    createCommentIntoDB,
}