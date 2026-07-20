export type TCreateService = {
    technicianProfileId : string;
    categoryId : string;
    title : string;
    price : number;
    durationInHour : number;
    description ?: string;
    isActive ?: boolean;
}


export type TUpdateService = {
  categoryId?: string;
  title?: string;
  price?: number;
  durationInHour?: number;
  description?: string;
  isActive?: boolean;
};