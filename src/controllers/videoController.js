const fakeUser = {
    username : "sumanChoi",
    loggedIn : true,
}

export const trending = (req, res) => res.render("home", { pageTitle: "Home", fakeUser });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Video");
export const deleteVideo = (req, res) => res.send("delete Video");
export const upload = (req, res) => res.send("upload Video");
