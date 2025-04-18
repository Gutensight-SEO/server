/** @format */


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
        }
    }
}

// Add this to global.d.ts
declare module "http" {
    interface IncomingHttpHeaders {
      "x-api-key"?: string; // Add custom headers here
    }
}