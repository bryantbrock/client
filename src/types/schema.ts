import { User, Role } from "@prisma/client";

export type UserWithRelations = User & { role?: Role; distributor?: User };

type PermissionAction = "*" | "read" | "write" | "delete";
type PermissionModule =
  | "*"
  | "template_document"
  | "final_document"
  | "clients"
  | "settings"
  | "order"
  | "roles"
  | "users"
  | "tags";
export type PermissionType = `${PermissionAction}:${PermissionModule}`;

export enum RoleName {
  Admin = "admin",
  Distributor = "distributor",
  POL = "pol",
  ReferenceLab = "reference_lab",
}
