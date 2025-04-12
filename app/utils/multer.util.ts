/** @format */


import multer from "multer";


// specify the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../../public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/pdf" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformatsofficedocument.wordprocessingml.document"
    )
        cb(null, true);
    else {
        var newError = new Error("File type is incorrect!");
        newError.name = "MulterError";
        cb(newError, false);
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