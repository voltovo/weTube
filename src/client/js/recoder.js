const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recoder;

const handleDownload = () => {};

const handleStop = () => {
  startBtn.innerText = "Download Recoding";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recoder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recoding";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recoder = new MediaRecorder(stream);
  recoder.ondataavailable = (event) => {
    const videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recoder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
