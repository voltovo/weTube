import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { email, username, password, name, locations } = req.body;
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
