import { prisma } from "../../lib/prisma";

const createCommentIntoDB = async (payload: {
    content: string,
    author_id: string,
    post_id: string,
    parent_id?: string
}) => {
    console.log(payload);
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.post_id
        }
    })
    if(payload.parent_id){
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parent_id
            }
        })
    }
    const result = await prisma.comment.create({
        data: payload
    });
    return result;
}

export const commentService = {
    createCommentIntoDB,
}