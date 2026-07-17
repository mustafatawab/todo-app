import { z } from "zod";
export declare const createOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const joinOrganizationSchema: z.ZodObject<{
    code: z.ZodString;
}, z.core.$strip>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type JoinOrganizationInput = z.infer<typeof joinOrganizationSchema>;
//# sourceMappingURL=org.schema.d.ts.map