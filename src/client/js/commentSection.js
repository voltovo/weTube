import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".fas.fa-times");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.commentid = id;
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  const delIcon = document.createElement("i");
  delIcon.className = "fas fa-times";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(delIcon);
  //클릭 시 삭제 이벤트 생성
  delIcon.addEventListener("click", deleteComment);

  videoComments.prepend(newComment);
};

const deleteComment = async (event) => {
  const comment = event.target;
  const commentId = comment.parentNode.dataset.commentid;
  const videoId = videoContainer.dataset.videoid;

  if (commentId === "") {
    return;
  }

  const response = await fetch(`/api/videos/${commentId}/deleteComment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });

  if (response.status === 201) {
    const commentParent = comment.parentNode;
    commentParent.parentNode.removeChild(commentParent);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (delBtn) {
  delBtn.forEach((del) => del.addEventListener("click", deleteComment));
}
