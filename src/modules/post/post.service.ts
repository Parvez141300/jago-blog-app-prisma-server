import { Comment_status, Post, Post_status } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// get all or search post from db
const getAllOrSearchPostFromDB = async (payload: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: Post_status,
    author_id: string | undefined,
    page: number, limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}) => {
    const addConditions: PostWhereInput[] = [];
    const sortBy = payload.sortBy;
    if (payload.search) {
        addConditions.push({
            OR: [
                {
                    title: {
                        contains: payload.search as string,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: payload.search as string,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: payload.search as string
                    }
                },
            ],
        })
    }
    if (payload.tags.length > 0) {
        addConditions.push({
            tags: {
                hasEvery: payload.tags
            }
        })
    }
    if (typeof payload.isFeatured === 'boolean') {
        addConditions.push({
            isFeatured: payload.isFeatured
        })
    }
    if (payload.status) {
        addConditions.push({
            status: payload.status
        })
    }
    if (payload.author_id) {
        addConditions.push({
            author_id: payload.author_id
        })
    }
    const allPost = await prisma.post.findMany({
        take: payload.limit,
        skip: payload.skip,
        where: {
            AND: addConditions
        },
        orderBy: {
            [sortBy as string]: payload.sortOrder
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: addConditions
        }
    })

    return {
        data: allPost,
        pagination: {
            total,
            page: payload.page,
            limit: payload.limit,
            totalPages: Math.ceil(total / payload.limit)
        }
    };
}

// get post form db by id
const getPostByIdFromDB = async (postId: string) => {
    const result = await prisma.$transaction(async (tx) => {
        const updateVeiwCount = await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parent_id: null,
                        status: Comment_status.APPROVED
                    },
                    orderBy: {
                        created_at: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: Comment_status.APPROVED
                            },
                            orderBy: {
                                created_at: "asc"
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: Comment_status.APPROVED
                                    },
                                    orderBy: {
                                        created_at: "asc"
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        });

        return postData;
    })

    return result;
}

// get my post form db
const getMyPostsFromDB = async (authorId: string) => {
    const userData = await prisma.user.findUnique({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true,
            status: true
        }
    });

    if (userData?.status !== "ACTIVE") {
        throw new Error("User is not active");
    }

    const result = await prisma.post.findMany({
        where: {
            author_id: authorId
        },
        orderBy: {
            created_at: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });

    const total = await prisma.post.count({
        where: {
            author_id: authorId
        }
    });


    return {
        data: result,
        total
    };
}

// create a post into db
const createPostIntoDB = async (data: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'author_id'>, userId: string) => {
    // logic to create a post in the database
    console.log(data);
    const result = await prisma.post.create({
        data: {
            ...data,
            author_id: userId,
        }
    });
    console.log(result);
    return result;
}

// update a post role based like user & admin
// user can only update his post and can't update his post's isFeatured field
// admin can update any users post and also can update the isFeatured field
const updatePostIntoDB = async (postId: string, authorId: string, data: Partial<Post>, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            author_id: true
        }
    });
    if (!isAdmin && (postData.author_id !== authorId)) {
        throw new Error("You are not the owner/creator of the post");
    };
    if(!isAdmin){
        delete data.isFeatured;
    }
    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            ...data
        }
    });

    return result;
}




export const PostService = {
    createPostIntoDB,
    getAllOrSearchPostFromDB,
    getPostByIdFromDB,
    getMyPostsFromDB,
    updatePostIntoDB,
}