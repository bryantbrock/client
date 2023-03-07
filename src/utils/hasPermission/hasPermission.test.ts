import { hasPermission } from "./hasPermission";
import { UserWithRelations } from "types/schema";

// Test Suite for the `hasPermission` function
describe("hasPermission", () => {
  const user = {
    id: 1,
    name: "Test User",
    role: {
      name: "Test Role",
      permissions:
        "write:final_document,update:final_document,delete:final_document,*:users",
    },
  };

  // Test Case 1: Check if `hasPermission` function exists
  it("should exist", () => {
    expect(hasPermission).toBeDefined();
  });

  // Test Case 2: Check if `hasPermission` function returns true for superadmin
  it("should return true for superadmin", () => {
    const superadmin = {
      id: 2,
      name: "Superadmin User",
      role: {
        name: "super-admin",
        permissions: "*:*",
      },
    };
    const hasPerm = hasPermission(
      "write:final_document",
      superadmin as UserWithRelations
    );
    expect(hasPerm).toBe(true);
  });

  // Test Case 3: Check if `hasPermission` function returns true for matching permission
  it("should return true for matching permission", () => {
    const hasPerm = hasPermission(
      "write:final_document",
      user as UserWithRelations
    );
    expect(hasPerm).toBe(true);
  });

  // Test Case 4: Check if `hasPermission` function returns false for non-matching permission
  it("should return false for non-matching permission", () => {
    const hasPerm = hasPermission(
      "delete:template_document",
      user as UserWithRelations
    );
    expect(hasPerm).toBe(false);
  });

  // Test Case 5: Check if `hasPermission` function handles wildcard permission correctly
  it("should handle wildcard permission correctly", () => {
    const hasPerm1 = hasPermission("read:users", user as UserWithRelations);
    expect(hasPerm1).toBe(true);
    const hasPerm2 = hasPermission(
      "delete:template_document",
      user as UserWithRelations
    );
    expect(hasPerm2).toBe(false);
  });
});
