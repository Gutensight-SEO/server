"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// specify the storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "../../public/uploads");
    },
    filename: (_req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});
const fileFilter = (_req, file, callback) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/pdf" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        callback(null, true);
    }
    else {
        const error = new multer_1.default.MulterError("LIMIT_UNEXPECTED_FILE", "File type is incorrect!");
        callback(error, false);
    }
};
const fileUploader = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});
exports.default = fileUploader;
