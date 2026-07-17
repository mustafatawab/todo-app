import { z } from "zod";
export const createOrganizationSchema = z.object({
    name: z.string().min(2, "Organization name must be at least 2 characters long"),
});
export const joinOrganizationSchema = z.object({
    code: z.string().min(3, "Invite Code is required and must be at least 3 characters")
});
//# sourceMappingURL=org.schema.js.map