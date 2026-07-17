import { createMemberSchema, updateMemberSchema } from "./member.schema";
import { createMember, deleteMember, getMembers, updateMember, } from "./member.service";
export const createMemberHandler = async (req, res, next) => {
    try {
        const validatedData = createMemberSchema.parse(req.body);
        const orgId = req.org?.id;
        const result = await createMember(validatedData, orgId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
export const getMembersHandlers = async (req, res, next) => {
    try {
        const result = await getMembers(req.org.id);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const updateMembersHandler = async (req, res, next) => {
    try {
        const validatedData = updateMemberSchema.parse(req.body);
        const result = await updateMember(validatedData, req.org.id, req.params.userId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
export const deleteMemberHandler = async (req, res, next) => {
    try {
        const result = await deleteMember(req.org.id, req.params?.userId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
//# sourceMappingURL=member.controller.js.map