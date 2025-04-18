/** @format */

import { IncomingHttpHeaders } from 'http';


export {};

declare global {
    namespace Express {
        interface Request {
            user?: { 
                id: string, 
                role: string 
            };
            logger?: any;
            apiKey?: string;
            headers?: IncomingHttpHeaders & {
                'x-api-key'?: string;
            };
        }
    }
}
