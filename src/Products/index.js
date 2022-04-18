import { fileURLToPath } from 'url';
import express from "express";
import multer from "multer"
import path from "path";

import get from "./get.js";
import post from "./post.js";
import put from "./put.js";
import Delete from "./delete.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fileFilterPhoto = (req, file, cb) => {
    console.log(file)
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const imageUpload = multer({
    storage: multer.diskStorage({
        destination: __dirname+"/../public/img",
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix+path.extname(file.originalname))
        },
    }),
    fileFilter: fileFilterPhoto,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})


const router = express.Router()
router.get("/products",get)
router.post("/products",imageUpload.single("photo"),post)
router.put("/products",imageUpload.single("photo"),put)
router.delete("/products",Delete)

export default router
