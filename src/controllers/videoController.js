export const trending = (req, res) => {
    const videos = [
        {
            title : "First Video",
            rating : 5,
            comments : 2,
            createdAt : "2 minutes ago",
            views : 59,
            id : 1
        },
        {
            title : "second Video",
            rating : 5,
            comments : 2,
            createdAt : "2 minutes ago",
            views : 59,
            id : 2
        },
        {
            title : "Third Video",
            rating : 5,
            comments : 2,
            createdAt : "2 minutes ago",
            views : 59,
            id : 3
        },
    ];
    res.render("home", { pageTitle: "Home", videos });
}
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Video");
export const deleteVideo = (req, res) => res.send("delete Video");
export const upload = (req, res) => res.send("upload Video");
