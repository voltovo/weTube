const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");

  const newComment = document.createElement("li");
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const commentSpan = document.createElement("span");
  commentSpan.innerText = ` ${text}`;

  newComment.appendChild(icon);
  newComment.appendChild(commentSpan);

  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  console.log("text = ", text);
  const videoId = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
  if (status === 201) {
    console.log("create comments !");
    addComment(text);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
