import { Post, Post_status } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllOrSearchPostFromDB = async (payload: { search: string | undefined, tags: string[] | [], isFeatured: boolean | undefined, status: Post_status, author_id: string | undefined }) => {
    const addConditions: PostWhereInput[] = [];
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
    if(typeof payload.isFeatured === 'boolean'){
        addConditions.push({
            isFeatured: payload.isFeatured
        })
    }
    if(payload.status){
        addConditions.push({
            status: payload.status
        })
    }
    if(payload.author_id){
        addConditions.push({
            author_id: payload.author_id
        })
    }
    const result = await prisma.post.findMany({
        where: {
            AND: addConditions
        }
    });
    return result;
}

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

export const PostService = {
    createPostIntoDB,
    getAllOrSearchPostFromDB,
}