import type { CreateOrganizationInput, JoinOrganizationInput } from "./org.schema.js";
export declare const createOrganization: (input: CreateOrganizationInput, userId: string) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    slug: string;
    inviteCode: string;
}>;
export declare const listUserOrganizations: (userId: string) => Promise<{
    id: string;
    name: string;
    slug: string;
    role: import("../../../generated/prisma/index.js").$Enums.Role;
    createdAt: Date;
}[]>;
export declare const joinOrganization: (input: JoinOrganizationInput, userId: string) => Promise<{
    message: string;
    slug: string;
}>;
export declare const getInviteCode: (orgId: string) => Promise<{
    inviteCode: string;
}>;
export declare const resetInviteCode: (orgId: string) => Promise<{
    inviteCode: string;
}>;
//# sourceMappingURL=org.service.d.ts.map