import type { CreateMemberInput, UpdateMemberInput } from "./member.schema";
export declare const getMembers: (orgId: string) => Promise<any>;
export declare const createMember: (input: CreateMemberInput, orgId: string) => Promise<{
    message: string;
}>;
export declare const updateMember: (input: UpdateMemberInput, orgId: string, userId: string) => Promise<{
    message: string;
}>;
export declare const deleteMember: (orgId: string, userId: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=member.service.d.ts.map