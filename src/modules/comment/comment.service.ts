import { prisma } from "../../lib/prisma";

const getCommentByIdFromDB = async (commentId: string | undefined) => {
    const result = await prisma.comment.findUnique({
        where: {
            id: commentId as string
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    });
    return result;
}

const getCommentByAuthorIdFromDB = async (authorId: string | undefined) => {
    const result = await prisma.comment.findMany({
        where: {
            author_id: authorId as string
        },
        orderBy: {
            created_at: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });
    return result;
}

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
    if (payload.parent_id) {
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

const deleteCommentFromDB = async (commentId: string, authorId: string ) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            author_id: authorId
        },
        select: {
            id: true
        }
    })

    if(!commentData){
        throw new Error("Your provided input is not valid!!!");
    }
    console.log(commentData);
    const result = await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })

    return result;
}

export const commentService = {
    createCommentIntoDB,
    getCommentByIdFromDB,
    getCommentByAuthorIdFromDB,
    deleteCommentFromDB
}