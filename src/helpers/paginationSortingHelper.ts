type Options = {
    page?: number;
    limit?: number;
    sortOrder?: string;
    sortBy?: string;
}

type OptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

const paginationSortingHelper = (options: Options): OptionsResult => {
    // for pagination
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (page - 1) * limit;
    // for sorting
    const sortBy: string = options.sortBy || "created_at";
    const sortOrder: string = options.sortOrder || "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
}

export default paginationSortingHelper;