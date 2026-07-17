import type { Roles } from "../../generated/prisma/enums";

export type TJwtPayload = {
  id: string;
  name: string;
  email: string;
  role: Roles;
};