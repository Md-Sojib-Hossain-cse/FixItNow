import type { Roles } from "../../../generated/prisma/enums";

export type TRegisterUser = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  avatar?: string;
  role: Roles;
};

export type TLoginUser = {
  email : string;
  password : string;
}