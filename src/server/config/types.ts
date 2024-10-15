import { jwtPayload } from "../dto/jwt";
declare global {
    namespace Express {
        interface Request {
            user?: { email: string };         }
    }
}
