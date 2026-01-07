import { Comment_status } from "../../../generated/prisma/enums";
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

const updateCommentIntoDB = async (commentId: string, data: { content?: string, status?: Comment_status }, authorId: string) => {
    console.log(commentId, data, authorId);
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            author_id: authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is not valid!!!");
    }

    const result = await prisma.comment.update({
        where: {
            id: commentId,
            author_id: authorId
        },
        data: {
            content: data.content as string,
            status: data.status as Comment_status
        }
    })

    return result;
}

const moderateCommentFromDB = async (commentId: string, data: { status: Comment_status }) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        select: {
            id: true,
            status: true
        }
    });

    if(commentData.status === data.status){
        throw new Error(`Status is already in (${commentData.status}) status`);
    };

    const result = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            ...data
        }
    });

    return result;
}

const deleteCommentFromDB = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            author_id: authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
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
    deleteCommentFromDB,
    updateCommentIntoDB,
    moderateCommentFromDB,
}