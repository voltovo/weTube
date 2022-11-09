import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { email, username, password, password2, name, locations } = req.body;
  // password가 일치한지 check
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation deos not match.",
    });
  }
  // 이미 사용중인 email, username check
  const exist = await User.exists({ $or: [{ username }, { email }] });
  if (exist) {
    return res.status(400).render("join", {
      pageTitle: "Join",
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
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
export const edit = (req, res) => res.send("Edit user");
export const remove = (req, res) => res.send("Remove user");
export const login = (req, res) => res.send("log In");
export const logout = (req, res) => res.send("log Out");
export const see = (req, res) => res.send("See User");
