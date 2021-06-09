const fakeUser = {
  userName: "suman",
  loggedIn: true,
};

export const edit = (req, res) => res.send("Edit Video", { pageTitle: "Edit" });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const trending = (req, res) => {
  const videos = [1, 2, 3, 4, 5, 6, 7, 8];
  return res.render("home", { pageTitle: "Home", fakeUser, videos });
};

export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
