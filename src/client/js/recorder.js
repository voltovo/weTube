const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

/** 전역 변수 비디오 stream */
let stream;

/** 비디오 초기화 */
const videoInit = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: { min: 640 }, height: { min: 360 } },
  });
  console.log("stream = ", stream);
  video.srcObject = stream;
  video.play();
};

/** 비디오 녹화 종료 */
const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
};

/** 비디오 녹화 시작 */
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log("recorder done");
    console.log(e.data);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

// videoInit();
startBtn.addEventListener("click", handleStart);
