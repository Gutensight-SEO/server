/** @format */


import multer from "multer";


// specify the storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "../../public/uploads");
    },
    filename: (_req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/pdf" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        callback(null, true);
    } else {
        const error: any = new multer.MulterError("LIMIT_UNEXPECTED_FILE", "File type is incorrect!");
        callback(error, false);
    }
};

const fileUploader = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

export default fileUploader;