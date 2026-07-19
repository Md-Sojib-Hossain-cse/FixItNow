import type { Prisma } from "../../../../generated/prisma/client";

export type TCreateCategory = {
    name : string;
    slug ?: string;
    description ?: string;
    icon ?: string;
}

export type TCategoryQuery = {
        isDeleted ?: string;
        searchTerm ?: string;
        page ?: number;
        limit ?: number;
        sortBy ?: keyof Prisma.CategoriesOrderByWithRelationInput;
        sortOrder ?: "asc" | "desc";
}