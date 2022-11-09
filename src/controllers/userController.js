import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  console.log(req.body);
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
  const exist = await User.exists({ $or: [{ username }, { email }] });
  if (exist) {
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
export const edit = (req, res) => res.send("Edit user");
export const remove = (req, res) => res.send("Remove user");
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
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
  res.redirect("/");
};
export const logout = (req, res) => res.send("log Out");
export const see = (req, res) => res.send("See User");
