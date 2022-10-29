import { add } from "nodemon/lib/rules";
import Video from {", (error, videos. => {}./models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {});
  res.render("home", { pageTitle: "Home" });
};
export const watch = (req, res) => {
  const { id } = req.params;
  res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  // here we will add a video to he videos array.
  const { title } = req.body;
  const newVideo = {
    title: title,
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: videos.length + 1,
  };
  return res.redirect("/");
};
