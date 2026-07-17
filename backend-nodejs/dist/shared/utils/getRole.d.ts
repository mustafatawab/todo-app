export declare const getUserRole: (userId: string, orgId: string) => Promise<{
    role: import("../../../generated/prisma/index.js").$Enums.Role;
    user: {
        orgMemberships: {
            userId: string;
            id: string;
            role: import("../../../generated/prisma/index.js").$Enums.Role;
            joinedAt: Date;
            orgId: string;
        }[];
    } & {
        password: string;
        name: string;
        email: string;
        username: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
//# sourceMappingURL=getRole.d.ts.map