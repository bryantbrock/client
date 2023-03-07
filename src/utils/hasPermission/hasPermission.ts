import { Role, User } from "@prisma/client";
import { PermissionType, RoleName } from "types/schema";

export const hasPermission = (
  requestedPermission: PermissionType,
  user: User & { role?: Role }
): Boolean => {
  if (user.roleName === RoleName.Admin) {
    return true;
  }

  const [requestedAction, requestedModule] = requestedPermission.split(":");

  return !!user.role?.permissions.split(",").find((perm: string) => {
    const [action, mod] = perm.split(":");
    return (
      (mod === requestedModule || mod === "*") &&
      (action === requestedAction || action === "*")
    );
  });
};
