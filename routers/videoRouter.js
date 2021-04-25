import express from "express";
import {
  deleteVideo,
  postUpload,
  getUpload,
  videoDetail,
  getEditVideo,
  postEditVideo,
} from "../controllers/videoController";
import { uploadVideo } from "../middlewares";
import routes from "../routes";

const videoRouter = express.Router();

//upload Video
videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, uploadVideo, postUpload);
//video Detail
videoRouter.get(routes.videoDetail(), videoDetail);
//edit Video
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(), postEditVideo);
//delete Video
videoRouter.get(routes.deleteVideo(), deleteVideo);

export default videoRouter;
