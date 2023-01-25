const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".delete__comment");
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

/*
 * 화면에 그린 댓글 지우기
 * */
const deleteCommentNode = (li) => {
  const ul = li.parentNode;
  ul.removeChild(li);
};

const handleComment = async (event) => {
  const li = event.target.parentNode;

  const commentId = li.dataset.commentid;
  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status === 200) {
      deleteCommentNode(li);
    }
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
  deleteBtns.forEach((deleteBtn) =>
    deleteBtn.addEventListener("click", handleComment)
  );
}
