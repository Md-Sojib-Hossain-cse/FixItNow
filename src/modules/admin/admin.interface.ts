import type { Roles, UserStatus } from "../../../generated/prisma/enums";

export type TUserQuery = {
    status ?: UserStatus;
    isDeleted ?: string;
    role ?: Roles;
    searchTerm ?: string;
    page ?: number;
    limit ?: number;
    sortBy ?: string;
    sortOrder ?: "asc" | "desc";
}