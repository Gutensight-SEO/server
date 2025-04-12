/** @format */


declare global {
    namespace Express {
        interface Request {
            user?: { 
                id: string, 
                role: string 
            };
            logger?: any;
        }
    }
}
