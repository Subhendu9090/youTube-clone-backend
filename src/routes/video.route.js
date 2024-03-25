import { Router } from "express";
import { getAllVideos, publishAVideo, getVideoById, toogleVideo, deleteVideo, updateVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/getAllVideos").get(verifyJWT,getAllVideos)
router.route("/publishVideo").post(verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo)

router.route("/v/:videoId").get(verifyJWT,getVideoById)   
router.route("/d/:videoId").get(verifyJWT,deleteVideo) 
router.route("/u/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/t/:videoId").get(verifyJWT,toogleVideo)
export default router
