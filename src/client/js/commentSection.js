const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  console.log("text = ", text);
  const videoId = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
