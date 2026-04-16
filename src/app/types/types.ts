import { Role } from "@prisma/client";

export interface IJWTUserPayload {
  email: string;
  role: Role;
}
