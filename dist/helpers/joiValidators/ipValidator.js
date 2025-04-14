"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIp = exports.validateClientIp = void 0;
const IpAddress = __importStar(require("ip-address"));
const LOCALHOST_IPS = [
    "::1",
    "::ffff:127.0.0.1",
    "127.0.0.1",
];
const validateClientIp = (ip) => {
    try {
        if (!ip)
            return false;
        return IpAddress.Address4.isValid(ip) || IpAddress.Address6.isValid(ip);
    }
    catch (error) {
        return false;
    }
};
exports.validateClientIp = validateClientIp;
/**
 * Validates if the provided IP address is valid and not a localhost address
 * @params ip - The IP address to validate
 * @returns IpValidationResult - Contains validation result and optional reason
 */
const validateIp = (ip) => {
    if (!ip)
        return {
            isValid: false,
            reason: "IP is empty"
        };
    if (LOCALHOST_IPS.includes(ip)) {
        return {
            isValid: false,
            reason: "Localhost IP is not allowed"
        };
    }
    return {
        isValid: (0, exports.validateClientIp)(ip),
        reason: (0, exports.validateClientIp)(ip) ? "Valid IP format" : "Invalid IP format"
        // reason: validateClientIp(ip) ? undefined : "Invalid IP format"
    };
};
exports.validateIp = validateIp;
