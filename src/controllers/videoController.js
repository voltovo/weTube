import Video from "../models/Video";
import Comment from "../models/Comments";
import User from "../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("Server-error", { error });
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  console.log("watch video = ", video);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `Edit : ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  const videoData = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // 비디오 생성자 와 로그인 유저가 같은지 비교
  if (String(videoData.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Chnages saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumbnail },
  } = req;
  const isHeroku = res.locals.isHeroku;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : "/" + video[0].path,
      thumbnailUrl: isHeroku ? thumbnail[0].location : "/" + thumbnail[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }

  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  console.log("count view");
  const { id } = req.params;
  const video = await Video.findById(id);
  console.log("registerView_video = ", video);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views++;
  await video.save();
  return res.sendStatus(200);
};

/*
 * 비디오 코멘트 생성
 **/
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id: videoId },
  } = req;

  const video = await Video.findById(videoId);
  console.log("comments_video = ", video);
  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: videoId,
  });

  // 해당 비디오의 댓글 배열에 추가
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

/*
 * 비디오 코멘트 삭제
 * */
export const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  const comment = await Comment.findById(commentId);
  const video = await Video.findById(comment.video);

  if (!video) {
    return res.sendStatus(404);
  }

  console.log("comment = ", comment);
  const videoCommentArray = video.comments;
  const comments = videoCommentArray.filter((element) => {
    const commentObjId = element._id;
    return !commentObjId.equals(commentId);
  });
  console.log("newVideoComments = ", comments);
  // 비디오 comments 배열 적용
  video.comments = comments;
  video.save();
  // 코멘트 삭제
  await Comment.deleteOne({ _id: commentId });

  return res.sendStatus(200);
};
