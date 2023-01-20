const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, commentId) => {
  const videoComments = document.querySelector(".video__comments ul");

  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.commentid = commentId;

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const commentSpan = document.createElement("span");
  commentSpan.innerText = ` ${text}`;

  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = " ❌";

  newComment.appendChild(icon);
  newComment.appendChild(commentSpan);
  newComment.appendChild(deleteSpan);

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
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    textarea.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
