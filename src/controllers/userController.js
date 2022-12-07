import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, locations } = req.body;
  const pageTitle = "Join";
  // password가 일치한지 check
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation deos not match.",
    });
  }

  // 이미 사용중인 email, username check
  // const exist = await User.exists({ $or: [{ username }, { email }] });
  // const exist = existEmailAndUsername(username, email);
  if (!existEmailAndUsername(username, email)) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email/username is already taken.",
    });
  }
  try {
    await User.create({
      email,
      username,
      password,
      name,
      locations,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, locations },
    file,
  } = req;

  const sessionUsername = req.session.user.username;
  const sessionUserEmail = req.session.user.email;
  if (sessionUsername !== username || sessionUserEmail !== email) {
    // 이미 사용중인 email, username check
    if (existEmailAndUsername(username, email)) {
      return res.status(400).render("users/edit-profile", {
        pageTitle: "Edit",
        errorMessage: "This email/username is already taken.",
      });
    }
  }

  await User.findByIdAndUpdate(_id, {
    avatarUrl: file ? file.path : avatarUrl,
    name,
    email,
    username,
    locations,
  });
  req.session.user = {
    ...req.session.user,
    name,
    email,
    username,
    locations,
  };
  return res.redirect("/users/edit");
};
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  // username 이 존재하지 않는다, 미 가입 회원
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  // 비번 불일치
  if (!isPasswordMatch) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENTID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const accessBaseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENTID,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const accessFinalUrl = `${accessBaseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(accessFinalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    // access api
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: { authorization: `Bearer ${access_token}` },
      })
    ).json();
    const emailObject = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObject) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObject.email });
    if (!user) {
      // create an account
      user = await User.create({
        email: emailObject.email,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        password: "",
        name: userData.name,
        locations: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = async (req, res) => {
  // 세션에 정보가 존재하는 경우
  if (req.session) {
    await req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        return res.redirect("/");
      }
    });
  } else {
    console.log("세션에 정보가 없음");
    console.log("session = ", req.session);
    return res.redirect("/login");
  }
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  // send notification
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword1 },
  } = req;

  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPassword1) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The Password does not match the confirmation",
    });
  }

  user.password = newPassword;
  // User.js에 작성한 middleware에서 비번을 암호화 하는 로직을 사용하기 위해 save 호출
  await user.save();
  return res.redirect("/users/logout");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }

  return res.render("users/profile", { pageTitle: user.name, user });
};

const existEmailAndUsername = async (username, email) => {
  console.log("username = ", username, " , email = ", email);
  const isExist = await User.exists({ $or: [{ username }, { email }] });
  console.log("isExist = ", isExist);
  return isExist;
};
