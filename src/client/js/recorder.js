const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

/** 전역 변수 비디오 stream */
let stream;
/** 전역 변수 리코더 */
let recorder;
/** 전역 변수 녹화된 비디오 파일 */
let videoFile;

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
/** 비디오 다운로드 */
const handlDownload = async () => {
  /** ffmpeg 선언 */
  const ffmpeg = createFFmpeg({ log: true });
  // 사용자 브라우저가 작동하는데 무거울 수도 있으니 기다려줘야 되서 await
  await ffmpeg.load();
  // 바이너리 데이터로 파일 만들기
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  // 만들어진 파일을 mp4파일로 변환
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "recording.mp4");
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};
/** 비디오 녹화 종료 */
const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handlDownload);

  recorder.stop();
};

/** 비디오 녹화 시작 */
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

videoInit();
startBtn.addEventListener("click", handleStart);
