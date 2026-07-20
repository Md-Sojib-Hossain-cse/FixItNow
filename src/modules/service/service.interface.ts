export type TCreateService = {
    technicianProfileId : string;
    categoryId : string;
    title : string;
    price : number;
    type ?: "ONLINE" | "OFFLINE";
    durationInHour : number;
    description ?: string;
    isActive ?: boolean;
}


export type TUpdateService = {
  categoryId?: string;
  title?: string;
  price?: number;
  type ?: "ONLINE" | "OFFLINE";
  rating ?: number;
  durationInHour?: number;
  description?: string;
  isActive?: boolean;
};


export type TServiceQuery = {
    category ?: string;
    rating ?: number;
    type ?: "ONLINE" | "OFFLINE";
    minPrice ?: number;
    maxPrice ?: number;
    searchTerm ?: string;
    page ?: number;
    limit ?: number;
    sortBy ?: "title" | "createdAt" | "price";
    sortOrder ?: "asc" | "desc";
}