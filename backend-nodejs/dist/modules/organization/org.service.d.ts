import type { CreateOrganizationInput, JoinOrganizationInput } from "./org.schema";
export declare const createOrganization: (input: CreateOrganizationInput, userId: string) => Promise<any>;
export declare const listUserOrganizations: (userId: string) => Promise<any>;
export declare const joinOrganization: (input: JoinOrganizationInput, userId: string) => Promise<{
    message: string;
    slug: any;
}>;
export declare const getInviteCode: (orgId: string) => Promise<{
    inviteCode: any;
}>;
export declare const resetInviteCode: (orgId: string) => Promise<{
    inviteCode: any;
}>;
//# sourceMappingURL=org.service.d.ts.map