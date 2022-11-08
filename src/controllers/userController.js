export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const edit = (req, res) => res.send("Edit user");
export const remove = (req, res) => res.send("Remove user");
export const login = (req, res) => res.send("log In");
export const logout = (req, res) => res.send("log Out");
export const see = (req, res) => res.send("See User");
