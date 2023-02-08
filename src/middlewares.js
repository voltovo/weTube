const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const path = require("path");

/*
 * aws 자격 증명
 * */
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
/*
 * 프로젝트 접속 상태 체크 heroku ? local?
 * */
const isHeroku = process.env.NODE_ENV === "production";
console.log("isHeroku = ", isHeroku);
/*
 * s3 이미지 업로드 multer
 * */
const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "sutube/images",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read",
  key: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now().toString() + extension);
  },
});

/*
 * s3 비디오 업로드 multer
 * */
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "sutube/videos",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read",
  key: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now().toString() + extension);
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  res.locals.isHeroku = isHeroku;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: { filesize: 3000000 },
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: { filesize: 10000000 },
  storage: isHeroku ? s3VideoUploader : undefined,
});
