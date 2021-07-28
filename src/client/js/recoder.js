const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const handleStop = () => {
  startBtn.innerText = "Start Recoding";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
  startBtn.innerText = "Stop Recoding";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  const recoder = new MediaRecorder(stream);
  recoder.ondataavailable = (e) => {
    console.log("recoding done");
    console.log(e);
    console.log(e.data);
  };
  console.log(recoder);
  recoder.start();
  console.log(recoder);
  setTimeout(() => {
    recoder.stop();
  }, 10000);
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
