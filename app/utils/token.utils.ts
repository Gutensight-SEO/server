/** @format */


import jwt from "jsonwebtoken";


const generateToken = (id: string, option: string) => {   
    switch (option) {
        case 'access':
            return jwt.sign({ id }, 
                process.env.ACCESS_TOKEN_SECRET!, 
                { expiresIn: "7d", }
            );
            break; // leaving this cause i am paranoid.
        case 'refresh':
            return jwt.sign({ id },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: "30d", }
            );
            break;
        case 'email':
            return jwt.sign({ id },
                process.env.EMAIL_CONFIRMATION_TOKEN_SECRET!,
                { expiresIn: "1d", }
            );
            break; 
        case 'forgot_password':
            return jwt.sign({ id },
                process.env.FORGOT_PASSWORD_TOKEN_SECRET!,
                { expiresIn: "30m", }
            );
            break;
        default:
            return null;
            // break;
    }
}


export default generateToken;