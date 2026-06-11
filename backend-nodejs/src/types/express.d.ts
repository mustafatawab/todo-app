import { TokenPayload } from "../shared/utils/jwt";

interface OrgType  {
  id : string,
  slug : string,
  role : string
}


declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      org? : OrgType
    }
  }
}
