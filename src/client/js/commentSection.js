const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textares = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault();
  const text = textares.value;
  console.log("text = ", text);
  console.log("videoid = ", videoContainer.dataset.videoid);
};

btn.addEventListener("click", handleSubmit);
