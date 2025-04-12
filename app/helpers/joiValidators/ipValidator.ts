/** @format */


import * as IpAddress from "ip-address";


const LOCALHOST_IPS: readonly string[] = [
    "::1",
    "::ffff:127.0.0.1",
    "127.0.0.1",
];

type IpValidationResult = {
    isValid: boolean;
    reason?: string;
}

export const validateClientIp = (ip: string | undefined): boolean => {
    try {
        if (!ip) return false;
        
        return IpAddress.Address4.isValid(ip) || IpAddress.Address6.isValid(ip);
    } catch (error) {
        return false;
    }
}

/**
 * Validates if the provided IP address is valid and not a localhost address
 * @params ip - The IP address to validate
 * @returns IpValidationResult - Contains validation result and optional reason
 */
export const validateIp = (ip: string | undefined): IpValidationResult => {
    if (!ip) return {
        isValid: false,
        reason: "IP is empty"
    }

    if (LOCALHOST_IPS.includes(ip)) {
        return {
            isValid: false,
            reason: "Localhost IP is not allowed"
        }
    }

    return {
        isValid: validateClientIp(ip),
        reason: validateClientIp(ip) ? "Valid IP format" : "Invalid IP format"
        // reason: validateClientIp(ip) ? undefined : "Invalid IP format"
    }
}