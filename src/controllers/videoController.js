export const trending = (req, res) => res.render("home");
export const see = (req, res) => {
	res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => res.send("Edit Video");
export const search = (req, res) => res.send("Search Video");
export const deleteVideo = (req, res) => res.send("delete Video");
export const upload = (req, res) => res.send("upload Video");
