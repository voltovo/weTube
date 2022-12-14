const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: { min: 1280 }, height: { min: 720 } },
  });
  console.log("stream = ", stream);
  video.srcObject = stream;
  video.play();
};

startBtn.addEventListener("click", handleStart);
